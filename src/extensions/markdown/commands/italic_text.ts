import type { Command, KeyBinding } from "@codemirror/view";

import { createWrapTextCommand } from "./inline";

const italic: Command = (view) => {
  return createWrapTextCommand(view, "Emphasis", "_");
};

export const ItalicText: KeyBinding = {
  key: "Ctrl-i",
  mac: "Cmd-i",
  preventDefault: true,
  run: italic,
};
