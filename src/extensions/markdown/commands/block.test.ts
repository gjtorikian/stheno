import { describe, it, expect, afterEach } from "vitest";

import { EditorView } from "@codemirror/view";

import { createTestEditor, cleanupEditor, setSelection, getDoc } from "../../../test-utils";
import { createMultiLineCommand } from "./block";

describe("createMultiLineCommand", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  describe("edge cases", () => {
    it("preserves leading whitespace when prepending", () => {
      // Note: preserves indentation
      view = createTestEditor("  indented text");
      setSelection(view, 0);
      createMultiLineCommand(view, "unorderedList");
      expect(getDoc(view)).toBe("*   indented text");
    });

    it("returns true on successful command", () => {
      view = createTestEditor("some text");
      setSelection(view, 0);
      const result = createMultiLineCommand(view, "unorderedList");
      expect(result).toBe(true);
    });
  });
});
