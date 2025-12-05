import { ref, shallowRef, type Ref, type ShallowRef } from "vue";
import type { EditorView } from "@codemirror/view";

import {
  createWrapTextCommand,
  createMultiLineCommand,
  createLeafBlockCommand,
  toggleTheme,
  setDarkTheme,
  setLightTheme,
} from "@yettoapp/stheno";

export interface UseSthenoReturn {
  /** Ref to the EditorView - connect via @ready event */
  editorRef: ShallowRef<EditorView | null>;
  /** Current content value */
  value: Ref<string>;
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
 * Composable providing toolbar commands and editor utilities for Stheno.
 *
 * @example
 * ```vue
 * <script setup>
 * import { SthenoEditor, useStheno } from '@yettoapp/stheno-vue';
 *
 * const { editorRef, bold, italic, code, toggleTheme } = useStheno();
 * </script>
 *
 * <template>
 *   <div>
 *     <div class="toolbar">
 *       <button @click="bold">Bold</button>
 *       <button @click="italic">Italic</button>
 *       <button @click="code">Code</button>
 *       <button @click="toggleTheme">Toggle Theme</button>
 *     </div>
 *     <SthenoEditor @ready="(view) => editorRef = view" />
 *   </div>
 * </template>
 * ```
 */
export function useStheno(): UseSthenoReturn {
  const editorRef = shallowRef<EditorView | null>(null);
  const value = ref("");

  const getView = () => editorRef.value;

  const setValue = (newValue: string) => {
    value.value = newValue;
    const view = getView();
    if (view) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: newValue },
      });
    }
  };

  const wrapCommand = (nodeName: string, mark: string) => {
    const view = getView();
    if (view) {
      createWrapTextCommand(view, nodeName, mark);
      view.focus();
    }
  };

  const blockCommand = (type: string) => {
    const view = getView();
    if (view) {
      createMultiLineCommand(view, type);
      view.focus();
    }
  };

  const leafBlockCommand = (mark: string) => {
    const view = getView();
    if (view) {
      createLeafBlockCommand(view, mark);
      view.focus();
    }
  };

  return {
    editorRef,
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
      const view = getView();
      if (view) toggleTheme(view);
    },

    setDarkTheme: () => {
      const view = getView();
      if (view) setDarkTheme(view);
    },

    setLightTheme: () => {
      const view = getView();
      if (view) setLightTheme(view);
    },

    // Utilities
    focus: () => getView()?.focus(),

    insertText: (text: string) => {
      const view = getView();
      if (view) {
        const pos = view.state.selection.main.head;
        view.dispatch({
          changes: { from: pos, insert: text },
          selection: { anchor: pos + text.length },
        });
      }
    },
  };
}
