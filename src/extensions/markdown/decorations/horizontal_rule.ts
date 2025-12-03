import type { EditorState, Extension, Range } from "@codemirror/state";

import { Decoration } from "@codemirror/view";

import { decoratorStateField, iterateOverlayNodes } from "./util";

/**
 * Plugin that wraps horizontal rules (***) with a styled span.
 * The HorizontalRule node gets wrapped with stheno-hr class.
 */
function horizontalRulePlugin() {
  return decoratorStateField((state: EditorState) => {
    const widgets: Range<Decoration>[] = [];

    iterateOverlayNodes(state, (node) => {
      if (node.name === "HorizontalRule") {
        widgets.push(
          Decoration.mark({
            class: "stheno-hr",
          }).range(node.from, node.to),
        );
      }
    });

    return Decoration.set(widgets, true);
  });
}

/**
 * Horizontal rule decorations.
 */
export const horizontalRule = (): Extension => {
  return horizontalRulePlugin();
};
