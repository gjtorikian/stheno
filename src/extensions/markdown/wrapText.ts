import { EditorView, Command, KeyBinding } from "@codemirror/view"
import { EditorSelection } from "@codemirror/state"
import { snippet } from "@codemirror/autocomplete"

export function wrapText(mark: string, view: EditorView): void {
  view.dispatch(view.state.changeByRange(range => ({
    changes: [{ from: range.from, insert: mark }, { from: range.to, insert: mark }],
    range: EditorSelection.range(range.from + mark.length, range.to + mark.length)
  })))
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
