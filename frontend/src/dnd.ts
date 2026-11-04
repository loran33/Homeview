import type { Position } from "./config";

export const DRAG_MIME = "application/x-homeview";

export type DragPayload =
  | { kind: "palette"; key: string }
  | { kind: "card"; from: Position };

/**
 * The live payload also lives in module scope: during `dragover` the browser
 * blocks `dataTransfer.getData`, so the drop indicator could not tell a palette
 * drag from a card drag. Drags never leave this document, so a module variable is
 * the honest place for it.
 */
let current: DragPayload | null = null;

export function startDrag(event: DragEvent, payload: DragPayload): void {
  current = payload;
  event.dataTransfer?.setData(DRAG_MIME, JSON.stringify(payload));
  event.dataTransfer?.setData("text/plain", payload.kind);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
}

export function currentDrag(): DragPayload | null {
  return current;
}

export function endDrag(): void {
  current = null;
}

export function readDrop(event: DragEvent): DragPayload | null {
  const raw = event.dataTransfer?.getData(DRAG_MIME);
  if (!raw) return current;
  try {
    return JSON.parse(raw) as DragPayload;
  } catch {
    return current;
  }
}
