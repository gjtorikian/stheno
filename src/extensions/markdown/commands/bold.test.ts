import { describe, it, expect, afterEach } from "vitest";

import { EditorView } from "@codemirror/view";

import { createTestEditor, cleanupEditor, setSelection, getDoc } from "../../../test-utils";
import { createWrapTextCommand } from "./inline";

describe("createWrapTextCommand - bold (**)", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("inserts placeholder when no selection", () => {
    view = createTestEditor("hello world");
    setSelection(view, 6); // cursor between "hello " and "world"
    createWrapTextCommand(view, "StrongEmphasis", "**");
    expect(getDoc(view)).toContain("****");
  });

  it("inserts placeholder in empty editor", () => {
    view = createTestEditor("");
    createWrapTextCommand(view, "StrongEmphasis", "**");
    expect(getDoc(view)).toBe("****");
  });

  it("unwraps already bold text", () => {
    view = createTestEditor("**hello** world");
    setSelection(view, 2, 7); // select "hello" inside **
    createWrapTextCommand(view, "StrongEmphasis", "**");
    expect(getDoc(view)).toBe("hello world");
  });
});
