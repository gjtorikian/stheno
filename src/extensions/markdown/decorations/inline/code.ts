import type { Extension, Range } from "@codemirror/state";

import { Decoration } from "@codemirror/view";

import { createViewportDecorator, iterateOverlayNodesInRange } from "../util";

/**
 * Plugin that wraps inline code with styled spans.
 * The backticks get stheno-meta class, the content gets stheno-code class.
 */
function inlineCodePlugin() {
  return createViewportDecorator({
    buildDecorations: (state, from, to) => {
      const widgets: Range<Decoration>[] = [];

      iterateOverlayNodesInRange(state, from, to, (node) => {
        if (node.name === "InlineCode") {
          // Get CodeMark children (the backticks)
          const marks = node.getChildren("CodeMark");

          if (marks.length >= 2) {
            const openMark = marks[0];
            const closeMark = marks[marks.length - 1];

            // Opening backtick(s)
            widgets.push(Decoration.mark({ class: "stheno-meta" }).range(openMark.from, openMark.to));
            // Code content (between first and last mark)
            widgets.push(Decoration.mark({ class: "stheno-code" }).range(openMark.to, closeMark.from));
            // Closing backtick(s)
            widgets.push(Decoration.mark({ class: "stheno-meta" }).range(closeMark.from, closeMark.to));
          }
        }
      });

      return widgets;
    },
  });
}

/**
 * Inline code decorations.
 */
export const inlineCode = (): Extension => {
  return inlineCodePlugin();
};
