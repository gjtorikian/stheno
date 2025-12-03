import type { SyntaxNode } from "@lezer/common";

import { syntaxTree } from "@codemirror/language";
import { EditorSelection } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { getCodeNode, isMultipleLines, isWithinMarkdown } from ".";

const FORBIDDEN_INLINE_NODES = new Set(["Image", "Link", "LinkMark", "LinkTitle", "URL", "CodeText"]);
const DOCUMENT_NODES = new Set(["Document", "Paragraph"]);
const ALLOWED_CROSS_NODES = new Set(["Blockquote", "BulletList", "Document", "ListItem", "OrderedList", "Paragraph"]);

export function createWrapTextCommand(view: EditorView, nodeName: string, mark: string): boolean {
  return insertMarker(view, nodeName, mark);
}

const PLACEHOLDER_TEXT = "";
const PLACEHOLDER_LENGTH = PLACEHOLDER_TEXT.length;
function insertMarker(view: EditorView, nodeName: string, mark: string) {
  const { dispatch, state } = view;
  if (state.readOnly) return false;

  const markLength = mark.length;
  if (
    state.doc.length === 0 ||
    (state.selection.main.empty &&
      state.selection.main.from === 0 &&
      state.doc.line(1).length === 0)
  ) {
    dispatch(
      state.update({
        changes: {
          from: 0,
          insert: `${mark}${PLACEHOLDER_TEXT}${mark}`,
          to: 0,
        },
        selection: EditorSelection.range(markLength, markLength + PLACEHOLDER_LENGTH),
        userEvent: `toggle.${nodeName}`,
      }),
    );
    return true;
  }

  const tree = syntaxTree(state);
  let dont = null;

  const transaction = state.changeByRange((range) => {
    // Get the current selection
    const { from, to } = range;

    if (range.empty) {
      return {
        changes: [{ from: from, insert: `${mark}${PLACEHOLDER_TEXT}${mark}` }],
        range: EditorSelection.range(from + markLength, from + markLength + PLACEHOLDER_LENGTH),
      };
    }

    if (isMultipleLines(state.doc, from, to)) return (dont = { range });
    if (!isWithinMarkdown(state, from)) return (dont = { range });

    let node: null | SyntaxNode = tree.resolveInner(range.from);

    // cannot have inline nodes within these nodes
    if (FORBIDDEN_INLINE_NODES.has(node.name))
      return (dont = { range });

    // if the selection is not empty, we need to check if the selection is within a node
    if (!range.empty && DOCUMENT_NODES.has(node.name))
      node = tree.resolveInner(range.from, 1);

    // if the selection is within a node, we need to check if the node is a paragraph, or itself
    while (node.name !== nodeName && node.name !== "Paragraph" && node.parent) {
      node = node.parent;
    }

    if (node.name === nodeName && node.to >= to) {
      const startMarkNode = node.firstChild!;
      const endMarkNode = node.lastChild!;

      const anchor =
        Math.min(Math.max(range.anchor, startMarkNode.to), endMarkNode.from) -
        startMarkNode.to +
        startMarkNode.from;
      const head =
        Math.min(Math.max(range.head, startMarkNode.to), endMarkNode.from) -
        startMarkNode.to +
        startMarkNode.from;

      return {
        changes: [
          { from: startMarkNode.from, to: startMarkNode.to },
          { from: endMarkNode.from, to: endMarkNode.to },
        ],
        range: EditorSelection.range(anchor, head),
      };
    }

    node = getCodeNode(view, from);
    if (node?.name === "CodeBlock" || node?.name === "FencedCode") return (dont = { range });

    const fromNode = tree.resolveInner(from);
    const toNode = tree.resolveInner(to);

    if (fromNode !== toNode) {
      if (!ALLOWED_CROSS_NODES.has(fromNode.name) || !ALLOWED_CROSS_NODES.has(toNode.name)) {
        return (dont = { range });
      }
    }

    return {
      changes: [
        { from: from, insert: mark },
        { from: to, insert: mark },
      ],
      range: EditorSelection.range(range.anchor + markLength, range.head + markLength),
    };
  });

  if (transaction.changes.empty) return false;

  dispatch(state.update(transaction, { userEvent: `toggle.${nodeName}` }));

  return !dont;
}
