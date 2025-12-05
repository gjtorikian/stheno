import { describe, it, expect, afterEach } from "vitest";

import { EditorView } from "@codemirror/view";

import { createTestEditor, cleanupEditor, setSelection, getDoc } from "../../../../test-utils";
import { createMultiLineCommand } from "../container_block";

describe("createMultiLineCommand - quote block (> )", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("prepends > to line", () => {
    view = createTestEditor("quoted text");
    setSelection(view, 0);
    createMultiLineCommand(view, "quote");
    expect(getDoc(view)).toBe("> quoted text");
  });

  it("removes > from already quoted line (toggle)", () => {
    view = createTestEditor("> quoted text");
    setSelection(view, 2);
    createMultiLineCommand(view, "quote");
    expect(getDoc(view)).toBe("quoted text");
  });

  it("handles multiple lines", () => {
    view = createTestEditor("line one\nline two");
    setSelection(view, 0, 17);
    createMultiLineCommand(view, "quote");
    expect(getDoc(view)).toBe("> line one\n> line two");
  });

  it("inserts placeholder in empty editor", () => {
    view = createTestEditor("");
    createMultiLineCommand(view, "quote");
    expect(getDoc(view)).toBe("> Item");
  });
});
