import { EditorView, Command, KeyBinding } from "@codemirror/view"
import { EditorSelection } from "@codemirror/state"

export function wrapText(mark: string, view: EditorView): void {
  let changes = view.state.changeByRange(range => {
    // Get the current selection
    let { from, to } = range;

    // Get the text surrounding the selection to check for bold syntax
    const before = view.state.sliceDoc(Math.max(0, from - mark.length), from);
    const after = view.state.sliceDoc(to, Math.min(to + mark.length, view.state.doc.length));

    let tr;

    // Check if the selected text is already wrapped in the marker
    if (before === mark && after === mark) {
      // If it is, remove the formatting
      tr = {
        changes: [
          { from: from - mark.length, to: from },
          { from: to, to: to + mark.length }
        ],
        range: EditorSelection.range(from - mark.length, to + mark.length)
      };
    } else {
      // If it's not, add the formatting
      tr = {
        changes: [
          { from, to: from, insert: mark },
          { from: to, to, insert: mark }
        ],
        range: EditorSelection.range(from + mark.length, to + mark.length)
      };
    }

    return tr;
  })

  view.dispatch(changes)
}

export function makeWrapTextCommand(mark: string): Command {
  return (view: EditorView): boolean => {
    wrapText(mark, view)
    return true
  }
}

export const BoldText: KeyBinding = {
  key: "Ctrl-b",
  mac: "Cmd-b",
  run: makeWrapTextCommand("**"),
  preventDefault: true,
}

export const ItalicText: KeyBinding = {
  key: "Ctrl-i",
  mac: "Cmd-i",
  run: makeWrapTextCommand("*"),
  preventDefault: true,
}

export const CodeText: KeyBinding = {
  key: "Ctrl-e",
  mac: "Cmd-e",
  run: makeWrapTextCommand("`"),
  preventDefault: true,
}
