/** Minimal, hand-written typing of the Home Assistant frontend objects we touch. */

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface LovelaceDashboard {
  id: string;
  url_path: string;
  title?: string;
  icon?: string;
  mode: string;
  show_in_sidebar?: boolean;
  require_admin?: boolean;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callWS<T = unknown>(message: Record<string, unknown>): Promise<T>;
  user?: { is_admin?: boolean; name?: string };
}

/** Entry shape of the global `window.customCards` registry, without the `custom:` prefix. */
export interface CustomCardInfo {
  type: string;
  name?: string;
  description?: string;
  preview?: boolean;
  documentationURL?: string;
}

declare global {
  interface Window {
    customCards?: CustomCardInfo[];
  }
}
