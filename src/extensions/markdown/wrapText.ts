import { EditorView, Command } from "@codemirror/view"
import { EditorSelection } from "@codemirror/state"

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
