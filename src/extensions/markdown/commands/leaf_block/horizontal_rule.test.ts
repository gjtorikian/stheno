import { describe, it, expect, afterEach } from "vitest";

import { EditorView } from "@codemirror/view";

import { createTestEditor, cleanupEditor, setSelection, getDoc } from "../../../../test-utils";
import { createLeafBlockCommand } from "../leaf_block";

describe("createLeafBlockCommand - horizontal rule (***)", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("inserts *** in empty editor", () => {
    view = createTestEditor("");
    createLeafBlockCommand(view, "***");
    expect(getDoc(view)).toBe("***\n");
  });

  it("inserts at cursor position mid-line", () => {
    view = createTestEditor("hello world");
    setSelection(view, 6);
    createLeafBlockCommand(view, "***");
    expect(getDoc(view)).toBe("hello ***\nworld");
  });
});
