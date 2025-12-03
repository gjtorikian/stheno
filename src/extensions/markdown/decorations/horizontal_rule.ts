import type { Extension, Range } from "@codemirror/state";

import { Decoration } from "@codemirror/view";

import { createViewportDecorator, iterateOverlayNodesInRange } from "./util";

/**
 * Plugin that wraps horizontal rules (***) with a styled span.
 * The HorizontalRule node gets wrapped with stheno-hr class.
 */
function horizontalRulePlugin() {
  return createViewportDecorator({
    buildDecorations: (state, from, to) => {
      const widgets: Range<Decoration>[] = [];

      iterateOverlayNodesInRange(state, from, to, (node) => {
        if (node.name === "HorizontalRule") {
          widgets.push(
            Decoration.mark({
              class: "stheno-hr",
            }).range(node.from, node.to),
          );
        }
      });

      return widgets;
    },
  });
}

/**
 * Horizontal rule decorations.
 */
export const horizontalRule = (): Extension => {
  return horizontalRulePlugin();
};
