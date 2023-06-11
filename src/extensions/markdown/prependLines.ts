import { EditorView, Command } from "@codemirror/view"
import { EditorSelection, ChangeSpec } from "@codemirror/state"

export function prependLines(mark: string, view: EditorView): void {
  view.dispatch(view.state.changeByRange(range => {
    const changes: ChangeSpec[] = [];
    let firstLine = view.state.doc.lineAt(range.from).number;
    let lastLine = view.state.doc.lineAt(range.to).number;

    // Iterate over the lines
    for (let i = firstLine; i <= lastLine; i++) {
      let line = view.state.doc.line(i);
      // Create a change that inserts the string at the start of the line
      changes.push({ from: line.from, insert: mark });
    }

    return {
      range: EditorSelection.range(range.from, range.to),
      changes
    }
  }))
}

export function makePrependLinesCommand(mark: string): Command {
  return (view: EditorView): boolean => {
    prependLines(mark, view)
    return true
  }
}
