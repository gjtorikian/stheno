import type { Command, KeyBinding } from "@codemirror/view";

import { syntaxTree } from "@codemirror/language";
import { EditorSelection } from "@codemirror/state";

import { getCodeNode, isMultipleLines, isWithinMarkdown } from "..";

const FORBIDDEN_INLINE_NODES = new Set(["Image", "Link", "LinkMark", "LinkTitle", "URL", "CodeText"]);

const link: Command = (view) => {
  const { dispatch, state } = view;
  if (state.readOnly) return false;

  const tree = syntaxTree(state);
  let dont = null;

  const transaction = state.changeByRange((range) => {
    const { from, to } = range;

    if (range.empty) {
      return {
        changes: [{ from, insert: "[](url)" }],
        range: EditorSelection.cursor(from + 1),
      };
    }

    if (isMultipleLines(state.doc, from, to)) return (dont = { range });
    if (!isWithinMarkdown(state, from)) return (dont = { range });

    const node = tree.resolveInner(from);
    if (FORBIDDEN_INLINE_NODES.has(node.name)) return (dont = { range });

    const codeNode = getCodeNode(view, from);
    if (codeNode?.name === "CodeBlock" || codeNode?.name === "FencedCode") return (dont = { range });

    const selectedText = state.doc.sliceString(from, to);
    const newText = `[${selectedText}](url)`;

    return {
      changes: [{ from, to, insert: newText }],
      range: EditorSelection.cursor(from + selectedText.length + 3),
    };
  });

  if (transaction.changes.empty) return false;

  dispatch(state.update(transaction, { userEvent: "toggle.Link" }));

  return !dont;
};

export const LinkText: KeyBinding = {
  key: "Ctrl-k",
  mac: "Cmd-k",
  preventDefault: true,
  run: link,
};
