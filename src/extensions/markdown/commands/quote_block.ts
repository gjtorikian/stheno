import type { Command, KeyBinding } from "@codemirror/view";

import { createPrependLinesCommand } from "./block";

const quote: Command = (view) => {
  return createPrependLinesCommand(view, "quote");
};

export const QuoteBlock: KeyBinding = {
  key: "Ctrl-Shift-.",
  mac: "Cmd-Shift-.",
  preventDefault: true,
  run: quote,
};
