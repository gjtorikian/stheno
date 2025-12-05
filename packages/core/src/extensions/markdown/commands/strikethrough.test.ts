import { describe, it, expect, afterEach } from "vitest";

import { EditorView } from "@codemirror/view";

import { createTestEditor, cleanupEditor, setSelection, getDoc } from "../../../test-utils";
import { createWrapTextCommand } from "./inline";
import { StrikethroughText } from "./inline/strikethrough";

/**
 * Note: Inline commands with selection don't work in jsdom
 * due to CodeMirror language detection limitations. Use E2E tests for those.
 * These tests cover empty selection and unwrapping behavior.
 */
describe("strikethrough command", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  describe("keybinding configuration", () => {
    it("StrikethroughText has correct key bindings", () => {
      expect(StrikethroughText.key).toBe("Ctrl-Shift-s");
      expect(StrikethroughText.mac).toBe("Cmd-Shift-s");
      expect(StrikethroughText.preventDefault).toBe(true);
    });
  });

  describe("empty selection (placeholder insertion)", () => {
    it("inserts placeholder when no selection", () => {
      view = createTestEditor("hello world");
      setSelection(view, 6); // cursor between "hello " and "world"
      createWrapTextCommand(view, "Strikethrough", "~~");
      expect(getDoc(view)).toContain("~~~~");
    });

    it("inserts placeholder in empty editor", () => {
      view = createTestEditor("");
      createWrapTextCommand(view, "Strikethrough", "~~");
      expect(getDoc(view)).toBe("~~~~");
    });
  });

  describe("toggle behavior (unwrapping)", () => {
    it("unwraps already struck-through text", () => {
      view = createTestEditor("~~hello~~ world");
      setSelection(view, 2, 7); // select "hello" inside ~~
      createWrapTextCommand(view, "Strikethrough", "~~");
      expect(getDoc(view)).toBe("hello world");
    });

    it("unwraps text when selecting entire content", () => {
      view = createTestEditor("~~hello~~");
      setSelection(view, 2, 7); // select "hello"
      createWrapTextCommand(view, "Strikethrough", "~~");
      expect(getDoc(view)).toBe("hello");
    });
  });
});
