import type { Range } from "@codemirror/state";

import { Decoration } from "@codemirror/view";

import { createViewportDecorator, iterateOverlayNodesInRange } from "../util";

/**
 * Plugin that decorates task list items.
 * - Wraps TaskMarker ([ ] or [x]) with a styled span
 * - Applies strikethrough styling to checked tasks
 * Display-only (non-interactive checkboxes).
 */
export function taskListPlugin() {
  return createViewportDecorator({
    buildDecorations: (state, from, to) => {
      const widgets: Range<Decoration>[] = [];

      // Track Task nodes and their markers
      const taskNodes: { from: number; to: number }[] = [];

      iterateOverlayNodesInRange(state, from, to, (node) => {
        if (node.name === "TaskMarker") {
          const taskMarker = state.sliceDoc(node.from, node.to);
          const isChecked = taskMarker.includes("x") || taskMarker.includes("X");

          // Wrap the task marker with a styled span
          widgets.push(
            Decoration.mark({
              class: "stheno-task-marker",
            }).range(node.from, node.to),
          );

          // Find the parent Task node and mark it for strikethrough if checked
          if (isChecked && node.parent?.name === "Task") {
            taskNodes.push({
              from: node.parent.from,
              to: node.parent.to,
            });
          }
        }
      });

      // Apply strikethrough styling to checked tasks
      for (const task of taskNodes) {
        widgets.push(
          Decoration.mark({
            class: "stheno-task-checked",
          }).range(task.from, task.to),
        );
      }

      return widgets;
    },
  });
}
