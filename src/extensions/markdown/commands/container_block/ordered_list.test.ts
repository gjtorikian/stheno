import { describe, it, expect, afterEach } from "vitest";

import { EditorView } from "@codemirror/view";

import { createTestEditor, cleanupEditor, setSelection, getDoc } from "../../../../test-utils";
import { createMultiLineCommand } from "../container_block";

describe("createMultiLineCommand - ordered list (1.)", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("prepends 1. to line", () => {
    view = createTestEditor("first item");
    setSelection(view, 0);
    createMultiLineCommand(view, "orderedList");
    expect(getDoc(view)).toBe("1. first item");
  });

  it("removes numbering from already numbered line (toggle)", () => {
    view = createTestEditor("1. first item");
    setSelection(view, 3);
    createMultiLineCommand(view, "orderedList");
    expect(getDoc(view)).toBe("first item");
  });

  it("numbers multiple selected lines sequentially", () => {
    view = createTestEditor("one\ntwo\nthree");
    setSelection(view, 0, 13);
    createMultiLineCommand(view, "orderedList");
    expect(getDoc(view)).toBe("1. one\n2. two\n3. three");
  });

  it("inserts placeholder in empty editor", () => {
    view = createTestEditor("");
    createMultiLineCommand(view, "orderedList");
    expect(getDoc(view)).toBe("1. Item");
  });
});
