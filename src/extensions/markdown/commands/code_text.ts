import type { Command, KeyBinding } from "@codemirror/view";

import { ChangeSpec, EditorSelection, SelectionRange } from "@codemirror/state";

import { getCodeNode, isMultipleLines } from ".";
import { createWrapTextCommand } from "./inline";

const code: Command = (view) => {
  const { dispatch, state } = view;
  if (state.readOnly) return false;

  // Handle empty editor case
  if (
    state.doc.length === 0 ||
    (state.selection.main.empty &&
      state.selection.main.from === 0 &&
      state.doc.line(1).length === 0)
  ) {
    const placeholderText = "code";
    dispatch(
      state.update({
        changes: {
          from: 0,
          insert: `\`${placeholderText}\``,
          to: 0,
        },
        selection: EditorSelection.range(1, 1 + placeholderText.length),
        userEvent: "toggle.InlineCode",
      }),
    );
    return true;
  }

  if (state.selection.ranges.length > 1) {
    return createWrapTextCommand(view, "InlineCode", "`");
  }

  const range = state.selection.main;
  const node = getCodeNode(view, range.from);

  let line = state.doc.lineAt(range.from);
  const selMulti = isMultipleLines(state.doc, range.from, range.to);
  const noSelAndStartingOfLine = range.empty && range.from === line.from;

  const changes: ChangeSpec[] = [];
  let selection: SelectionRange | undefined = undefined;

  if (!selMulti && (node?.name === "InlineCode" || (!node && !noSelAndStartingOfLine))) {
    return createWrapTextCommand(view, "InlineCode", "`");
  }

  if (node?.name === "CodeBlock") {
    for (let pos = node.from; pos <= node.to; ) {
      line = state.doc.lineAt(pos);
      const space = /^\s*/.exec(line.text)![0];
      if (space) {
        let tabFlag = false;
        for (let j = 0; j < space.length; j++) {
          if (space.charCodeAt(j) === 9) {
            // \t
            tabFlag = true;
            changes.push({ from: line.from + j, to: line.from + j + 1 });
            break;
          }
        }
        if (!tabFlag) {
          changes.push({ from: line.from, to: line.from + 4 });
        }
      }

      pos = line.to + 1;
    }
  } else if (node?.name === "FencedCode") {
    if (node.to < range.to) return false;

    changes.push(
      { from: node.from, to: state.doc.lineAt(node.from).to + 1 },
      { from: state.doc.lineAt(node.to).from - 1, to: node.to },
    );
  } else {
    if (range.to > line.to) {
      for (let pos = line.to + 1; pos <= range.to; ) {
        line = state.doc.lineAt(pos);
        if (getCodeNode(view, pos)?.name === "FencedCode") return false;
        pos = line.to + 1;
      }
    }

    // If selection is empty, insert placeholder text
    if (range.empty) {
      const placeholderText = "code";
      changes.push({ from: range.from, insert: `\`${placeholderText}\`` });
      selection = EditorSelection.range(range.from + 1, range.from + 1 + placeholderText.length);
    } else {
      changes.push({ from: range.from, insert: "```\n" }, { from: range.to, insert: "\n```" });
      selection = EditorSelection.range(range.anchor + 4, range.head + 4);
    }
  }

  dispatch({
    changes,
    selection,
  });

  return true;
};

export const CodeText: KeyBinding = {
  key: "Ctrl-e",
  mac: "Cmd-e",
  preventDefault: true,
  run: code,
};
