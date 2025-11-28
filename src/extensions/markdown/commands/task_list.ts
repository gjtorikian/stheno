import type { Command, KeyBinding } from "@codemirror/view";

import { createPrependLinesCommand } from "./block";

const taskList: Command = (view) => {
  return createPrependLinesCommand(view, "taskList");
};

export const TaskList: KeyBinding = {
  key: "Ctrl-Shift-l",
  mac: "Meta-Shift-l",
  preventDefault: true,
  run: taskList,
};
