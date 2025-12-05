import { describe, it, expect, afterEach } from "vitest";

import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { createTestEditor, cleanupEditor, setSelection, getDoc } from "../../../../test-utils";
import { LinkText } from "./link";

describe("LinkText command", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  describe("read-only state", () => {
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

      const result = LinkText.run!(view);
      expect(result).toBe(false);
      expect(getDoc(view)).toBe("hello world");
    });
  });

  describe("empty selection (cursor only)", () => {
    it("inserts link placeholder when no selection", () => {
      view = createTestEditor("hello world");
      setSelection(view, 6);
      LinkText.run!(view);
      expect(getDoc(view)).toBe("hello [](url)world");
    });

    it("inserts link placeholder in empty editor", () => {
      view = createTestEditor("");
      LinkText.run!(view);
      expect(getDoc(view)).toBe("[](url)");
    });

    it("positions cursor inside brackets for text entry", () => {
      view = createTestEditor("hello world");
      setSelection(view, 6);
      LinkText.run!(view);
      const sel = view.state.selection.main;
      expect(sel.from).toBe(7); // cursor inside []
      expect(sel.to).toBe(7);
    });
  });

  describe("wrapping selected text", () => {
    it("wraps selected text in link syntax", () => {
      view = createTestEditor("hello world");
      setSelection(view, 0, 5); // select "hello"
      LinkText.run!(view);
      expect(getDoc(view)).toBe("[hello](url) world");
    });

    it("positions cursor in url portion after wrapping", () => {
      view = createTestEditor("hello world");
      setSelection(view, 0, 5); // select "hello"
      LinkText.run!(view);
      const sel = view.state.selection.main;
      // cursor should be at "url" position: [hello](url)
      //                                      0123456789
      expect(sel.from).toBe(8); // after "[hello]("
      expect(sel.to).toBe(8);
    });

    it("wraps single word", () => {
      view = createTestEditor("word");
      setSelection(view, 0, 4);
      LinkText.run!(view);
      expect(getDoc(view)).toBe("[word](url)");
    });

    it("wraps text at end of document", () => {
      view = createTestEditor("some text");
      setSelection(view, 5, 9); // select "text"
      LinkText.run!(view);
      expect(getDoc(view)).toBe("some [text](url)");
    });
  });

  describe("link restrictions", () => {
    it("does not wrap text already inside a link", () => {
      view = createTestEditor("[existing link](url)");
      setSelection(view, 1, 14); // select "existing link"
      const result = LinkText.run!(view);
      expect(result).toBe(false);
      expect(getDoc(view)).toBe("[existing link](url)");
    });

    it("does not wrap URL inside link", () => {
      view = createTestEditor("[text](http://example.com)");
      setSelection(view, 7, 25);
      const result = LinkText.run!(view);
      expect(result).toBe(false);
    });
  });

  describe("multi-line selection blocking", () => {
    it("does not wrap selection spanning two lines", () => {
      view = createTestEditor("hello\nworld");
      setSelection(view, 0, 11);
      const result = LinkText.run!(view);
      expect(result).toBe(false);
      expect(getDoc(view)).toBe("hello\nworld");
    });
  });

  describe("code block restrictions", () => {
    it("does not wrap text inside fenced code block", () => {
      view = createTestEditor("```\ncode here\n```");
      setSelection(view, 5, 13);
      const result = LinkText.run!(view);
      expect(result).toBe(false);
    });
  });

  describe("block context", () => {
    it("works inside blockquote", () => {
      view = createTestEditor("> quoted text");
      setSelection(view, 2, 8); // select "quoted"
      LinkText.run!(view);
      expect(getDoc(view)).toBe("> [quoted](url) text");
    });

    it("works inside bullet list item", () => {
      view = createTestEditor("- list item");
      setSelection(view, 2, 6); // select "list"
      LinkText.run!(view);
      expect(getDoc(view)).toBe("- [list](url) item");
    });
  });

  describe("return values", () => {
    it("returns true on successful wrap", () => {
      view = createTestEditor("hello");
      setSelection(view, 0, 5);
      const result = LinkText.run!(view);
      expect(result).toBe(true);
    });

    it("returns true on empty selection insertion", () => {
      view = createTestEditor("hello");
      setSelection(view, 0);
      const result = LinkText.run!(view);
      expect(result).toBe(true);
    });

    it("returns false when blocked by multi-line selection", () => {
      view = createTestEditor("hello\nworld");
      setSelection(view, 0, 11);
      const result = LinkText.run!(view);
      expect(result).toBe(false);
    });
  });
});
