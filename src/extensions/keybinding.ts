import type { Extension } from "@codemirror/state";
import type { KeyBinding } from "@codemirror/view";

import { closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import {
  defaultKeymap as codemirrorDefaultKeymap,
  historyKeymap,
  indentLess,
  indentMore,
} from "@codemirror/commands";
import { lintKeymap } from "@codemirror/lint";
import { searchKeymap } from "@codemirror/search";
import { Compartment, Transaction } from "@codemirror/state";
import { keymap } from "@codemirror/view";

import {
  BoldText,
  BulletedList,
  CodeText,
  ItalicText,
  OrderedList,
  QuoteBlock,
  StrikethroughText,
  TaskList,
} from "./markdown/commands/index";

// technically, this can all be done with `indentWithTab`: https://codemirror.net/examples/tab/
// this adds some extra niceities, and servers as an overall demonstration of how to add custom keybindings;
// we are breaking W3C Web Content Accessibility Guidelines, see link for more information
const customKeybindings: KeyBinding[] = [
  {
    key: "Tab",
    run: ({ dispatch, state }) => {
      if (state.selection.ranges.some((r) => !r.empty)) {
        return indentMore({ dispatch, state });
      }
      dispatch(
        state.update(state.replaceSelection("\t"), {
          annotations: Transaction.userEvent.of("input"),
          scrollIntoView: true,
        }),
      );

      return true;
    },
    shift: indentLess,
  },
];

export const KEYBINDINGS = new Compartment();

const defaultKeymap = codemirrorDefaultKeymap
  // Disabling cmd + enter
  .filter((conf) => conf.key !== "Mod-Enter");

export const keymaps = (): Extension => {
  return keymap.of([
    BoldText,
    ItalicText,
    CodeText,
    StrikethroughText,
    QuoteBlock,
    OrderedList,
    BulletedList,
    TaskList,
    ...defaultKeymap,
    ...customKeybindings,
    ...lintKeymap,
    ...completionKeymap,
    ...historyKeymap,
    ...searchKeymap,
    ...closeBracketsKeymap,
  ]);
};
