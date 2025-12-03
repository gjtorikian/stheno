import type { Extension } from "@codemirror/state";

import { lineWrapper } from "./lists/line_wrapper";
import { listBulletPlugin } from "./lists/list";
import { taskListPlugin } from "./lists/task";

/**
 * List decorations.
 *
 * Includes line-level decorations for list structure and
 * mark decorations for list bullets and task markers.
 */
export const lists = (): Extension => {
  return [
    // Line-level decorations for list structure
    lineWrapper([
      { selector: "BulletList", class: "stheno-line-ul" },
      { selector: "OrderedList", class: "stheno-line-ol" },
      { selector: "ListItem", class: "stheno-line-li", nesting: true },
      { selector: "Blockquote", class: "stheno-line-blockquote" },
      { selector: "Task", class: "stheno-line-task" },
    ]),
    // List bullet marker decorations
    listBulletPlugin(),
    // Task list decorations
    taskListPlugin(),
  ];
};
