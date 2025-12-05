import type { EditorState, Range } from "@codemirror/state";
import type { DecorationSet, ViewUpdate } from "@codemirror/view";
import type { SyntaxNode } from "@lezer/common";

import { syntaxTree } from "@codemirror/language";
import { Decoration, EditorView, ViewPlugin } from "@codemirror/view";

interface ViewportDecoratorConfig {
  buildDecorations: (state: EditorState, from: number, to: number) => Range<Decoration>[];
}

/**
 * Creates a ViewPlugin that builds decorations only for visible viewport ranges.
 * This only processes content that's actually visible to the user.
 *
 * Falls back to processing the full document if visibleRanges is empty or
 * doesn't cover meaningful content.
 */
export function createViewportDecorator(config: ViewportDecoratorConfig) {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = this.build(view);
      }

      build(view: EditorView): DecorationSet {
        const widgets: Range<Decoration>[] = [];
        const ranges = view.visibleRanges;

        // Fallback to full document if no visible ranges or range is empty
        if (ranges.length === 0 || (ranges.length === 1 && ranges[0].from === ranges[0].to)) {
          widgets.push(...config.buildDecorations(view.state, 0, view.state.doc.length));
        } else {
          for (const { from, to } of ranges) {
            widgets.push(...config.buildDecorations(view.state, from, to));
          }
        }
        return Decoration.set(widgets, true);
      }

      update(update: ViewUpdate) {
        if (
          update.docChanged ||
          update.viewportChanged ||
          syntaxTree(update.state) !== syntaxTree(update.startState)
        ) {
          this.decorations = this.build(update.view);
        }
      }
    },
    { decorations: (v) => v.decorations },
  );
}

/**
 * Iterates through syntax nodes within a range, including overlay/nested trees.
 * This handles the case where liquid wraps markdown and nodes are in overlays.
 *
 * Uses a combination of tree.iterate() for base tree nodes and line-based
 * iteration for overlay nodes. This is O(m + lines) where m = nodes in range.
 */
export function iterateOverlayNodesInRange(
  state: EditorState,
  from: number,
  to: number,
  callback: (node: SyntaxNode) => void,
): void {
  const tree = syntaxTree(state);
  const doc = state.doc;
  const seen = new Set<string>();

  const processAtPosition = (pos: number) => {
    let node: SyntaxNode | null = tree.resolveInner(pos, 1);
    while (node) {
      if (node.from <= to && node.to >= from) {
        const key = `${node.name}:${node.from}:${node.to}`;
        if (!seen.has(key)) {
          seen.add(key);
          callback(node);
        }
      }
      node = node.parent;
    }
  };

  // Iterate main tree within range
  tree.iterate({
    from,
    to,
    enter: (nodeRef) => {
      processAtPosition(nodeRef.from);
      if (nodeRef.to !== nodeRef.from && nodeRef.to <= to) {
        processAtPosition(nodeRef.to);
      }
    },
  });

  // Also check at line boundaries and common marker positions to catch overlay nodes
  const startLine = doc.lineAt(from).number;
  const endLine = doc.lineAt(to).number;
  for (let lineNum = startLine; lineNum <= endLine; lineNum++) {
    const line = doc.line(lineNum);
    processAtPosition(line.from);
    if (line.to !== line.from) {
      processAtPosition(line.to);
    }
    // Check at common marker positions (for task lists `- [ ]`, list items, etc.)
    // These are typically in the first few characters of a line
    for (let offset = 1; offset <= Math.min(6, line.length); offset++) {
      processAtPosition(line.from + offset);
    }
  }
}
