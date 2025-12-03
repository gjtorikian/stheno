import type { Range } from "@codemirror/state";

import { Decoration } from "@codemirror/view";

import { createViewportDecorator, iterateOverlayNodesInRange } from "../util";

/**
 * Plugin that wraps list markers (*, -, +, 1., etc.) and list item text with styled spans.
 * - ListMark gets wrapped with stheno-list-bullet
 * - List item text (after marker) gets wrapped with stheno-list
 */
export function listBulletPlugin() {
  return createViewportDecorator({
    buildDecorations: (state, from, to) => {
      const widgets: Range<Decoration>[] = [];
      const doc = state.doc;

      iterateOverlayNodesInRange(state, from, to, (node) => {
        if (node.name === "ListMark") {
          // Wrap the list marker with a styled span
          widgets.push(
            Decoration.mark({
              class: "stheno-list-bullet",
              attributes: { contenteditable: "false" },
            }).range(node.from, node.to),
          );

          // Wrap the text content after the marker (skip the space after marker)
          const line = doc.lineAt(node.from);
          const textStart = node.to + 1; // +1 to skip the space after marker
          const textEnd = line.to;

          if (textStart < textEnd) {
            widgets.push(
              Decoration.mark({
                class: "stheno-list",
              }).range(textStart, textEnd),
            );
          }
        }
      });

      return widgets;
    },
  });
}
