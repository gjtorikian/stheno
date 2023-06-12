import { EditorView, Command, KeyBinding } from "@codemirror/view"
import { EditorSelection, ChangeSpec } from "@codemirror/state"

export function prependLines(mark: string, view: EditorView, ordered: boolean = false): void {
  view.dispatch(view.state.changeByRange(range => {
    const changes: ChangeSpec[] = [];
    let firstLine = view.state.doc.lineAt(range.from).number;
    let lastLine = view.state.doc.lineAt(range.to).number;
    let listIdx = 1;
    let newHead = range.to

    // Iterate over the lines
    for (let i = firstLine; i <= lastLine; i++, listIdx++) {
      let line = view.state.doc.line(i);
      let text = ordered ? `${listIdx}${mark} ` : `${mark} `
      newHead += text.length

      // Create a change that inserts the string at the start of the line
      changes.push({
        from: line.from,
        insert: text
      });
    }

    // TODO: Figure out how to get the head value correct after prepending
    return {
      range: EditorSelection.range(range.from, newHead),
      changes
    }
  }))
}

export function makePrependLinesCommand(mark: string, ordered: boolean = false): Command {
  return (view: EditorView): boolean => {
    prependLines(mark, view, ordered)
    return true
  }
}

export const BulletedList: KeyBinding = {
  key: "Ctrl-Shift-8",
  mac: "Cmd-Shift-8",
  run: makePrependLinesCommand("-"),
  preventDefault: true
}

export const NumberedList: KeyBinding = {
  key: "Ctrl-Shift-7",
  mac: "Cmd-Shift-7",
  run: makePrependLinesCommand(".", true),
  preventDefault: true
}

export const TaskList: KeyBinding = {
  key: "Ctrl-Shift-l",
  mac: "Meta-Shift-l",
  run: makePrependLinesCommand("- [ ]"),
  preventDefault: true
}

export const QuoteText: KeyBinding = {
  key: "Ctrl-Shift-.",
  mac: "Cmd-Shift-.",
  run: makePrependLinesCommand(">"),
  preventDefault: true
}
