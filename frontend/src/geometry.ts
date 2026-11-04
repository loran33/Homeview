/**
 * Geometry for drop targeting. Pure so the insertion rule is unit-tested rather
 * than guessed from mouse events.
 */

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * Insertion index for a point over `rects`, which are the cards of the target
 * section in visual (row-major) order.
 *
 * A card owns the vertical band between its own top and bottom: a point above a
 * band inserts before it, a point inside a band falls on either side of the
 * horizontal midpoint, and a point past every band inserts at the end.
 */
export function indexForPoint(rects: Rect[], x: number, y: number): number {
  for (let index = 0; index < rects.length; index += 1) {
    const rect = rects[index];
    if (y < rect.top) return index;
    if (y > rect.bottom) continue;
    if (x < rect.left + (rect.right - rect.left) / 2) return index;
  }
  return rects.length;
}
