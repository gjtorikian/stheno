import { describe, it, expect, afterEach } from "vitest";

import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { createTestEditor, cleanupEditor, setSelection, getDoc } from "../../../test-utils";
import { createLeafBlockCommand } from "./leaf_block";

describe("createLeafBlockCommand", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("inserts mark in empty editor", () => {
    view = createTestEditor("");
    createLeafBlockCommand(view, "***");
    expect(getDoc(view)).toBe("***\n");
  });

  it("inserts at cursor position", () => {
    view = createTestEditor("hello world");
    setSelection(view, 6);
    createLeafBlockCommand(view, "***");
    expect(getDoc(view)).toBe("hello ***\nworld");
  });

  it("inserts at start of line", () => {
    view = createTestEditor("hello world");
    setSelection(view, 0);
    createLeafBlockCommand(view, "***");
    expect(getDoc(view)).toBe("***\nhello world");
  });

  it("inserts at end of line", () => {
    view = createTestEditor("hello world");
    setSelection(view, 11);
    createLeafBlockCommand(view, "***");
    expect(getDoc(view)).toBe("hello world***\n");
  });

  it("returns true on successful command", () => {
    view = createTestEditor("some text");
    setSelection(view, 0);
    const result = createLeafBlockCommand(view, "***");
    expect(result).toBe(true);
  });

  it("returns false for read-only editor", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    view = new EditorView({
      parent: container,
      state: EditorState.create({
        doc: "hello world",
        extensions: [EditorState.readOnly.of(true)],
      }),
    });

    const result = createLeafBlockCommand(view, "***");
    expect(result).toBe(false);
    expect(getDoc(view)).toBe("hello world");
  });
});
