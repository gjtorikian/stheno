import { describe, it, expect, afterEach } from "vitest";

import { EditorView } from "@codemirror/view";

import { createTestEditor, cleanupEditor, setSelection, getDoc } from "../../../../test-utils";
import { createMultiLineCommand } from "../container_block";

describe("createMultiLineCommand - unordered list (*)", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("prepends * to line", () => {
    view = createTestEditor("item one");
    setSelection(view, 0);
    createMultiLineCommand(view, "unorderedList");
    expect(getDoc(view)).toBe("* item one");
  });

  it("removes * from already listed line (toggle)", () => {
    view = createTestEditor("* item one");
    setSelection(view, 2);
    createMultiLineCommand(view, "unorderedList");
    expect(getDoc(view)).toBe("item one");
  });

  it("handles multiple lines", () => {
    view = createTestEditor("one\ntwo\nthree");
    setSelection(view, 0, 13);
    createMultiLineCommand(view, "unorderedList");
    expect(getDoc(view)).toBe("* one\n* two\n* three");
  });

  it("inserts placeholder in empty editor", () => {
    view = createTestEditor("");
    createMultiLineCommand(view, "unorderedList");
    expect(getDoc(view)).toBe("* Item");
  });
});
