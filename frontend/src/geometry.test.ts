import { describe, expect, it } from "vitest";

import { indexForPoint } from "./geometry";
import type { Rect } from "./geometry";

/** Two rows of two 6-column cards inside a 12-column section. */
const twoByTwo: Rect[] = [
  { left: 0, top: 0, right: 300, bottom: 56 },
  { left: 308, top: 0, right: 608, bottom: 56 },
  { left: 0, top: 64, right: 300, bottom: 120 },
  { left: 308, top: 64, right: 608, bottom: 120 },
];

describe("indexForPoint", () => {
  it("inserts at 0 for an empty section", () => {
    expect(indexForPoint([], 100, 100)).toBe(0);
  });

  it("inserts before a card when the point is above it", () => {
    expect(indexForPoint(twoByTwo, 400, -20)).toBe(0);
  });

  it("uses the horizontal midpoint inside a band", () => {
    expect(indexForPoint(twoByTwo, 100, 30)).toBe(0);
    expect(indexForPoint(twoByTwo, 200, 30)).toBe(1);
  });

  it("inserts between the two cards of the first row", () => {
    expect(indexForPoint(twoByTwo, 304, 30)).toBe(1);
  });

  it("inserts before the first card of the second row", () => {
    expect(indexForPoint(twoByTwo, 100, 90)).toBe(2);
  });

  it("inserts at the end when the point is below every card", () => {
    expect(indexForPoint(twoByTwo, 100, 400)).toBe(4);
  });

  it("inserts after a single full-width card past its midpoint", () => {
    const full: Rect[] = [{ left: 0, top: 0, right: 600, bottom: 56 }];
    expect(indexForPoint(full, 590, 20)).toBe(1);
  });
});
