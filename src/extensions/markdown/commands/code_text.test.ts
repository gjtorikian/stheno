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
describe("createWrapTextCommand - inline code (`)", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("inserts placeholder when no selection", () => {
    view = createTestEditor("hello world");
    setSelection(view, 6); // cursor between "hello " and "world"
    createWrapTextCommand(view, "InlineCode", "`");
    expect(getDoc(view)).toContain("``");
  });

  it("inserts placeholder in empty editor", () => {
    view = createTestEditor("");
    createWrapTextCommand(view, "InlineCode", "`");
    expect(getDoc(view)).toBe("``");
  });

  it("unwraps already coded text", () => {
    view = createTestEditor("`hello` world");
    setSelection(view, 2, 7); // select "hello" inside ``
    createWrapTextCommand(view, "InlineCode", "`");
    expect(getDoc(view)).toBe("hello world");
  });

  describe("nested formatting interactions", () => {
    it("inserts code marks inside bold text", () => {
      view = createTestEditor("**some text**");
      setSelection(view, 6);
      createWrapTextCommand(view, "InlineCode", "`");
      expect(getDoc(view)).toContain("**some`` text**");
    });

    it("inserts code marks inside italic text", () => {
      view = createTestEditor("*some text*");
      setSelection(view, 5);
      createWrapTextCommand(view, "InlineCode", "`");
      expect(getDoc(view)).toContain("some``");
    });
  });
});
