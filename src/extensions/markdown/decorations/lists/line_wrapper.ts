import type { EditorState, Range } from "@codemirror/state";
import type { SyntaxNode } from "@lezer/common";

import { Decoration } from "@codemirror/view";

import { decoratorStateField, iterateOverlayNodes } from "../util";

interface WrapElement {
  selector: string;
  class: string;
  nesting?: boolean;
}

/**
 * Count the nesting depth of a node by counting ancestors of the same type.
 */
function countNestingDepth(node: SyntaxNode, typeName: string): number {
  let depth = 1;
  let parent = node.parent;
  while (parent) {
    if (parent.name === typeName) {
      depth++;
    }
    parent = parent.parent;
  }
  return depth;
}

/**
 * Creates a plugin that applies line-level decorations based on syntax tree nodes.
 * For elements with nesting=true, it tracks depth and adds suffixed classes (e.g., stheno-line-li-1, -2, etc.)
 */
export function lineWrapper(wrapElements: WrapElement[]) {
  return decoratorStateField((state: EditorState) => {
    const widgets: Range<Decoration>[] = [];
    const doc = state.doc;
    const appliedLines = new Set<string>(); // Track which lines have which classes

    iterateOverlayNodes(state, (node) => {
      for (const wrapElement of wrapElements) {
        if (node.name === wrapElement.selector) {
          const bodyText = doc.sliceString(node.from, node.to);
          let idx = node.from;

          for (const line of bodyText.split("\n")) {
            const lineFrom = doc.lineAt(idx).from;
            let cls = wrapElement.class;

            if (wrapElement.nesting) {
              const depth = countNestingDepth(node, node.name);
              cls = `${cls} ${cls}-${depth}`;
            }

            // Avoid duplicate decorations for the same line+class
            const key = `${lineFrom}:${cls}`;
            if (!appliedLines.has(key)) {
              appliedLines.add(key);
              widgets.push(
                Decoration.line({
                  class: cls,
                }).range(lineFrom),
              );
            }

            idx += line.length + 1;
          }
        }
      }
    });

    return Decoration.set(widgets, true);
  });
}
