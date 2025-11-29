import { ChangeSpec, EditorSelection } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { getCodeNode } from ".";

const BlockRegExps = {
  orderedList: /^(\s*)\d+\.\s+/,
  quote: /^(\s*)>\s+/,
  taskList: /^(\s*)([*-+])\s+\[(x| )\]\s+/,
  unorderedList: /^(\s*)([*-+])\s+/,
};

const BlockMarks = {
  orderedList: (i: number): string => {
    return `${i}. `;
  },
  quote: "> ",
  taskList: "- [ ] ",
  unorderedList: "* ",
};

enum BlockTypes {
  OrderedList = "orderedList",
  Quote = "quote",
  TaskList = "taskList",
  UnorderedList = "unorderedList",
}

export function createPrependLinesCommand(view: EditorView, type: string): boolean {
  return toggleBlock(view, type as BlockTypes);
}

function toggleBlock(view: EditorView, type: BlockTypes) {
  const { dispatch, state } = view;
  if (state.readOnly) return false;

  // Handle empty editor case
  if (
    state.doc.length === 0 ||
    (state.selection.main.empty &&
      state.selection.main.from === 0 &&
      state.doc.line(1).length === 0)
  ) {
    let mark;
    if (type == BlockTypes.OrderedList) {
      mark = BlockMarks[type](1);
    } else {
      mark = BlockMarks[type];
    }

    const placeholderText = "Item";
    dispatch(
      state.update({
        changes: {
          from: 0,
          insert: `${mark}${placeholderText}`,
          to: 0,
        },
        selection: EditorSelection.range(mark.length, mark.length + placeholderText.length),
        userEvent: `toggle.${type}`,
      }),
    );
    return true;
  }

  const transaction = state.changeByRange((range) => {
    let changes: ChangeSpec[] = [];

    const regExp = BlockRegExps[type];
    const exist = regExp.test(state.doc.lineAt(range.from).text);

    for (let i = 1, pos = range.from; pos <= range.to; ) {
      const line = state.doc.lineAt(pos);

      if (getCodeNode(view, line.to, true)?.name === "FencedCode") {
        changes = [];
        break;
      }

      let mark;
      if (type == BlockTypes.OrderedList) {
        mark = BlockMarks[type](i);
      } else {
        mark = BlockMarks[type];
      }

      const text = exist ? line.text.replace(regExp, "$1") : `${mark}${line.text}`;

      changes.push({ from: line.from, insert: text, to: line.to });

      i++;
      pos = line.to + 1;
    }

    const changeSet = state.changes(changes);

    return {
      changes,
      range: EditorSelection.range(
        changeSet.mapPos(range.anchor, 1),
        changeSet.mapPos(range.head, 1),
      ),
    };
  });

  if (transaction.changes.empty) return false;

  dispatch(state.update(transaction, { userEvent: `toggle.${type}` }));

  return true;
}
