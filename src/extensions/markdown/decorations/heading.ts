import type { Extension, Range } from "@codemirror/state";

import { Decoration } from "@codemirror/view";

import { createViewportDecorator, iterateOverlayNodesInRange } from "./util";

/** Maps ATXHeading node names to their level number */
const HEADING_LEVELS: Record<string, number> = {
  ATXHeading1: 1,
  ATXHeading2: 2,
  ATXHeading3: 3,
  ATXHeading4: 4,
  ATXHeading5: 5,
  ATXHeading6: 6,
};

/**
 * Apply heading-level classes to ATX headings.
 */
function headingPlugin() {
  return createViewportDecorator({
    buildDecorations: (state, from, to) => {
      const widgets: Range<Decoration>[] = [];
      const doc = state.doc;

      iterateOverlayNodesInRange(state, from, to, (node) => {
        const level = HEADING_LEVELS[node.name];

        if (level) {
          const lineClass = `stheno-line-h${level}`;
          const markClass = `stheno-h${level}`;

          // Apply line decoration with heading level class
          const lineFrom = doc.lineAt(node.from).from;
          widgets.push(Decoration.line({ class: lineClass }).range(lineFrom));

          // Find HeaderMark child (the # characters)
          const headerMark = node.getChild("HeaderMark");
          if (headerMark) {
            // Apply mark with stheno-meta to the # marker
            widgets.push(
              Decoration.mark({ class: `${markClass} stheno-meta` }).range(
                headerMark.from,
                headerMark.to,
              ),
            );
            // Apply mark to the rest of the heading text
            if (headerMark.to < node.to) {
              widgets.push(
                Decoration.mark({ class: markClass }).range(headerMark.to, node.to),
              );
            }
          } else {
            // Fallback: apply to entire heading if no HeaderMark found
            widgets.push(
              Decoration.mark({ class: markClass }).range(node.from, node.to),
            );
          }
        }
      });

      return widgets;
    },
  });
}

/**
 * ATX heading decorations with level-specific styling.
 */
export const heading = (): Extension => {
  return headingPlugin();
};
