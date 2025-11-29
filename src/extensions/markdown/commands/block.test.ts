import { describe, it, expect, afterEach } from "vitest";
import { EditorView } from "@codemirror/view";
import { createTestEditor, cleanupEditor, setSelection, getDoc } from "../../../test-utils";
import { createPrependLinesCommand } from "./block";

describe("createPrependLinesCommand", () => {
	let view: EditorView;

	afterEach(() => {
		if (view) cleanupEditor(view);
	});

	describe("unordered list", () => {
		it("prepends * to line", () => {
			view = createTestEditor("item one");
			setSelection(view, 0);
			createPrependLinesCommand(view, "unorderedList");
			expect(getDoc(view)).toBe("* item one");
		});

		it("removes * from already listed line (toggle)", () => {
			view = createTestEditor("* item one");
			setSelection(view, 2);
			createPrependLinesCommand(view, "unorderedList");
			expect(getDoc(view)).toBe("item one");
		});

		it("handles multiple lines", () => {
			view = createTestEditor("one\ntwo\nthree");
			setSelection(view, 0, 13);
			createPrependLinesCommand(view, "unorderedList");
			expect(getDoc(view)).toBe("* one\n* two\n* three");
		});

		it("inserts placeholder in empty editor", () => {
			view = createTestEditor("");
			createPrependLinesCommand(view, "unorderedList");
			expect(getDoc(view)).toBe("* Item");
		});
	});

	describe("ordered list", () => {
		it("prepends 1. to line", () => {
			view = createTestEditor("first item");
			setSelection(view, 0);
			createPrependLinesCommand(view, "orderedList");
			expect(getDoc(view)).toBe("1. first item");
		});

		it("removes numbering from already numbered line (toggle)", () => {
			view = createTestEditor("1. first item");
			setSelection(view, 3);
			createPrependLinesCommand(view, "orderedList");
			expect(getDoc(view)).toBe("first item");
		});

		it("numbers multiple selected lines sequentially", () => {
			view = createTestEditor("one\ntwo\nthree");
			setSelection(view, 0, 13);
			createPrependLinesCommand(view, "orderedList");
			expect(getDoc(view)).toBe("1. one\n2. two\n3. three");
		});

		it("inserts placeholder in empty editor", () => {
			view = createTestEditor("");
			createPrependLinesCommand(view, "orderedList");
			expect(getDoc(view)).toBe("1. Item");
		});
	});

	describe("quote", () => {
		it("prepends > to line", () => {
			view = createTestEditor("quoted text");
			setSelection(view, 0);
			createPrependLinesCommand(view, "quote");
			expect(getDoc(view)).toBe("> quoted text");
		});

		it("removes > from already quoted line (toggle)", () => {
			view = createTestEditor("> quoted text");
			setSelection(view, 2);
			createPrependLinesCommand(view, "quote");
			expect(getDoc(view)).toBe("quoted text");
		});

		it("handles multiple lines", () => {
			view = createTestEditor("line one\nline two");
			setSelection(view, 0, 17);
			createPrependLinesCommand(view, "quote");
			expect(getDoc(view)).toBe("> line one\n> line two");
		});

		it("inserts placeholder in empty editor", () => {
			view = createTestEditor("");
			createPrependLinesCommand(view, "quote");
			expect(getDoc(view)).toBe("> Item");
		});
	});

	describe("task list", () => {
		it("prepends - [ ] to line", () => {
			view = createTestEditor("task item");
			setSelection(view, 0);
			createPrependLinesCommand(view, "taskList");
			expect(getDoc(view)).toBe("- [ ] task item");
		});

		it("inserts placeholder in empty editor", () => {
			view = createTestEditor("");
			createPrependLinesCommand(view, "taskList");
			expect(getDoc(view)).toBe("- [ ] Item");
		});
	});

	describe("edge cases", () => {
		it("preserves leading whitespace when prepending", () => {
			// Note: The implementation preserves indentation
			view = createTestEditor("  indented text");
			setSelection(view, 0);
			createPrependLinesCommand(view, "unorderedList");
			expect(getDoc(view)).toBe("*   indented text");
		});

		it("returns true on successful command", () => {
			view = createTestEditor("some text");
			setSelection(view, 0);
			const result = createPrependLinesCommand(view, "unorderedList");
			expect(result).toBe(true);
		});
	});
});
