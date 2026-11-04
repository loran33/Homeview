import type { CardConfig, Columns, Rows } from "./config";
import type { CustomCardInfo } from "./ha-types";

export type PaletteCategory = "bubble" | "native" | "community";

export interface PaletteEntry {
  key: string;
  category: PaletteCategory;
  label: string;
  /** Skeleton inserted on drop; `type` is always present. */
  create: () => CardConfig;
}

interface BubbleCardType {
  cardType: string;
  label: string;
  columns: Columns;
  rows: Rows;
}

/** The `card_type` values Bubble Card ships, one palette entry each. */
const BUBBLE_CARD_TYPES: BubbleCardType[] = [
  { cardType: "button", label: "Bubble · bouton", columns: 6, rows: 1 },
  { cardType: "pop-up", label: "Bubble · pop-up", columns: 12, rows: 2 },
  { cardType: "media-player", label: "Bubble · média", columns: 12, rows: 2 },
  { cardType: "climate", label: "Bubble · climat", columns: 6, rows: 2 },
  { cardType: "cover", label: "Bubble · volet", columns: 6, rows: 2 },
  { cardType: "select", label: "Bubble · sélecteur", columns: 6, rows: 1 },
  { cardType: "calendar", label: "Bubble · calendrier", columns: 12, rows: 3 },
  { cardType: "separator", label: "Bubble · séparateur", columns: 12, rows: 1 },
  { cardType: "sub-buttons", label: "Bubble · sous-boutons", columns: 12, rows: 1 },
  {
    cardType: "horizontal-buttons-stack",
    label: "Bubble · pile de boutons",
    columns: 12,
    rows: 1,
  },
  { cardType: "empty-column", label: "Bubble · colonne vide", columns: 1, rows: 1 },
];

const NATIVE_CARDS: Array<{ type: string; label: string; columns: Columns; rows: Rows }> = [
  { type: "tile", label: "Tuile", columns: 6, rows: 1 },
  { type: "heading", label: "Titre de section", columns: 12, rows: 1 },
  { type: "button", label: "Bouton", columns: 3, rows: 1 },
  { type: "markdown", label: "Markdown", columns: 12, rows: 2 },
  { type: "history-graph", label: "Graphique d'historique", columns: 12, rows: 3 },
];

/** `window.customCards` omits the prefix that Lovelace config requires. */
function withPrefix(type: string): string {
  return type.startsWith("custom:") ? type : `custom:${type}`;
}

export function hasBubbleCard(customCards: CustomCardInfo[]): boolean {
  return customCards.some((info) => withPrefix(info.type) === "custom:bubble-card");
}

export function buildPalette(customCards: CustomCardInfo[]): PaletteEntry[] {
  const entries: PaletteEntry[] = [];

  if (hasBubbleCard(customCards)) {
    for (const bubble of BUBBLE_CARD_TYPES) {
      entries.push({
        key: `bubble:${bubble.cardType}`,
        category: "bubble",
        label: bubble.label,
        create: () => ({
          type: "custom:bubble-card",
          card_type: bubble.cardType,
          grid_options: { columns: bubble.columns, rows: bubble.rows },
        }),
      });
    }
  }

  for (const native of NATIVE_CARDS) {
    entries.push({
      key: `native:${native.type}`,
      category: "native",
      label: native.label,
      create: () => ({
        type: native.type,
        grid_options: { columns: native.columns, rows: native.rows },
      }),
    });
  }

  for (const info of customCards) {
    const type = withPrefix(info.type);
    if (type === "custom:bubble-card") continue;
    entries.push({
      key: `community:${type}`,
      category: "community",
      label: info.name ?? type,
      create: () => ({ type }),
    });
  }

  return entries;
}

export const CATEGORY_LABELS: Record<PaletteCategory, string> = {
  bubble: "Bubble Card",
  native: "Natif Home Assistant",
  community: "Autres cartes",
};
