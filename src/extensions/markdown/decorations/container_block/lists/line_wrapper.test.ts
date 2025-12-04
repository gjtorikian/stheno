import { describe, it, expect, afterEach } from "vitest";

import { ensureSyntaxTree } from "@codemirror/language";
import { EditorView } from "@codemirror/view";

import { getSthenoConfig } from "../../../../index";

function createTestEditor(doc = ""): EditorView {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const view = new EditorView({
    parent: container,
    ...getSthenoConfig("md"),
    doc,
  });

  // Force parsing to complete so decorations are applied
  ensureSyntaxTree(view.state, view.state.doc.length, 5000);
  // Force a re-render to apply decorations
  view.dispatch({});

  return view;
}

function cleanupEditor(view: EditorView): void {
  view.dom.parentElement?.remove();
  view.destroy();
}

describe("line wrapper decoration", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("applies stheno-line-ul class to unordered list lines", () => {
    view = createTestEditor("* item one");
    const line = view.dom.querySelector(".cm-line");
    expect(line?.classList.contains("stheno-line-ul")).toBe(true);
  });

  it("applies stheno-line-ol class to ordered list lines", () => {
    view = createTestEditor("1. item one");
    const line = view.dom.querySelector(".cm-line");
    expect(line?.classList.contains("stheno-line-ol")).toBe(true);
  });

  it("applies stheno-line-li class with nesting depth", () => {
    view = createTestEditor("* item one");
    const line = view.dom.querySelector(".cm-line");
    expect(line?.classList.contains("stheno-line-li")).toBe(true);
    expect(line?.classList.contains("stheno-line-li-1")).toBe(true);
  });

  it("applies stheno-line-blockquote class to blockquote lines", () => {
    view = createTestEditor("> quoted text");
    const line = view.dom.querySelector(".cm-line");
    expect(line?.classList.contains("stheno-line-blockquote")).toBe(true);
  });

  it("applies stheno-line-task class to task list lines", () => {
    view = createTestEditor("- [ ] task item");
    const line = view.dom.querySelector(".cm-line");
    expect(line?.classList.contains("stheno-line-task")).toBe(true);
  });
});
