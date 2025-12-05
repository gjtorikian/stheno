import type { Range } from "@codemirror/state";

import { Decoration } from "@codemirror/view";

import { createViewportDecorator, iterateOverlayNodesInRange } from "../../util";

/**
 * Plugin that applies background styling to fenced code blocks.
 * Applies to ALL lines including the opening ``` and closing ``` lines.
 * Skips frontmatter blocks (which also use FencedCode internally).
 */
export function fencedCodeBackgroundPlugin() {
  return createViewportDecorator({
    buildDecorations: (state, from, to) => {
      const widgets: Range<Decoration>[] = [];
      const doc = state.doc;
      const appliedLines = new Set<number>();

      iterateOverlayNodesInRange(state, from, to, (node) => {
        if (node.name !== "FencedCode") return;

        // Skip frontmatter blocks (they have FrontmatterStart as a child)
        if (node.getChild("FrontmatterStart")) return;

        // Get all lines from node.from to node.to
        const startLine = doc.lineAt(node.from);
        const endLine = doc.lineAt(node.to);

        for (let lineNum = startLine.number; lineNum <= endLine.number; lineNum++) {
          const line = doc.line(lineNum);

          // Skip if we've already applied decoration to this line
          if (appliedLines.has(line.from)) continue;
          appliedLines.add(line.from);

          // Build class list based on position
          const classes = ["stheno-fenced-code-line"];
          if (lineNum === startLine.number) {
            classes.push("stheno-fenced-code-first");
          }
          if (lineNum === endLine.number) {
            classes.push("stheno-fenced-code-last");
          }

          widgets.push(Decoration.line({ class: classes.join(" ") }).range(line.from));
        }
      });

      return widgets;
    },
  });
}
