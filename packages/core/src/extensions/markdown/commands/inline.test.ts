import { describe, it, expect, afterEach } from "vitest";

import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { createTestEditor, cleanupEditor, setSelection, getDoc } from "../../../test-utils";
import { createWrapTextCommand } from "./inline";

/**
 * Edge case tests for the insertMarker function in inline.ts.
 * These tests focus on the shared edge cases that apply to all inline formatting
 * (bold, italic, inline code) rather than format-specific behavior.
 */
describe("insertMarker - edge cases", () => {
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

      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
      expect(getDoc(view)).toBe("hello world");
    });

    it("does not modify document when read-only", () => {
      const container = document.createElement("div");
      document.body.appendChild(container);
      view = new EditorView({
        parent: container,
        state: EditorState.create({
          doc: "some text here",
          extensions: [EditorState.readOnly.of(true)],
        }),
      });

      createWrapTextCommand(view, "Emphasis", "*");
      expect(getDoc(view)).toBe("some text here");
    });
  });

  describe("empty selection (cursor only)", () => {
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

    it("inserts placeholder at start of line", () => {
      view = createTestEditor("hello world");
      setSelection(view, 0);
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toBe("****hello world");
    });

    it("inserts placeholder at middle of line", () => {
      view = createTestEditor("hello world");
      setSelection(view, 6);
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toBe("hello ****world");
    });

    it("inserts placeholder at end of line", () => {
      view = createTestEditor("hello world");
      setSelection(view, 11); // end of "hello world"
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toBe("hello world****");
    });

    it("inserts placeholder at empty first line with content below", () => {
      view = createTestEditor("\nhello");
      setSelection(view, 0); // cursor at empty first line
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toBe("****\nhello");
    });

    it("places cursor between marks after insertion", () => {
      view = createTestEditor("hello world");
      setSelection(view, 6);
      createWrapTextCommand(view, "StrongEmphasis", "**");
      const sel = view.state.selection.main;
      // Cursor should be between the ** marks (position 8, after "hello ****")
      expect(sel.from).toBe(8);
      expect(sel.to).toBe(8);
    });
  });

  describe("unwrapping", () => {
    it("unwraps already wrapped text", () => {
      view = createTestEditor("**hello** world");
      setSelection(view, 2, 7); // select "hello" inside **
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toBe("hello world");
    });

    it("unwraps text with cursor inside (no selection)", () => {
      view = createTestEditor("**hello** world");
      setSelection(view, 4); // cursor inside "hello"
      createWrapTextCommand(view, "StrongEmphasis", "**");
      // Should insert new marks at cursor, not unwrap
      expect(getDoc(view)).toContain("****");
    });

    it("unwraps text when selecting entire content", () => {
      view = createTestEditor("**hello**");
      setSelection(view, 2, 7); // select "hello"
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toBe("hello");
    });

    it("unwraps at start of document", () => {
      view = createTestEditor("**start** and more");
      setSelection(view, 2, 7); // select "start"
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toBe("start and more");
    });

    it("unwraps at end of document", () => {
      view = createTestEditor("some text **end**");
      setSelection(view, 12, 15); // select "end"
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toBe("some text end");
    });
  });

  describe("block context", () => {
    it("works inside blockquote", () => {
      view = createTestEditor("> quoted text");
      setSelection(view, 2); // cursor inside quote
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toContain("****");
    });

    it("works inside bullet list item", () => {
      view = createTestEditor("- list item");
      setSelection(view, 2); // cursor inside list item
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toContain("****");
    });

    it("works inside ordered list item", () => {
      view = createTestEditor("1. list item");
      setSelection(view, 3); // cursor inside list item
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toContain("****");
    });

    it("works inside task list item", () => {
      view = createTestEditor("- [ ] task item");
      setSelection(view, 6); // cursor inside task
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toContain("****");
    });
  });

  describe("cursor position after operation", () => {
    it("maintains relative cursor position after unwrap", () => {
      view = createTestEditor("**hello** world");
      setSelection(view, 2, 7); // select "hello"
      createWrapTextCommand(view, "StrongEmphasis", "**");
      const sel = view.state.selection.main;
      // After unwrap, "hello" should be at 0-5
      expect(sel.from).toBe(0);
      expect(sel.to).toBe(5);
    });
  });

  describe("multi-line selection blocking", () => {
    it("does not wrap selection spanning two lines", () => {
      view = createTestEditor("hello\nworld");
      setSelection(view, 0, 11);
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
      expect(getDoc(view)).toBe("hello\nworld");
    });

    it("does not wrap selection spanning three lines", () => {
      view = createTestEditor("one\ntwo\nthree");
      setSelection(view, 0, 13);
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("does not wrap selection at line break boundary", () => {
      view = createTestEditor("hello\nworld");
      setSelection(view, 3, 8); // "lo\nwo"
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("does not wrap selection ending at newline", () => {
      view = createTestEditor("hello\nworld");
      setSelection(view, 0, 6); // "hello\n"
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });
  });

  describe("link restrictions", () => {
    it("does not wrap link text", () => {
      view = createTestEditor("[link text](http://example.com)");
      setSelection(view, 1, 10); // select "link text"
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("does not wrap URL inside link", () => {
      view = createTestEditor("[text](http://example.com)");
      setSelection(view, 7, 25); // select the URL
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("does not wrap link title", () => {
      view = createTestEditor('[text](http://example.com "title")');
      setSelection(view, 27, 32); // select "title"
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("does not wrap opening link bracket", () => {
      view = createTestEditor("[link](url)");
      setSelection(view, 0, 1); // select "["
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("does not wrap closing link bracket", () => {
      view = createTestEditor("[link](url)");
      setSelection(view, 5, 6); // select "]"
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("does not wrap parentheses around URL", () => {
      view = createTestEditor("[link](url)");
      setSelection(view, 6, 7); // select "("
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });
  });

  describe("image restrictions", () => {
    it("does not wrap image alt text", () => {
      view = createTestEditor("![alt text](image.png)");
      setSelection(view, 2, 10); // select "alt text"
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("does not wrap image URL", () => {
      view = createTestEditor("![alt](image.png)");
      setSelection(view, 7, 16); // select "image.png"
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("does not wrap image exclamation mark", () => {
      view = createTestEditor("![alt](url)");
      setSelection(view, 0, 1); // select "!"
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });
  });

  describe("code block restrictions", () => {
    it("does not wrap text inside indented code block", () => {
      view = createTestEditor("    code here");
      setSelection(view, 4, 13); // select "code here"
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("does not wrap text inside indented code block with 8 spaces", () => {
      view = createTestEditor("        deeply indented");
      setSelection(view, 8, 23);
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("does not wrap text inside fenced code block", () => {
      view = createTestEditor("```\ncode here\n```");
      setSelection(view, 5, 13);
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("does not wrap fenced code with language", () => {
      view = createTestEditor("```javascript\nconst x = 1;\n```");
      setSelection(view, 15, 26);
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });
  });

  describe("selection spanning node types", () => {
    it("does not wrap selection spanning into inline code", () => {
      view = createTestEditor("hello `code` world");
      setSelection(view, 4, 10); // "o `cod"
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("does not wrap selection spanning from bold into plain text", () => {
      view = createTestEditor("**bold** plain");
      setSelection(view, 2, 12); // "bold** pla"
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("does not wrap selection spanning from italic into plain text", () => {
      view = createTestEditor("*italic* plain");
      setSelection(view, 1, 11); // "italic* pl"
      const result = createWrapTextCommand(view, "Emphasis", "*");
      expect(result).toBe(false);
    });

    it("does not wrap selection spanning plain text into link", () => {
      view = createTestEditor("text [link](url)");
      setSelection(view, 3, 8); // "t [li"
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });
  });

  describe("allowed block contexts", () => {
    it("works inside blockquote", () => {
      view = createTestEditor("> quoted text");
      setSelection(view, 2);
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toContain("****");
    });

    it("works inside nested blockquote", () => {
      view = createTestEditor("> > nested quote");
      setSelection(view, 4);
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toContain("****");
    });

    it("works inside bullet list item", () => {
      view = createTestEditor("- list item");
      setSelection(view, 2);
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toContain("****");
    });

    it("works inside ordered list item", () => {
      view = createTestEditor("1. list item");
      setSelection(view, 3);
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toContain("****");
    });

    it("works inside task list item", () => {
      view = createTestEditor("- [ ] task item");
      setSelection(view, 6);
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toContain("****");
    });

    it("works inside completed task list item", () => {
      view = createTestEditor("- [x] done item");
      setSelection(view, 6);
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toContain("****");
    });

    it("works inside deeply nested list", () => {
      view = createTestEditor("- item\n  - nested item");
      setSelection(view, 12);
      createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(getDoc(view)).toContain("****");
    });
  });

  describe("return values", () => {
    it("returns true on successful wrap with empty selection", () => {
      view = createTestEditor("hello");
      setSelection(view, 0);
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(true);
    });

    it("returns true on successful unwrap", () => {
      view = createTestEditor("**hello**");
      setSelection(view, 2, 7);
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(true);
    });

    it("returns false when blocked by multi-line selection", () => {
      view = createTestEditor("hello\nworld");
      setSelection(view, 0, 11);
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("returns false when blocked by link restriction", () => {
      view = createTestEditor("[link](url)");
      setSelection(view, 1, 5);
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("returns false when blocked by code block restriction", () => {
      view = createTestEditor("    code block");
      setSelection(view, 4, 14);
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(false);
    });

    it("returns true for empty document insertion", () => {
      view = createTestEditor("");
      const result = createWrapTextCommand(view, "StrongEmphasis", "**");
      expect(result).toBe(true);
    });
  });
});
