import type { Command, KeyBinding } from "@codemirror/view";

import { createMultiLineCommand } from "../block";

const bulletedList: Command = (view) => {
  return createMultiLineCommand(view, "unorderedList");
};

export const BulletedList: KeyBinding = {
  key: "Ctrl-Shift-8",
  mac: "Cmd-Shift-8",
  preventDefault: true,
  run: bulletedList,
};
