import type { LovelaceConfig } from "./config";
import type { HomeAssistant, LovelaceDashboard } from "./ha-types";

/**
 * The built-in default dashboard is not listed by `lovelace/dashboards/list`, and
 * it may be YAML- or strategy-backed: listing it lets the user try, and a write
 * failure surfaces the real reason from Home Assistant.
 */
export const DEFAULT_DASHBOARD: LovelaceDashboard = {
  id: "lovelace",
  url_path: "lovelace",
  title: "Overview",
  icon: "mdi:home",
  mode: "storage",
  show_in_sidebar: true,
};

export async function listDashboards(
  hass: HomeAssistant,
): Promise<LovelaceDashboard[]> {
  const dashboards = await hass.callWS<LovelaceDashboard[]>({
    type: "lovelace/dashboards/list",
  });
  const writable = dashboards.filter(
    (dashboard) =>
      dashboard.mode === "storage" && dashboard.url_path !== DEFAULT_DASHBOARD.url_path,
  );
  return [DEFAULT_DASHBOARD, ...writable];
}

export interface LovelaceResource {
  id?: string;
  type: string;
  url: string;
}

/**
 * Lovelace resources are loaded lazily, per dashboard. A panel that is not a
 * dashboard therefore sees an empty `window.customCards`, so the builder has to
 * import the resources itself to know which cards exist.
 */
export async function listResources(
  hass: HomeAssistant,
): Promise<LovelaceResource[]> {
  const result = await hass.callWS<
    LovelaceResource[] | { resources?: LovelaceResource[] }
  >({ type: "lovelace/resources", url_path: DEFAULT_DASHBOARD.url_path });
  if (Array.isArray(result)) return result;
  const nested = result?.resources;
  return Array.isArray(nested) ? nested : [];
}

export async function fetchConfig(
  hass: HomeAssistant,
  urlPath: string,
): Promise<LovelaceConfig> {
  const config = await hass.callWS<LovelaceConfig | null>({
    type: "lovelace/config",
    url_path: urlPath,
  });
  return config ?? {};
}

export async function saveConfig(
  hass: HomeAssistant,
  urlPath: string,
  config: LovelaceConfig,
): Promise<void> {
  await hass.callWS({ type: "lovelace/config/save", url_path: urlPath, config });
}

export interface NewDashboard {
  urlPath: string;
  title: string;
  icon?: string;
}

export async function createDashboard(
  hass: HomeAssistant,
  dashboard: NewDashboard,
): Promise<void> {
  await hass.callWS({
    type: "lovelace/dashboards/create",
    url_path: dashboard.urlPath,
    title: dashboard.title,
    icon: dashboard.icon ?? "mdi:view-dashboard-edit-outline",
    mode: "storage",
    show_in_sidebar: true,
    require_admin: true,
  });
}

/** `hass.callWS` rejects with a translated error code in `message`. */
export function describeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Erreur inconnue";
}
