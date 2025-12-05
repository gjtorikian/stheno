import { describe, it, expect, afterEach } from "vitest";

import { ensureSyntaxTree } from "@codemirror/language";
import { EditorView } from "@codemirror/view";

import { getSthenoConfig } from "../../../../index";
import { FencedCode } from "./fenced_code";

function createTestEditor(doc = ""): EditorView {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const view = new EditorView({
    parent: container,
    ...getSthenoConfig("md"),
    doc,
  });

  // Force parsing to complete
  ensureSyntaxTree(view.state, view.state.doc.length, 5000);
  view.dispatch({});

  return view;
}

function cleanupEditor(view: EditorView): void {
  view.dom.parentElement?.remove();
  view.destroy();
}

describe("fenced code command", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("inserts fenced code block at cursor", () => {
    view = createTestEditor("");
    FencedCode.run!(view);
    expect(view.state.doc.toString()).toBe("```\n\n```");
  });

  it("places cursor on empty line between fences", () => {
    view = createTestEditor("");
    FencedCode.run!(view);
    // Cursor should be after "```\n" (4 characters)
    expect(view.state.selection.main.head).toBe(4);
  });

  it("inserts at current cursor position", () => {
    view = createTestEditor("some text");
    // Move cursor to position 5 (after "some ")
    view.dispatch({
      selection: { anchor: 5 },
    });
    FencedCode.run!(view);
    expect(view.state.doc.toString()).toBe("some ```\n\n```text");
  });

  it("returns true on successful insertion", () => {
    view = createTestEditor("");
    const result = FencedCode.run!(view);
    expect(result).toBe(true);
  });
});
