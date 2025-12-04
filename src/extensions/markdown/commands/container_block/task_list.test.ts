import { describe, it, expect, afterEach } from "vitest";

import { EditorView } from "@codemirror/view";

import { createTestEditor, cleanupEditor, setSelection, getDoc } from "../../../../test-utils";
import { createMultiLineCommand } from "../container_block";

describe("createMultiLineCommand - task list (- [ ])", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("prepends - [ ] to line", () => {
    view = createTestEditor("task item");
    setSelection(view, 0);
    createMultiLineCommand(view, "taskList");
    expect(getDoc(view)).toBe("- [ ] task item");
  });

  it("inserts placeholder in empty editor", () => {
    view = createTestEditor("");
    createMultiLineCommand(view, "taskList");
    expect(getDoc(view)).toBe("- [ ] Item");
  });
});
