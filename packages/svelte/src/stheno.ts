import { writable, type Writable } from "svelte/store";
import type { EditorView } from "@codemirror/view";

import {
  createWrapTextCommand,
  createMultiLineCommand,
  createLeafBlockCommand,
  toggleTheme,
  setDarkTheme,
  setLightTheme,
} from "@yettoapp/stheno";

export interface SthenoStore {
  /** Writable store for the EditorView */
  view: Writable<EditorView | null>;
  /** Writable store for the content value */
  value: Writable<string>;
  /** Set editor content */
  setValue: (value: string) => void;
  /** Format selection as bold */
  bold: () => void;
  /** Format selection as italic */
  italic: () => void;
  /** Format selection as inline code */
  code: () => void;
  /** Format selection as strikethrough */
  strikethrough: () => void;
  /** Format selection as link */
  link: () => void;
  /** Convert lines to bullet list */
  bulletList: () => void;
  /** Convert lines to numbered list */
  orderedList: () => void;
  /** Convert lines to task list */
  taskList: () => void;
  /** Convert lines to blockquote */
  quote: () => void;
  /** Insert a fenced code block */
  codeBlock: () => void;
  /** Insert a horizontal rule */
  horizontalRule: () => void;
  /** Toggle between light and dark theme */
  toggleTheme: () => void;
  /** Set dark theme */
  setDarkTheme: () => void;
  /** Set light theme */
  setLightTheme: () => void;
  /** Focus the editor */
  focus: () => void;
  /** Insert text at cursor position */
  insertText: (text: string) => void;
}

/**
 * Creates a Stheno store with toolbar commands and editor utilities.
 *
 * @example
 * ```svelte
 * <script>
 *   import { SthenoEditor, createSthenoStore } from '@yettoapp/stheno-svelte';
 *
 *   const store = createSthenoStore();
 *   const { view, bold, italic, code, toggleTheme } = store;
 * </script>
 *
 * <div>
 *   <div class="toolbar">
 *     <button on:click={bold}>Bold</button>
 *     <button on:click={italic}>Italic</button>
 *     <button on:click={code}>Code</button>
 *     <button on:click={toggleTheme}>Toggle Theme</button>
 *   </div>
 *   <SthenoEditor on:ready={(e) => $view = e.detail} />
 * </div>
 * ```
 */
export function createSthenoStore(): SthenoStore {
  const view = writable<EditorView | null>(null);
  const value = writable("");

  let currentView: EditorView | null = null;
  view.subscribe((v) => (currentView = v));

  const getView = () => currentView;

  const setValue = (newValue: string) => {
    value.set(newValue);
    const v = getView();
    if (v) {
      v.dispatch({
        changes: { from: 0, to: v.state.doc.length, insert: newValue },
      });
    }
  };

  const wrapCommand = (nodeName: string, mark: string) => {
    const v = getView();
    if (v) {
      createWrapTextCommand(v, nodeName, mark);
      v.focus();
    }
  };

  const blockCommand = (type: string) => {
    const v = getView();
    if (v) {
      createMultiLineCommand(v, type);
      v.focus();
    }
  };

  const leafBlockCommand = (mark: string) => {
    const v = getView();
    if (v) {
      createLeafBlockCommand(v, mark);
      v.focus();
    }
  };

  return {
    view,
    value,
    setValue,

    // Inline formatting
    bold: () => wrapCommand("StrongEmphasis", "**"),
    italic: () => wrapCommand("Emphasis", "*"),
    code: () => wrapCommand("InlineCode", "`"),
    strikethrough: () => wrapCommand("Strikethrough", "~~"),
    link: () => wrapCommand("Link", "["),

    // Block formatting
    bulletList: () => blockCommand("unorderedList"),
    orderedList: () => blockCommand("orderedList"),
    taskList: () => blockCommand("taskList"),
    quote: () => blockCommand("quote"),

    // Leaf blocks
    codeBlock: () => leafBlockCommand("```"),
    horizontalRule: () => leafBlockCommand("---"),

    // Theme commands
    toggleTheme: () => {
      const v = getView();
      if (v) toggleTheme(v);
    },

    setDarkTheme: () => {
      const v = getView();
      if (v) setDarkTheme(v);
    },

    setLightTheme: () => {
      const v = getView();
      if (v) setLightTheme(v);
    },

    // Utilities
    focus: () => getView()?.focus(),

    insertText: (text: string) => {
      const v = getView();
      if (v) {
        const pos = v.state.selection.main.head;
        v.dispatch({
          changes: { from: pos, insert: text },
          selection: { anchor: pos + text.length },
        });
      }
    },
  };
}
