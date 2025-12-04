import type { Command, KeyBinding } from "@codemirror/view";

import { createMultiLineCommand } from "../container_block";

const taskList: Command = (view) => {
  return createMultiLineCommand(view, "taskList");
};

export const TaskList: KeyBinding = {
  key: "Ctrl-Shift-l",
  mac: "Meta-Shift-l",
  preventDefault: true,
  run: taskList,
};
