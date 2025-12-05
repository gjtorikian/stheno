import { describe, it, expect, afterEach } from "vitest";

import { ensureSyntaxTree } from "@codemirror/language";
import { EditorView } from "@codemirror/view";

import { getSthenoConfig } from "../../../index";

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

describe("horizontal rule decoration", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("wraps *** with stheno-hr class", () => {
    view = createTestEditor("***");
    const hr = view.dom.querySelector(".stheno-hr");
    expect(hr).not.toBeNull();
    expect(hr?.textContent).toBe("***");
  });

  it("wraps --- with stheno-hr class (not at document start)", () => {
    // Note: --- at position 0 conflicts with YAML frontmatter syntax
    view = createTestEditor("text\n\n---");
    const hr = view.dom.querySelector(".stheno-hr");
    expect(hr).not.toBeNull();
    expect(hr?.textContent).toBe("---");
  });

  it("wraps ___ with stheno-hr class", () => {
    view = createTestEditor("___");
    const hr = view.dom.querySelector(".stheno-hr");
    expect(hr).not.toBeNull();
    expect(hr?.textContent).toBe("___");
  });

  it("wraps horizontal rule in context", () => {
    view = createTestEditor("some text\n\n***\n\nmore text");
    const hr = view.dom.querySelector(".stheno-hr");
    expect(hr).not.toBeNull();
    expect(hr?.textContent).toBe("***");
  });
});
