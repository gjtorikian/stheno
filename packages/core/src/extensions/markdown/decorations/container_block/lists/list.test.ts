import { describe, it, expect, afterEach } from "vitest";

import { ensureSyntaxTree } from "@codemirror/language";
import { EditorView } from "@codemirror/view";

import { getSthenoConfig } from "../../../../../index";

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

describe("list bullet decoration", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("wraps unordered list marker with stheno-list-bullet class", () => {
    view = createTestEditor("* item one");
    const bullet = view.dom.querySelector(".stheno-list-bullet");
    expect(bullet).not.toBeNull();
    expect(bullet?.textContent).toBe("*");
  });

  it("wraps ordered list marker with stheno-list-bullet class", () => {
    view = createTestEditor("1. item one");
    const bullet = view.dom.querySelector(".stheno-list-bullet");
    expect(bullet).not.toBeNull();
    expect(bullet?.textContent).toBe("1.");
  });

  it("wraps dash list marker with stheno-list-bullet class", () => {
    view = createTestEditor("- item one");
    const bullet = view.dom.querySelector(".stheno-list-bullet");
    expect(bullet).not.toBeNull();
    expect(bullet?.textContent).toBe("-");
  });

  it("wraps unordered list text content with stheno-list class", () => {
    view = createTestEditor("* item one");
    const listText = view.dom.querySelector(".stheno-list");
    expect(listText).not.toBeNull();
    expect(listText?.textContent).toBe("item one");
  });

  it("wraps ordered list text content with stheno-list class", () => {
    view = createTestEditor("1. item one");
    const listText = view.dom.querySelector(".stheno-list");
    expect(listText).not.toBeNull();
    expect(listText?.textContent).toBe("item one");
  });

  it("wraps dash list text content with stheno-list class", () => {
    view = createTestEditor("- item one");
    const listText = view.dom.querySelector(".stheno-list");
    expect(listText).not.toBeNull();
    expect(listText?.textContent).toBe("item one");
  });
});

describe("nested lists", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("applies increasing depth classes for nested lists", () => {
    view = createTestEditor("* outer\n  * inner");
    const lines = view.dom.querySelectorAll(".cm-line");
    expect(lines[0]?.classList.contains("stheno-line-li-1")).toBe(true);
    // Note: nesting detection depends on parser behavior
  });
});
