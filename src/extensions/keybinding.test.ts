import { describe, it, expect, afterEach } from "vitest";
import { EditorView } from "@codemirror/view";
import { createTestEditor, cleanupEditor, setSelection, getDoc } from "../test-utils";
import {
	BoldText,
	ItalicText,
	CodeText,
	QuoteBlock,
	OrderedList,
	BulletedList,
	TaskList,
} from "./markdown/commands/index";

describe("keyboard shortcuts", () => {
	let view: EditorView;

	afterEach(() => {
		if (view) cleanupEditor(view);
	});

	describe("keybinding configuration", () => {
		it("BoldText has correct key bindings", () => {
			expect(BoldText.key).toBe("Ctrl-b");
			expect(BoldText.mac).toBe("Cmd-b");
			expect(BoldText.preventDefault).toBe(true);
		});

		it("ItalicText has correct key bindings", () => {
			expect(ItalicText.key).toBe("Ctrl-i");
			expect(ItalicText.mac).toBe("Cmd-i");
		});

		it("CodeText has correct key bindings", () => {
			expect(CodeText.key).toBe("Ctrl-e");
			expect(CodeText.mac).toBe("Cmd-e");
		});

		it("QuoteBlock has correct key bindings", () => {
			expect(QuoteBlock.key).toBe("Ctrl-Shift-.");
			expect(QuoteBlock.mac).toBe("Cmd-Shift-.");
		});

		it("OrderedList has correct key bindings", () => {
			expect(OrderedList.key).toBe("Ctrl-Shift-7");
			expect(OrderedList.mac).toBe("Cmd-Shift-7");
		});

		it("BulletedList has correct key bindings", () => {
			expect(BulletedList.key).toBe("Ctrl-Shift-8");
			expect(BulletedList.mac).toBe("Cmd-Shift-8");
		});

		it("TaskList has correct key bindings", () => {
			expect(TaskList.key).toBe("Ctrl-Shift-l");
			expect(TaskList.mac).toBe("Meta-Shift-l");
		});
	});

	/**
	 * Note: Inline commands (Bold, Italic, Code) with selection don't work in jsdom
	 * due to CodeMirror language detection limitations. Use E2E tests for these.
	 * Block commands (Quote, Lists) work correctly.
	 */
	describe("keybinding commands execute correctly", () => {
		it("QuoteBlock.run prepends > to line", () => {
			view = createTestEditor("hello world");
			setSelection(view, 0);
			const result = QuoteBlock.run!(view);
			expect(result).toBe(true);
			expect(getDoc(view)).toBe("> hello world");
		});

		it("OrderedList.run prepends 1. to line", () => {
			view = createTestEditor("hello world");
			setSelection(view, 0);
			const result = OrderedList.run!(view);
			expect(result).toBe(true);
			expect(getDoc(view)).toBe("1. hello world");
		});

		it("BulletedList.run prepends * to line", () => {
			view = createTestEditor("hello world");
			setSelection(view, 0);
			const result = BulletedList.run!(view);
			expect(result).toBe(true);
			expect(getDoc(view)).toBe("* hello world");
		});

		it("TaskList.run prepends - [ ] to line", () => {
			view = createTestEditor("hello world");
			setSelection(view, 0);
			const result = TaskList.run!(view);
			expect(result).toBe(true);
			expect(getDoc(view)).toBe("- [ ] hello world");
		});
	});

	describe("toggle behavior", () => {
		it("BoldText toggles off bold text", () => {
			view = createTestEditor("**hello** world");
			setSelection(view, 2, 7); // select "hello" inside **
			BoldText.run!(view);
			expect(getDoc(view)).toBe("hello world");
		});

		it("ItalicText toggles off italic text", () => {
			view = createTestEditor("_hello_ world");
			setSelection(view, 1, 6); // select "hello" inside _
			ItalicText.run!(view);
			expect(getDoc(view)).toBe("hello world");
		});

		it("QuoteBlock toggles off quoted line", () => {
			view = createTestEditor("> hello world");
			setSelection(view, 2);
			QuoteBlock.run!(view);
			expect(getDoc(view)).toBe("hello world");
		});

		it("BulletedList toggles off bulleted line", () => {
			view = createTestEditor("* hello world");
			setSelection(view, 2);
			BulletedList.run!(view);
			expect(getDoc(view)).toBe("hello world");
		});

		it("OrderedList toggles off numbered line", () => {
			view = createTestEditor("1. hello world");
			setSelection(view, 3);
			OrderedList.run!(view);
			expect(getDoc(view)).toBe("hello world");
		});
	});
});
