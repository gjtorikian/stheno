import type { Command, KeyBinding } from "@codemirror/view";

import { createWrapTextCommand } from "../inline";

const strikethrough: Command = (view) => {
  return createWrapTextCommand(view, "Strikethrough", "~~");
};

export const StrikethroughText: KeyBinding = {
  key: "Ctrl-Shift-s",
  mac: "Cmd-Shift-s",
  preventDefault: true,
  run: strikethrough,
};
