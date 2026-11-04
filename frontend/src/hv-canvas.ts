import { LitElement, css, html, nothing } from "lit";

import {
  MAX_COLUMNS,
  cardColumns,
  cardDisplayName,
  cardRows,
  cardsOf,
  sectionsOf,
} from "./config";
import type { CardConfig, Position, ViewConfig } from "./config";
import { currentDrag, endDrag, readDrop, startDrag } from "./dnd";
import { indexForPoint } from "./geometry";
import type { HomeAssistant } from "./ha-types";

/**
 * Renders the edited view on the same 12-column / 56px-cell grid Home Assistant
 * uses, as drag-and-drop placeholders. Cards are previews, not live HA cards: the
 * panel never depends on Home Assistant's internal card elements.
 */
export class HomeviewCanvas extends LitElement {
  static properties = {
    hass: { attribute: false },
    view: { attribute: false },
    selected: { attribute: false },
    _drop: { state: true },
  };

  declare hass?: HomeAssistant;
  declare view?: ViewConfig;
  declare selected?: Position;
  declare _drop: { section: number; index: number } | null;

  constructor() {
    super();
    this._drop = null;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      overflow: auto;
      padding: 16px;
      box-sizing: border-box;
    }
    .section {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      border-radius: 12px;
      padding: 6px 12px 12px;
      margin-bottom: 12px;
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 12px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
      padding: 4px 2px 8px;
    }
    .section-header button {
      border: none;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      padding: 2px 6px;
      border-radius: 6px;
    }
    .section-header button:hover {
      background: var(--divider-color);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      grid-auto-rows: 56px;
      gap: 8px;
      min-height: 64px;
    }
    .card {
      display: flex;
      align-items: center;
      gap: 10px;
      box-sizing: border-box;
      padding: 10px 14px;
      border-radius: 24px;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      cursor: grab;
      overflow: hidden;
    }
    .card:hover {
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }
    .card:active {
      cursor: grabbing;
    }
    .card.selected {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
    }
    /* Insertion marker as a box-shadow: it shifts no layout, so the rects used
       for hit-testing stay stable while dragging. */
    .card.drop-before {
      box-shadow: inset 4px 0 0 0 var(--primary-color);
    }
    .card.drop-after {
      box-shadow: inset -4px 0 0 0 var(--primary-color);
    }
    ha-icon {
      --mdc-icon-size: 24px;
      color: var(--state-icon-color, var(--primary-color));
      flex: none;
    }
    .text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .name {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .meta {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .empty {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .empty.active {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
  `;

  render() {
    const sections = sectionsOf(this.view);
    if (!this.view) return nothing;

    return html`
      <div class="canvas">
        ${sections.map((section, sectionIndex) => {
          const cards = cardsOf(section);
          return html`
            <section class="section">
              <div class="section-header">
                <span>Section ${sectionIndex + 1} · ${cards.length} carte${cards.length === 1 ? "" : "s"}</span>
                ${sections.length > 1
                  ? html`<button
                      title="Supprimer la section"
                      @click=${() =>
                        this.dispatchEvent(
                          new CustomEvent("homeview-section-remove", {
                            detail: { section: sectionIndex },
                            bubbles: true,
                            composed: true,
                          }),
                        )}
                    >×</button>`
                  : nothing}
              </div>
              <div
                class="grid"
                @dragover=${(event: DragEvent) => this._onDragOver(event, sectionIndex)}
                @dragleave=${(event: DragEvent) => this._onDragLeave(event)}
                @drop=${(event: DragEvent) => this._onDrop(event, sectionIndex)}
              >
                ${cards.map((card, index) =>
                  this._renderCard(card, sectionIndex, index, cards.length),
                )}
                ${cards.length === 0
                  ? html`<p class="empty ${this._drop?.section === sectionIndex ? "active" : ""}">
                      Glissez une carte depuis la palette, ou cliquez-en une
                    </p>`
                  : nothing}
              </div>
            </section>
          `;
        })}
      </div>
    `;
  }

  private _renderCard(
    card: CardConfig,
    sectionIndex: number,
    index: number,
    cardCount: number,
  ) {
    const classes = ["card"];
    if (
      this.selected?.section === sectionIndex &&
      this.selected.index === index
    ) {
      classes.push("selected");
    }
    if (this._drop?.section === sectionIndex) {
      if (this._drop.index === index) classes.push("drop-before");
      if (this._drop.index >= cardCount && index === cardCount - 1) {
        classes.push("drop-after");
      }
    }

    const columns = cardColumns(card);
    const rows = cardRows(card);
    const span = [
      `grid-column: span ${columns === "full" ? MAX_COLUMNS : columns};`,
      rows === "auto" ? "" : `grid-row: span ${rows};`,
    ].join(" ");

    const entityId = typeof card.entity === "string" ? card.entity : undefined;
    const entity = entityId ? this.hass?.states[entityId] : undefined;
    const icon =
      typeof card.icon === "string"
        ? card.icon
        : (entity?.attributes.icon as string | undefined);
    const label =
      typeof card.card_type === "string" ? `${card.type} · ${card.card_type}` : card.type;

    return html`
      <div
        class=${classes.join(" ")}
        style=${span}
        draggable="true"
        @dragstart=${(event: DragEvent) =>
          startDrag(event, { kind: "card", from: { section: sectionIndex, index } })}
        @dragend=${endDrag}
        @click=${() =>
          this.dispatchEvent(
            new CustomEvent<Position>("homeview-select", {
              detail: { section: sectionIndex, index },
              bubbles: true,
              composed: true,
            }),
          )}
      >
        <ha-icon .icon=${icon ?? "mdi:card-outline"}></ha-icon>
        <span class="text">
          <span class="name">${cardDisplayName(card)}</span>
          <span class="meta">${entity ? `${label} — ${entity.state}` : label}</span>
        </span>
      </div>
    `;
  }

  private _rects(grid: HTMLElement): DOMRect[] {
    return Array.from(grid.querySelectorAll<HTMLElement>(":scope > .card")).map(
      (element) => element.getBoundingClientRect(),
    );
  }

  private _onDragOver(event: DragEvent, sectionIndex: number) {
    if (!currentDrag()) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";

    const index = indexForPoint(
      this._rects(event.currentTarget as HTMLElement),
      event.clientX,
      event.clientY,
    );
    if (this._drop?.section === sectionIndex && this._drop.index === index) return;
    this._drop = { section: sectionIndex, index };
  }

  private _onDragLeave(event: DragEvent) {
    const grid = event.currentTarget as HTMLElement;
    const next = event.relatedTarget as Node | null;
    if (next && grid.contains(next)) return;
    this._drop = null;
  }

  private _onDrop(event: DragEvent, sectionIndex: number) {
    event.preventDefault();
    const payload = readDrop(event);
    const to: Position = {
      section: sectionIndex,
      index: indexForPoint(
        this._rects(event.currentTarget as HTMLElement),
        event.clientX,
        event.clientY,
      ),
    };
    this._drop = null;
    endDrag();
    if (!payload) return;

    this.dispatchEvent(
      new CustomEvent("homeview-drop", {
        detail: { payload, to },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define("homeview-canvas", HomeviewCanvas);
