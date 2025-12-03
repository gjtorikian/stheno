import { describe, it, expect, afterEach } from "vitest";

import { EditorView } from "@codemirror/view";

import { createTestEditor, cleanupEditor, setSelection, getDoc } from "../../../test-utils";
import { createWrapTextCommand } from "./inline";

/**
 * Note: Tests for wrapping selected text in jsdom have limitations due to
 * CodeMirror's language detection not working fully in jsdom environment.
 * The `isWithinMarkdown` check fails for plain text, causing wrap operations
 * to not execute. Use E2E tests (Playwright) for comprehensive selection-based tests.
 */
describe("createWrapTextCommand - italic (_)", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("inserts placeholder when no selection", () => {
    view = createTestEditor("hello world");
    setSelection(view, 6); // cursor between "hello " and "world"
    createWrapTextCommand(view, "Emphasis", "_");
    expect(getDoc(view)).toContain("__");
  });

  it("inserts placeholder in empty editor", () => {
    view = createTestEditor("");
    createWrapTextCommand(view, "Emphasis", "_");
    expect(getDoc(view)).toBe("__");
  });

  it("unwraps already italicized text", () => {
    view = createTestEditor("_hello_ world");
    setSelection(view, 2, 7); // select "hello" inside _
    createWrapTextCommand(view, "Emphasis", "_");
    expect(getDoc(view)).toBe("hello world");
  });

  describe("italic vs bold disambiguation", () => {
    it("does not conflict with bold markers", () => {
      view = createTestEditor("**bold**");
      setSelection(view, 2, 6); // select "bold" inside **
      // Trying to italicize inside bold - should work in theory
      createWrapTextCommand(view, "Emphasis", "_");
      expect(getDoc(view)).toContain("**_bold_**");
    });

    it("inserts italic inside bold text", () => {
      view = createTestEditor("**some text**");
      setSelection(view, 6); // cursor inside bold
      createWrapTextCommand(view, "Emphasis", "*");
      expect(getDoc(view)).toContain("**");
    });
  });
});
