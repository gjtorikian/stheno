import type { SyntaxNode } from "@lezer/common";

import { syntaxTree } from "@codemirror/language";
import { EditorSelection } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { getCodeNode, isMultipleLines, isWithinMarkdown } from ".";

export function createWrapTextCommand(view: EditorView, nodeName: string, mark: string): boolean {
  return toggleInline(view, nodeName, mark);
}

function toggleInline(view: EditorView, nodeName: string, mark: string) {
  const { dispatch, state } = view;
  if (state.readOnly) return false;

  const markLength = mark.length;
  if (
    state.doc.length === 0 ||
    (state.selection.main.empty &&
      state.selection.main.from === 0 &&
      state.doc.line(1).length === 0)
  ) {
    const placeholderText = "text"; // Simple placeholder
    dispatch(
      state.update({
        changes: {
          from: 0,
          insert: `${mark}${placeholderText}${mark}`,
          to: 0,
        },
        selection: EditorSelection.range(markLength, markLength + placeholderText.length),
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
      const placeholderText = "text"; // Simple placeholder
      return {
        changes: [{ from: from, insert: `${mark}${placeholderText}${mark}` }],
        range: EditorSelection.range(from + markLength, from + markLength + placeholderText.length),
      };
    }

    if (isMultipleLines(state.doc, from, to)) return (dont = { range });
    if (!isWithinMarkdown(state, from)) return (dont = { range });

    let node: null | SyntaxNode = tree.resolveInner(range.from);

    // cannot have inline nodes within these nodes
    if (["Image", "Link", "LinkMark", "LinkTitle", "URL"].includes(node.name))
      return (dont = { range });

    // if the selection is not empty, we need to check if the selection is within a node
    if (!range.empty && ["Document", "Paragraph"].includes(node.name))
      node = tree.resolveInner(range.from, 1);

    // if the selection is within a node, we need to check if the node is a paragraph, or itself
    while (![nodeName, "Paragraph"].includes(node.name) && node.parent) {
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
      if (
        [fromNode.name, toNode.name].some(
          (name) =>
            ![
              "Blockquote",
              "BulletList",
              "Document",
              "ListItem",
              "OrderedList",
              "Paragraph",
            ].includes(name),
        )
      ) {
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
