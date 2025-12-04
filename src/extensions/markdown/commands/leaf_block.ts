import { EditorSelection } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

export function createLeafBlockCommand(view: EditorView, mark: string): boolean {
  const { dispatch, state } = view;
  if (state.readOnly) return false;

  const insertText = `${mark}\n`;
  const insertLength = insertText.length;

  const transaction = state.changeByRange((range) => {
    const { from } = range;

    return {
      changes: [{ from, insert: insertText }],
      range: EditorSelection.cursor(from + insertLength),
    };
  });

  if (transaction.changes.empty) return false;

  dispatch(state.update(transaction, { userEvent: "insert.leafBlock" }));

  return true;
}
