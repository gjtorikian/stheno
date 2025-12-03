import type { EditorState } from "@codemirror/state";
import type { DecorationSet } from "@codemirror/view";
import type { SyntaxNode } from "@lezer/common";

import { syntaxTree } from "@codemirror/language";
import { StateField } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

/**
 * Creates a StateField that maps editor state to decorations.
 * The decoration set is recalculated on every transaction (except pointer events).
 * This ensures decorations stay in sync with the syntax tree.
 */
export function decoratorStateField(
  stateToDecoratorMapper: (state: EditorState) => DecorationSet,
): StateField<DecorationSet> {
  return StateField.define<DecorationSet>({
    create(state: EditorState) {
      return stateToDecoratorMapper(state);
    },
    update(_value: DecorationSet, tr) {
      // Skip recalculation for pointer selection events (performance optimization)
      if (tr.isUserEvent("select.pointer")) {
        return _value.map(tr.changes);
      }
      // Always recalculate to stay in sync with syntax tree
      return stateToDecoratorMapper(tr.state);
    },
    provide: (field) => EditorView.decorations.from(field),
  });
}

/**
 * Iterates through all syntax nodes including those in overlay/nested trees.
 * This handles the case where liquid wraps markdown and nodes are in overlays.
 *
 * Uses resolveInner() to access nodes in overlay trees that syntaxTree().iterate()
 * doesn't descend into.
 */
export function iterateOverlayNodes(
  state: EditorState,
  callback: (node: SyntaxNode) => void,
): void {
  const tree = syntaxTree(state);
  const doc = state.doc;
  const seen = new Set<string>();

  // Iterate through each position and use resolveInner to find overlay nodes
  for (let pos = 0; pos <= doc.length; pos++) {
    let node: SyntaxNode | null = tree.resolveInner(pos, 1);

    // Walk up the tree to collect all nodes at this position
    while (node) {
      const key = `${node.name}:${node.from}:${node.to}`;
      if (!seen.has(key)) {
        seen.add(key);
        callback(node);
      }
      node = node.parent;
    }
  }
}
