import { LitElement, css, html, nothing } from "lit";

import { cardColumns, cardRows } from "./config";
import type { CardConfig, Columns, GridPatch, Position, Rows } from "./config";
import type { HomeAssistant } from "./ha-types";

const COLUMN_CHOICES: Columns[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "full"];
const ROW_CHOICES: Rows[] = ["auto", 1, 2, 3, 4, 5, 6];

const ENTITY_CARD_TYPES: Record<string, true> = {
  tile: true,
  button: true,
  "custom:bubble-card": true,
  "history-graph": true,
  entities: true,
  statistic: true,
};

const TYPES_WITH_NAME: Record<string, true> = {
  tile: true,
  button: true,
  "custom:bubble-card": true,
};

/** Form for the selected card. Emits whole-card patches; the builder owns state. */
export class HomeviewInspector extends LitElement {
  static properties = {
    hass: { attribute: false },
    card: { attribute: false },
    position: { attribute: false },
  };

  declare hass?: HomeAssistant;
  declare card?: CardConfig;
  declare position?: Position;

  static styles = css`
    :host {
      display: block;
      padding: 12px;
      box-sizing: border-box;
    }
    h3 {
      margin: 0 0 4px;
      font-size: 14px;
      color: var(--primary-text-color);
      word-break: break-all;
    }
    .type {
      margin: 0 0 12px;
      font-size: 12px;
      color: var(--secondary-text-color);
      font-family: var(--code-font-family, monospace);
    }
    label {
      display: block;
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 12px 0 4px;
    }
    input,
    textarea,
    select,
    ha-entity-picker {
      width: 100%;
      box-sizing: border-box;
      font-size: 14px;
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-family: inherit;
    }
    textarea {
      min-height: 72px;
      resize: vertical;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    button.danger {
      margin-top: 16px;
      width: 100%;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid var(--error-color);
      background: none;
      color: var(--error-color);
      cursor: pointer;
      font-size: 13px;
    }
    button.danger:hover {
      background: var(--error-color);
      color: var(--text-primary-color, #fff);
    }
  `;

  render() {
    const card = this.card;
    if (!card) return nothing;

    const type = card.type;
    const columns = cardColumns(card);
    const rows = cardRows(card);

    return html`
      <h3>${type}</h3>
      <p class="type">${typeof card.card_type === "string" ? card.card_type : ""}</p>

      ${ENTITY_CARD_TYPES[type]
        ? html`
            <label for="entity">Entité</label>
            <ha-entity-picker
              id="entity"
              .hass=${this.hass}
              .value=${typeof card.entity === "string" ? card.entity : ""}
              .allowCustomEntity=${true}
              @value-changed=${(event: CustomEvent<{ value: string }>) =>
                this._patch({ entity: event.detail.value })}
            ></ha-entity-picker>
          `
        : nothing}

      ${TYPES_WITH_NAME[type]
        ? html`
            <label for="name">Nom affiché</label>
            <input
              id="name"
              .value=${typeof card.name === "string" ? card.name : ""}
              @change=${(event: Event) =>
                this._patch({ name: (event.target as HTMLInputElement).value })}
            />
          `
        : nothing}

      ${type === "heading"
        ? html`
            <label for="heading">Titre</label>
            <input
              id="heading"
              .value=${typeof card.heading === "string" ? card.heading : ""}
              @change=${(event: Event) =>
                this._patch({ heading: (event.target as HTMLInputElement).value })}
            />
          `
        : nothing}

      ${type === "markdown"
        ? html`
            <label for="content">Contenu (Jinja autorisé)</label>
            <textarea
              id="content"
              .value=${typeof card.content === "string" ? card.content : ""}
              @change=${(event: Event) =>
                this._patch({ content: (event.target as HTMLTextAreaElement).value })}
            ></textarea>
          `
        : nothing}

      <div class="row">
        <div>
          <label for="columns">Colonnes</label>
          <select
            id="columns"
            @change=${(event: Event) =>
              this._grid({
                columns: (event.target as HTMLSelectElement)
                  .value as Columns,
              })}
          >
            ${COLUMN_CHOICES.map(
              (choice) =>
                html`<option value=${String(choice)} ?selected=${choice === columns}>
                  ${choice === "full" ? "pleine largeur" : `${choice} / 12`}
                </option>`,
            )}
          </select>
        </div>
        <div>
          <label for="rows">Hauteur</label>
          <select
            id="rows"
            @change=${(event: Event) =>
              this._grid({ rows: (event.target as HTMLSelectElement).value as Rows })}
          >
            ${ROW_CHOICES.map(
              (choice) =>
                html`<option value=${String(choice)} ?selected=${choice === rows}>
                  ${choice === "auto" ? "auto" : `${choice} × 56 px`}
                </option>`,
            )}
          </select>
        </div>
      </div>

      <button class="danger" @click=${() => this._emit("homeview-card-remove")}>
        Supprimer la carte
      </button>
    `;
  }

  private _patch(patch: Record<string, unknown>) {
    this.dispatchEvent(
      new CustomEvent("homeview-card-change", {
        detail: { position: this.position, patch },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _grid(grid: GridPatch) {
    this.dispatchEvent(
      new CustomEvent("homeview-grid-change", {
        detail: { position: this.position, grid },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _emit(type: string) {
    this.dispatchEvent(
      new CustomEvent(type, {
        detail: { position: this.position },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define("homeview-inspector", HomeviewInspector);
