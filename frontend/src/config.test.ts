import { describe, expect, it } from "vitest";

import {
  addSection,
  cardAt,
  findSectionsViewIndex,
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
  cardColumns,
  cardsOf,
} from "./config";
import type { BuilderDocument, CardConfig } from "./config";

function card(type: string, entity?: string): CardConfig {
  return entity ? { type, entity } : { type };
}

function order(doc: BuilderDocument, section = 0): string[] {
  return cardsOf(sectionsOf(targetView(doc))[section]).map(
    (item) => (item.entity as string) ?? item.type,
  );
}

describe("openDocument", () => {
  it("appends a sections view when the dashboard has none", () => {
    const result = openDocument({ views: [{ title: "Legacy", type: "masonry", cards: [] }] });

    expect(result.createdView).toBe(true);
    expect(result.viewIndex).toBe(1);
    const view = targetView(result);
    expect(view?.type).toBe("sections");
    expect(sectionsOf(view)).toHaveLength(1);
    expect(slugify(String(view?.title))).toBe(view?.path);
  });

  it("reuses an existing sections view", () => {
    const result = openDocument({
      views: [
        { title: "A", type: "masonry", cards: [] },
        { title: "B", type: "sections", sections: [{ type: "grid", cards: [] }] },
      ],
    });

    expect(result.createdView).toBe(false);
    expect(result.viewIndex).toBe(1);
  });

  it("never rewrites views it does not edit", () => {
    const raw = {
      views: [
        { title: "Legacy", type: "masonry", cards: [{ type: "tile", entity: "light.a" }] },
      ],
    };
    const result = openDocument(raw);
    const saved = toSaveConfig(result);

    expect(saved.views?.[0]).toEqual(raw.views[0]);
    expect(saved.views).toHaveLength(2);
  });

  it("treats a null config as an empty dashboard", () => {
    const result = openDocument(null as unknown as Record<string, unknown>);
    expect(targetView(result)?.type).toBe("sections");
  });
});

describe("card placement", () => {
  it("inserts at the requested index and clamps past the end", () => {
    let result = openDocument({});
    result = insertCard(result, { section: 0, index: 0 }, card("tile", "light.a"));
    result = insertCard(result, { section: 0, index: 1 }, card("tile", "light.b"));
    result = insertCard(result, { section: 0, index: 99 }, card("tile", "light.c"));

    expect(order(result)).toEqual(["light.a", "light.b", "light.c"]);
  });

  it("removes the targeted card only", () => {
    let result = openDocument({});
    result = insertCard(result, { section: 0, index: 0 }, card("tile", "light.a"));
    result = insertCard(result, { section: 0, index: 1 }, card("tile", "light.b"));
    result = removeCard(result, { section: 0, index: 0 });

    expect(order(result)).toEqual(["light.b"]);
  });

  it("keeps drop order when moving a card forward in the same section", () => {
    let result = openDocument({});
    for (const [index, entity] of ["a", "b", "c"].entries()) {
      result = insertCard(result, { section: 0, index }, card("tile", entity));
    }

    // Drag "a" so that it lands after "b" (insertion index 2 of the original list).
    result = moveCard(result, { section: 0, index: 0 }, { section: 0, index: 2 });

    expect(order(result)).toEqual(["b", "a", "c"]);
  });

  it("keeps drop order when moving a card backward in the same section", () => {
    let result = openDocument({});
    for (const [index, entity] of ["a", "b", "c"].entries()) {
      result = insertCard(result, { section: 0, index }, card("tile", entity));
    }

    result = moveCard(result, { section: 0, index: 2 }, { section: 0, index: 0 });

    expect(order(result)).toEqual(["c", "a", "b"]);
  });

  it("moves a card across sections", () => {
    let result = openDocument({});
    result = addSection(result);
    result = insertCard(result, { section: 0, index: 0 }, card("tile", "light.a"));
    result = insertCard(result, { section: 1, index: 0 }, card("tile", "light.b"));

    result = moveCard(result, { section: 0, index: 0 }, { section: 1, index: 1 });

    expect(order(result, 0)).toEqual([]);
    expect(order(result, 1)).toEqual(["light.b", "light.a"]);
  });

  it("is a no-op when the source card is gone", () => {
    const result = openDocument({});
    const moved = moveCard(result, { section: 0, index: 5 }, { section: 0, index: 0 });
    expect(cardAt(moved, { section: 0, index: 0 })).toBeUndefined();
  });
});

describe("grid options", () => {
  it("clamps columns into 1..12 and keeps the full span keyword", () => {
    let result = openDocument({});
    result = insertCard(result, { section: 0, index: 0 }, card("tile", "light.a"));

    result = setCardGrid(result, { section: 0, index: 0 }, { columns: 40 });
    expect(cardColumns(cardAt(result, { section: 0, index: 0 })!)).toBe(12);

    result = setCardGrid(result, { section: 0, index: 0 }, { columns: 0 });
    expect(cardColumns(cardAt(result, { section: 0, index: 0 })!)).toBe(1);

    result = setCardGrid(result, { section: 0, index: 0 }, { columns: "full" });
    expect(cardColumns(cardAt(result, { section: 0, index: 0 })!)).toBe("full");
  });

  it("preserves the card's own keys and its other grid key", () => {
    let result = openDocument({});
    result = insertCard(
      result,
      { section: 0, index: 0 },
      { type: "custom:bubble-card", card_type: "button", grid_options: { rows: 2 } },
    );

    result = setCardGrid(result, { section: 0, index: 0 }, { columns: 6 });

    const saved = cardAt(result, { section: 0, index: 0 })!;
    expect(saved.card_type).toBe("button");
    expect(saved.grid_options).toEqual({ rows: 2, columns: 6 });
  });
});

describe("sections", () => {
  it("refuses to remove the last section", () => {
    const result = openDocument({});
    expect(sectionsOf(targetView(result))).toHaveLength(1);
    expect(sectionsOf(targetView(removeSection(result, 0)))).toHaveLength(1);
  });
});

describe("strategy guard", () => {
  it("detects a dashboard-level strategy", () => {
    expect(isStrategyConfig({ strategy: { type: "original-states" }, views: [] })).toBe(true);
  });

  it("detects a view-level strategy", () => {
    expect(isStrategyConfig({ views: [{ strategy: { type: "custom:x" } }] } as never)).toBe(true);
  });

  it("returns false for a plain sections dashboard", () => {
    expect(isStrategyConfig({ views: [{ type: "sections", sections: [] }] })).toBe(false);
  });
});

describe("slugify", () => {
  it("always yields a hyphen, which Home Assistant requires for a new dashboard", () => {
    expect(slugify("Homeview")).toBe("homeview-view");
    expect(slugify("Ma Cuisine Été")).toBe("ma-cuisine-ete");
    expect(slugify("")).toBe("view-view");
  });
});

describe("toSaveConfig", () => {
  it("returns a detached copy the caller cannot alias", () => {
    let result = openDocument({ views: [] });
    result = insertCard(result, { section: 0, index: 0 }, card("tile", "light.a"));
    const saved = toSaveConfig(result);

    result = insertCard(result, { section: 0, index: 1 }, card("tile", "light.b"));

    expect(cardsOf(sectionsOf(saved.views?.[result.viewIndex])[0])).toHaveLength(1);
  });

  it("carries no key beyond what the cards hold", () => {
    let result = openDocument({});
    result = insertCard(result, { section: 0, index: 0 }, card("tile", "light.a"));

    const saved = toSaveConfig(result);
    const view = saved.views?.[findSectionsViewIndex(saved)];

    expect(Object.keys(view ?? {}).sort()).toEqual(["path", "sections", "title", "type"]);
  });
});
