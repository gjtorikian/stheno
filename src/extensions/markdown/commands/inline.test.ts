import { describe, it, expect, afterEach } from "vitest";
import type { EditorView } from "@codemirror/view";
import { createTestEditor, cleanupEditor, setSelection, getDoc } from "../../../test-utils";
import { createWrapTextCommand } from "./inline";

/**
 * Note: Tests for wrapping selected text in jsdom have limitations due to
 * CodeMirror's language detection not working fully in jsdom environment.
 * The `isWithinMarkdown` check fails for plain text, causing wrap operations
 * to not execute. Use E2E tests (Playwright) for comprehensive selection-based tests.
 */
describe("createWrapTextCommand", () => {
	let view: EditorView;

	afterEach(() => {
		if (view) cleanupEditor(view);
	});

	describe("bold (**)", () => {
		it("inserts placeholder when no selection", () => {
			view = createTestEditor("hello world");
			setSelection(view, 6); // cursor between "hello " and "world"
			createWrapTextCommand(view, "StrongEmphasis", "**");
			expect(getDoc(view)).toContain("**text**");
		});

		it("inserts placeholder in empty editor", () => {
			view = createTestEditor("");
			createWrapTextCommand(view, "StrongEmphasis", "**");
			expect(getDoc(view)).toBe("**text**");
		});

		it("unwraps already bold text", () => {
			view = createTestEditor("**hello** world");
			setSelection(view, 2, 7); // select "hello" inside **
			createWrapTextCommand(view, "StrongEmphasis", "**");
			expect(getDoc(view)).toBe("hello world");
		});
	});

	describe("italic (*)", () => {
		it("inserts placeholder when no selection", () => {
			view = createTestEditor("hello world");
			setSelection(view, 0);
			createWrapTextCommand(view, "Emphasis", "*");
			expect(getDoc(view)).toContain("*text*");
		});

		it("unwraps already italic text", () => {
			view = createTestEditor("*hello* world");
			setSelection(view, 1, 6); // select "hello" inside *
			createWrapTextCommand(view, "Emphasis", "*");
			expect(getDoc(view)).toBe("hello world");
		});
	});

	describe("inline code (`)", () => {
		it("inserts placeholder when no selection", () => {
			view = createTestEditor("hello world");
			setSelection(view, 0);
			createWrapTextCommand(view, "InlineCode", "`");
			expect(getDoc(view)).toContain("`text`");
		});
	});

	describe("edge cases", () => {
		it("does not wrap multiple lines", () => {
			view = createTestEditor("hello\nworld");
			setSelection(view, 0, 11); // select both lines
			const result = createWrapTextCommand(view, "StrongEmphasis", "**");
			// Should return false for multi-line selection
			expect(result).toBe(false);
		});

		it("does not wrap text inside a link", () => {
			view = createTestEditor("[link text](http://example.com)");
			setSelection(view, 1, 10); // select "link text"
			const result = createWrapTextCommand(view, "StrongEmphasis", "**");
			expect(result).toBe(false);
		});
	});
});
