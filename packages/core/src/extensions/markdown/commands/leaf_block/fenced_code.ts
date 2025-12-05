import type { Command, KeyBinding } from "@codemirror/view";

import { EditorSelection } from "@codemirror/state";

const fencedCode: Command = (view) => {
  const { dispatch, state } = view;
  if (state.readOnly) return false;

  const insertText = "```\n\n```";
  // Position cursor on the empty line between the fences
  const cursorOffset = 4; // After "```\n"

  const transaction = state.changeByRange((range) => {
    const { from } = range;

    return {
      changes: [{ from, insert: insertText }],
      range: EditorSelection.cursor(from + cursorOffset),
    };
  });

  if (transaction.changes.empty) return false;

  dispatch(state.update(transaction, { userEvent: "insert.leafBlock" }));

  return true;
};

export const FencedCode: KeyBinding = {
  key: "Ctrl-Shift-`",
  mac: "Cmd-Shift-`",
  preventDefault: true,
  run: fencedCode,
};
