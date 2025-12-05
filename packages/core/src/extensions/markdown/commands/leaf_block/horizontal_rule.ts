import type { Command, KeyBinding } from "@codemirror/view";

import { createLeafBlockCommand } from "../leaf_block";

const horizontalRule: Command = (view) => {
  return createLeafBlockCommand(view, "***");
};

export const HorizontalRule: KeyBinding = {
  key: "Ctrl-Shift--",
  mac: "Cmd-Shift--",
  preventDefault: true,
  run: horizontalRule,
};
