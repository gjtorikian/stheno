import type { Command, KeyBinding } from "@codemirror/view";

import { createMultiLineCommand } from "../block";

const orderedList: Command = (view) => {
  return createMultiLineCommand(view, "orderedList");
};

export const OrderedList: KeyBinding = {
  key: "Ctrl-Shift-7",
  mac: "Cmd-Shift-7",
  preventDefault: true,
  run: orderedList,
};
