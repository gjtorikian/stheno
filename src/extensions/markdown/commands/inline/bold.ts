import type { Command, KeyBinding } from "@codemirror/view";

import { createWrapTextCommand } from "../inline";

const bold: Command = (view) => {
  return createWrapTextCommand(view, "StrongEmphasis", "**");
};

export const BoldText: KeyBinding = {
  key: "Ctrl-b",
  mac: "Cmd-b",
  preventDefault: true,
  run: bold,
};
