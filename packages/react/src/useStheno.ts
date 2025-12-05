import { useCallback, useRef } from "react";
import type { EditorView } from "@codemirror/view";

import {
  createWrapTextCommand,
  createMultiLineCommand,
  createLeafBlockCommand,
  toggleTheme,
  setDarkTheme,
  setLightTheme,
} from "@yettoapp/stheno";

export interface UseSthenoOptions {
  /** Optional callback when content changes */
  onChange?: (value: string) => void;
}

export interface UseSthenoReturn {
  /** Ref to attach to SthenoEditor */
  editorRef: React.MutableRefObject<EditorView | null>;
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
  /** Get current editor content */
  getValue: () => string;
  /** Set editor content */
  setValue: (value: string) => void;
}

/**
 * Hook providing toolbar commands and editor utilities for Stheno.
 *
 * @example
 * ```tsx
 * function Editor() {
 *   const { editorRef, bold, italic, code, toggleTheme } = useStheno();
 *
 *   return (
 *     <div>
 *       <div className="toolbar">
 *         <button onClick={bold}>Bold</button>
 *         <button onClick={italic}>Italic</button>
 *         <button onClick={code}>Code</button>
 *         <button onClick={toggleTheme}>Toggle Theme</button>
 *       </div>
 *       <SthenoEditor
 *         ref={(ref) => { editorRef.current = ref?.view ?? null; }}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useStheno(_options: UseSthenoOptions = {}): UseSthenoReturn {
  const editorRef = useRef<EditorView | null>(null);

  const getView = useCallback(() => editorRef.current, []);

  const wrapCommand = useCallback(
    (nodeName: string, mark: string) => {
      const view = getView();
      if (view) {
        createWrapTextCommand(view, nodeName, mark);
        view.focus();
      }
    },
    [getView]
  );

  const blockCommand = useCallback(
    (type: string) => {
      const view = getView();
      if (view) {
        createMultiLineCommand(view, type);
        view.focus();
      }
    },
    [getView]
  );

  const leafBlockCommand = useCallback(
    (mark: string) => {
      const view = getView();
      if (view) {
        createLeafBlockCommand(view, mark);
        view.focus();
      }
    },
    [getView]
  );

  return {
    editorRef,

    // Inline formatting
    bold: useCallback(() => wrapCommand("StrongEmphasis", "**"), [wrapCommand]),
    italic: useCallback(() => wrapCommand("Emphasis", "*"), [wrapCommand]),
    code: useCallback(() => wrapCommand("InlineCode", "`"), [wrapCommand]),
    strikethrough: useCallback(
      () => wrapCommand("Strikethrough", "~~"),
      [wrapCommand]
    ),
    link: useCallback(() => wrapCommand("Link", "["), [wrapCommand]),

    // Block formatting
    bulletList: useCallback(
      () => blockCommand("unorderedList"),
      [blockCommand]
    ),
    orderedList: useCallback(() => blockCommand("orderedList"), [blockCommand]),
    taskList: useCallback(() => blockCommand("taskList"), [blockCommand]),
    quote: useCallback(() => blockCommand("quote"), [blockCommand]),

    // Leaf blocks
    codeBlock: useCallback(() => leafBlockCommand("```"), [leafBlockCommand]),
    horizontalRule: useCallback(
      () => leafBlockCommand("---"),
      [leafBlockCommand]
    ),

    // Theme commands
    toggleTheme: useCallback(() => {
      const view = getView();
      if (view) toggleTheme(view);
    }, [getView]),

    setDarkTheme: useCallback(() => {
      const view = getView();
      if (view) setDarkTheme(view);
    }, [getView]),

    setLightTheme: useCallback(() => {
      const view = getView();
      if (view) setLightTheme(view);
    }, [getView]),

    // Utilities
    focus: useCallback(() => getView()?.focus(), [getView]),

    insertText: useCallback(
      (text: string) => {
        const view = getView();
        if (view) {
          const pos = view.state.selection.main.head;
          view.dispatch({
            changes: { from: pos, insert: text },
            selection: { anchor: pos + text.length },
          });
        }
      },
      [getView]
    ),

    getValue: useCallback(
      () => getView()?.state.doc.toString() ?? "",
      [getView]
    ),

    setValue: useCallback(
      (value: string) => {
        const view = getView();
        if (view) {
          view.dispatch({
            changes: { from: 0, to: view.state.doc.length, insert: value },
          });
        }
      },
      [getView]
    ),
  };
}
