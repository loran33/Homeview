import { LitElement, css, html, nothing } from "lit";

import {
  addSection,
  cardAt,
  cardsOf,
  insertCard,
  isStrategyConfig,
  moveCard,
  openDocument,
  removeCard,
  removeSection,
  sectionsOf,
  setCardGrid,
  slugify,
  targetView,
  toSaveConfig,
  updateCard,
} from "./config";
import type { BuilderDocument, GridPatch, Position } from "./config";
import { endDrag, startDrag } from "./dnd";
import type { DragPayload } from "./dnd";
import type { HomeAssistant, LovelaceDashboard } from "./ha-types";
import {
  DEFAULT_DASHBOARD,
  createDashboard,
  describeError,
  fetchConfig,
  listDashboards,
  saveConfig,
} from "./lovelace";
import { CATEGORY_LABELS, buildPalette } from "./palette";
import type { PaletteCategory, PaletteEntry } from "./palette";

const NEW_DASHBOARD = "__new__";

interface DropDetail {
  payload: DragPayload;
  to: Position;
}

/**
 * The panel shell: dashboard selection, palette, canvas and inspector.
 *
 * All config work happens in `config.ts`; this element only owns selection,
 * drag wiring and the WebSocket round-trips.
 */
export class HomeviewBuilder extends LitElement {
  static properties = {
    hass: { attribute: false },
    _dashboards: { state: true },
    _urlPath: { state: true },
    _mode: { state: true },
    _newTitle: { state: true },
    _doc: { state: true },
    _selected: { state: true },
    _palette: { state: true },
    _filter: { state: true },
    _dirty: { state: true },
    _busy: { state: true },
    _status: { state: true },
    _error: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _dashboards: LovelaceDashboard[];
  declare _urlPath: string;
  declare _mode: "existing" | "new";
  declare _newTitle: string;
  declare _doc: BuilderDocument | undefined;
  declare _selected: Position | undefined;
  declare _palette: PaletteEntry[];
  declare _filter: string;
  declare _dirty: boolean;
  declare _busy: boolean;
  declare _status: string;
  declare _error: string;

  private _booted = false;
  private _paletteTimer: number | undefined;

  constructor() {
    super();
    this._dashboards = [];
    this._urlPath = "";
    this._mode = "existing";
    this._newTitle = "";
    this._doc = undefined;
    this._selected = undefined;
    this._palette = [];
    this._filter = "";
    this._dirty = false;
    this._busy = false;
    this._status = "";
    this._error = "";
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      color: var(--primary-text-color);
      background: var(--primary-background-color);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    .shell {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }
    header {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      padding: 10px 16px;
      border-bottom: 1px solid var(--divider-color);
      background: var(--card-background-color);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      margin-right: 8px;
    }
    .brand ha-icon {
      color: var(--primary-color);
    }
    header select,
    header input {
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
      font-family: inherit;
    }
    header button {
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font-size: 13px;
      cursor: pointer;
      font-family: inherit;
    }
    header button.primary {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    header button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .status {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-left: auto;
    }
    .status.dirty {
      color: var(--warning-color, #ff9800);
    }
    .banner {
      padding: 8px 16px;
      font-size: 13px;
      border-bottom: 1px solid var(--divider-color);
    }
    .banner.error {
      background: var(--error-color);
      color: var(--text-primary-color, #fff);
    }
    .banner.warn {
      background: var(--warning-color, #ff9800);
      color: #fff;
    }
    main {
      display: grid;
      grid-template-columns: 232px minmax(0, 1fr) 280px;
      flex: 1;
      min-height: 0;
    }
    @media (max-width: 1100px) {
      main {
        grid-template-columns: 180px minmax(0, 1fr) 240px;
      }
    }
    .palette,
    .inspector {
      overflow: auto;
      border-right: 1px solid var(--divider-color);
      padding-bottom: 24px;
    }
    .inspector {
      border-right: none;
      border-left: 1px solid var(--divider-color);
    }
    .palette input {
      width: calc(100% - 24px);
      margin: 12px;
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
      font-family: inherit;
    }
    h3 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--secondary-text-color);
      margin: 12px 12px 6px;
    }
    .chip {
      margin: 4px 12px;
      padding: 8px 10px;
      border-radius: 10px;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      font-size: 13px;
      cursor: grab;
      user-select: none;
    }
    .chip:hover {
      border-color: var(--primary-color);
    }
    .chip:active {
      cursor: grabbing;
    }
    .stage {
      min-width: 0;
      min-height: 0;
      overflow: hidden;
    }
    .empty-state,
    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
      padding: 24px;
      text-align: center;
    }
  `;

  updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has("hass") && this.hass && !this._booted) {
      void this._boot();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._paletteTimer !== undefined) window.clearTimeout(this._paletteTimer);
  }

  render() {
    const view = this._doc ? targetView(this._doc) : undefined;
    const selectedCard =
      this._doc && this._selected ? cardAt(this._doc, this._selected) : undefined;
    const bubbleMissing = !this._palette.some((entry) => entry.category === "bubble");

    return html`
      <div class="shell">
        <header>
          <span class="brand">
            <ha-icon icon="mdi:view-dashboard-edit-outline"></ha-icon>
            Homeview
          </span>

          <select @change=${this._onDashboardChange}>
            ${this._mode === "existing" && this._urlPath === ""
              ? html`<option value="" ?selected=${true}>— choisir un dashboard —</option>`
              : nothing}
            ${this._dashboards.map(
              (dashboard) =>
                html`<option
                  value=${dashboard.url_path}
                  ?selected=${this._mode === "existing" && dashboard.url_path === this._urlPath}
                >
                  ${dashboard.title ?? dashboard.url_path} · ${dashboard.url_path}
                </option>`,
            )}
            <option value=${NEW_DASHBOARD} ?selected=${this._mode === "new"}>
              ＋ Nouveau dashboard…
            </option>
          </select>

          ${this._mode === "new"
            ? html`<input
                placeholder="Titre du dashboard"
                .value=${this._newTitle}
                @input=${(event: Event) =>
                  (this._newTitle = (event.target as HTMLInputElement).value)}
              />`
            : nothing}

          <button @click=${this._addSection} ?disabled=${!this._doc}>
            ＋ Section
          </button>
          <button ?disabled=${this._busy} @click=${this._reload}>Recharger</button>
          <button class="primary" ?disabled=${this._busy || !this._doc} @click=${this._save}>
            ${this._busy ? "…" : "Enregistrer"}
          </button>

          <span class="status ${this._dirty ? "dirty" : ""}">
            ${this._dirty ? "modifications non enregistrées" : this._status}
          </span>
        </header>

        ${this._error ? html`<div class="banner error">${this._error}</div>` : nothing}
        ${bubbleMissing
          ? html`<div class="banner warn">
              Bubble Card n'est pas détecté : installez-le pour obtenir sa palette. Les
              cartes natives restent disponibles.
            </div>`
          : nothing}

        <main>
          <aside class="palette">
            <input
              placeholder="Filtrer…"
              .value=${this._filter}
              @input=${(event: Event) =>
                (this._filter = (event.target as HTMLInputElement).value)}
            />
            ${this._groupedPalette.map(
              ([category, entries]) => html`
                <h3>${CATEGORY_LABELS[category]}</h3>
                ${entries.map(
                  (entry) => html`<div
                    class="chip"
                    draggable="true"
                    title="Glisser dans le canvas, ou cliquer pour ajouter"
                    @dragstart=${(event: DragEvent) =>
                      startDrag(event, { kind: "palette", key: entry.key })}
                    @dragend=${endDrag}
                    @click=${() => this._insertFromPalette(entry)}
                  >
                    ${entry.label}
                  </div>`,
                )}
              `,
            )}
          </aside>

          <div class="stage">
            ${this._doc
              ? html`<homeview-canvas
                  .hass=${this.hass}
                  .view=${view}
                  .selected=${this._selected}
                  @homeview-drop=${this._onDrop}
                  @homeview-select=${this._onSelect}
                  @homeview-section-remove=${this._onSectionRemove}
                ></homeview-canvas>`
              : html`<p class="empty-state">
                  Choisissez un dashboard dans la liste, ou créez-en un.
                </p>`}
          </div>

          <aside class="inspector">
            ${selectedCard
              ? html`<homeview-inspector
                  .hass=${this.hass}
                  .card=${selectedCard}
                  .position=${this._selected}
                  @homeview-card-change=${this._onCardChange}
                  @homeview-grid-change=${this._onGridChange}
                  @homeview-card-remove=${this._onCardRemove}
                ></homeview-inspector>`
              : html`<p class="hint">Sélectionnez une carte pour l'éditer.</p>`}
          </aside>
        </main>
      </div>
    `;
  }

  private get _groupedPalette(): Array<[PaletteCategory, PaletteEntry[]]> {
    const filter = this._filter.trim().toLowerCase();
    const visible = filter
      ? this._palette.filter((entry) => entry.label.toLowerCase().includes(filter))
      : this._palette;
    const order: PaletteCategory[] = ["bubble", "native", "community"];
    return order
      .map(
        (category) =>
          [category, visible.filter((entry) => entry.category === category)] as [
            PaletteCategory,
            PaletteEntry[],
          ],
      )
      .filter(([, entries]) => entries.length > 0);
  }

  private async _boot() {
    this._booted = true;
    this._loadPalette(0);
    await this._refreshDashboards();

    // Never open an existing dashboard unasked: opening one whose views are all
    // `panel`/masonry stages an extra sections view, and a save would append it to
    // a dashboard the user curated. The dropdown starts empty instead.
    this._status = "Choisissez un dashboard, ou créez-en un.";
  }

  /**
   * `window.customCards` is filled by each card's module as it loads, and there is
   * no event for it: poll briefly so a slow Bubble Card module still lands in the
   * palette without a reload.
   */
  private _loadPalette(attempt: number) {
    this._palette = buildPalette(window.customCards ?? []);
    if (this._palette.some((entry) => entry.category === "bubble")) return;
    if (attempt >= 6) return;
    this._paletteTimer = window.setTimeout(() => this._loadPalette(attempt + 1), 500);
  }

  private async _refreshDashboards() {
    if (!this.hass) return;
    try {
      this._dashboards = await listDashboards(this.hass);
    } catch (error) {
      this._error = `Liste des dashboards indisponible : ${describeError(error)}`;
    }
  }

  private async _loadDashboard(urlPath: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    this._busy = true;
    this._urlPath = urlPath;
    this._mode = "existing";
    this._error = "";
    this._status = "";
    try {
      const config = await fetchConfig(hass, urlPath);
      if (isStrategyConfig(config)) {
        this._doc = undefined;
        this._selected = undefined;
        this._error = `« ${urlPath} » est généré par une stratégie. Prenez le contrôle depuis le dashboard (menu ⋮ → Take control) avant de l'éditer ici.`;
        return;
      }
      this._doc = openDocument(config, "Homeview");
      this._selected = undefined;
      this._dirty = false;
      this._status = this._doc.createdView
        ? "Aucune vue « sections » : une vue sera ajoutée à l'enregistrement."
        : "Chargé";
    } catch (error) {
      this._doc = undefined;
      this._error =
        urlPath === DEFAULT_DASHBOARD.url_path
          ? "Le dashboard par défaut n'est pas en mode storage (YAML ou stratégie) : il n'est pas modifiable ici. Choisissez un autre dashboard, ou créez-en un."
          : `Chargement impossible : ${describeError(error)}`;
    } finally {
      this._busy = false;
    }
  }

  private _addSection() {
    if (!this._doc) return;
    this._doc = addSection(this._doc);
    this._dirty = true;
  }

  private _onDashboardChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value === "") return;
    if (value === NEW_DASHBOARD) {
      this._mode = "new";
      this._doc = openDocument({}, "Homeview");
      this._selected = undefined;
      this._dirty = true;
      this._error = "";
      this._status = "Nouveau dashboard : il sera créé à l'enregistrement.";
      return;
    }
    void this._loadDashboard(value);
  }

  private _reload() {
    if (this._mode === "new") return;
    void this._loadDashboard(this._urlPath);
  }

  private async _save() {
    const hass = this.hass;
    if (!hass || !this._doc) return;
    this._busy = true;
    this._error = "";
    try {
      let urlPath = this._urlPath;
      if (this._mode === "new") {
        const title = this._newTitle.trim() || "Homeview";
        urlPath = slugify(title);
        await createDashboard(hass, { title, urlPath });
        this._urlPath = urlPath;
        this._mode = "existing";
        this._dashboards = await listDashboards(hass);
      }
      await saveConfig(hass, urlPath, toSaveConfig(this._doc));
      this._dirty = false;
      this._status = `Enregistré dans « ${urlPath} »`;
    } catch (error) {
      this._error = `Échec de l'enregistrement : ${describeError(error)}`;
    } finally {
      this._busy = false;
    }
  }

  private _insertFromPalette(entry: PaletteEntry) {
    if (!this._doc) return;
    const sections = sectionsOf(targetView(this._doc));
    const section = Math.max(0, sections.length - 1);
    const index = cardsOf(sections[section]).length;
    this._doc = insertCard(this._doc, { section, index }, entry.create());
    this._selected = { section, index };
    this._dirty = true;
  }

  private _onDrop(event: Event) {
    const { payload, to } = (event as CustomEvent<DropDetail>).detail;
    if (!this._doc) return;
    if (payload.kind === "palette") {
      const entry = this._palette.find((item) => item.key === payload.key);
      if (!entry) return;
      this._doc = insertCard(this._doc, to, entry.create());
    } else {
      this._doc = moveCard(this._doc, payload.from, to);
    }
    this._selected = { section: to.section, index: to.index };
    this._dirty = true;
  }

  private _onSelect(event: Event) {
    this._selected = (event as CustomEvent<Position>).detail;
  }

  private _onSectionRemove(event: Event) {
    const { section } = (event as CustomEvent<{ section: number }>).detail;
    if (!this._doc) return;
    this._doc = removeSection(this._doc, section);
    this._selected = undefined;
    this._dirty = true;
  }

  private _onCardChange(event: Event) {
    const { position, patch } = (
      event as CustomEvent<{ position?: Position; patch: Record<string, unknown> }>
    ).detail;
    if (!this._doc || !position) return;
    this._doc = updateCard(this._doc, position, (card) => ({ ...card, ...patch }));
    this._dirty = true;
  }

  private _onGridChange(event: Event) {
    const { position, grid } = (
      event as CustomEvent<{ position?: Position; grid: GridPatch }>
    ).detail;
    if (!this._doc || !position) return;
    this._doc = setCardGrid(this._doc, position, grid);
    this._dirty = true;
  }

  private _onCardRemove(event: Event) {
    const { position } = (event as CustomEvent<{ position?: Position }>).detail;
    if (!this._doc || !position) return;
    this._doc = removeCard(this._doc, position);
    this._selected = undefined;
    this._dirty = true;
  }
}

customElements.define("homeview-builder", HomeviewBuilder);
