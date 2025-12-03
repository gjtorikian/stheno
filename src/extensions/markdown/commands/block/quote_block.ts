import type { Command, KeyBinding } from "@codemirror/view";

import { createMultiLineCommand } from "../block";

const quote: Command = (view) => {
  return createMultiLineCommand(view, "quote");
};

export const QuoteBlock: KeyBinding = {
  key: "Ctrl-Shift-.",
  mac: "Cmd-Shift-.",
  preventDefault: true,
  run: quote,
};
