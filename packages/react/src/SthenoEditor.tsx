import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { Extension } from "@codemirror/state";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import {
  sthenoConfig,
  setupThemeListener,
  createEventExtensions,
  images,
  THEME,
  yettoDark,
  yettoLight,
  type SthenoEventHandlers,
} from "@yettoapp/stheno";

export interface SthenoEditorProps extends SthenoEventHandlers {
  /** Initial content of the editor (uncontrolled mode) */
  defaultValue?: string;
  /** Controlled value - use with onChange for controlled mode */
  value?: string;
  /** Additional CodeMirror extensions */
  extensions?: Extension[];
  /** CSS class name for the container */
  className?: string;
  /** Inline styles for the container */
  style?: React.CSSProperties;
  /** Whether the editor is read-only */
  readOnly?: boolean;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Enable system theme detection (default: true) */
  systemTheme?: boolean;
  /** Force dark theme (overrides systemTheme) */
  darkTheme?: boolean;
  /** Image decoration configuration (pass null to disable) */
  imageConfig?: { container?: string; img?: string } | null;
  /** Minimum height of the editor */
  minHeight?: string;
  /** Maximum height of the editor */
  maxHeight?: string;
  /** Called when editor is ready */
  onReady?: (view: EditorView) => void;
}

export interface SthenoEditorRef {
  /** The CodeMirror EditorView instance */
  view: EditorView | null;
  /** Get current editor content */
  getValue: () => string;
  /** Set editor content */
  setValue: (value: string) => void;
  /** Focus the editor */
  focus: () => void;
  /** Insert text at current cursor position */
  insertText: (text: string) => void;
  /** Get current selection range */
  getSelection: () => { from: number; to: number };
  /** Set selection */
  setSelection: (from: number, to?: number) => void;
  /** Execute a CodeMirror command */
  executeCommand: (command: (view: EditorView) => boolean) => boolean;
}

export const SthenoEditor = forwardRef<SthenoEditorRef, SthenoEditorProps>(
  (
    {
      defaultValue = "",
      value,
      extensions = [],
      className,
      style,
      readOnly = false,
      autoFocus = false,
      placeholder,
      systemTheme = true,
      darkTheme,
      imageConfig,
      minHeight = "100px",
      maxHeight,
      onChange,
      onUpdate,
      onSelectionChange,
      onFocus,
      onBlur,
      onPaste,
      onDrop,
      onCursorChange,
      onReady,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Track previous value for controlled mode
    const prevValueRef = useRef<string | undefined>(value);

    // Build extensions array
    const buildExtensions = (): Extension[] => {
      const exts: Extension[] = [...sthenoConfig()];

      // Event handlers
      const eventExts = createEventExtensions({
        onChange,
        onUpdate,
        onSelectionChange,
        onFocus,
        onBlur,
        onPaste,
        onDrop,
        onCursorChange,
      });
      exts.push(...eventExts);

      // Read-only mode
      if (readOnly) {
        exts.push(EditorState.readOnly.of(true));
      }

      // Placeholder
      if (placeholder) {
        exts.push(
          EditorView.contentAttributes.of({ "aria-placeholder": placeholder })
        );
      }

      // Images (enabled by default, pass null to disable)
      if (imageConfig !== null) {
        // Only pass imageConfig if both container and img are defined
        const config = imageConfig && imageConfig.container && imageConfig.img
          ? { container: imageConfig.container, img: imageConfig.img }
          : null;
        exts.push(images(config));
      }

      // Height constraints
      exts.push(
        EditorView.theme({
          "&.cm-editor": {
            minHeight,
            ...(maxHeight && { maxHeight, overflow: "auto" }),
          },
        })
      );

      // User extensions (added last to allow overrides)
      exts.push(...extensions);

      return exts;
    };

    // Initialize editor
    useEffect(() => {
      if (!containerRef.current) return;

      const view = new EditorView({
        parent: containerRef.current,
        state: EditorState.create({
          doc: value ?? defaultValue,
          extensions: buildExtensions(),
        }),
      });

      viewRef.current = view;
      setIsReady(true);
      onReady?.(view);

      // System theme listener
      if (systemTheme && darkTheme === undefined) {
        setupThemeListener(view);
      }

      // Auto-focus
      if (autoFocus) {
        requestAnimationFrame(() => {
          view.focus();
        });
      }

      return () => {
        view.destroy();
        viewRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle controlled value changes
    useEffect(() => {
      if (value !== undefined && viewRef.current && value !== prevValueRef.current) {
        const currentValue = viewRef.current.state.doc.toString();
        if (value !== currentValue) {
          viewRef.current.dispatch({
            changes: {
              from: 0,
              to: viewRef.current.state.doc.length,
              insert: value,
            },
          });
        }
        prevValueRef.current = value;
      }
    }, [value]);

    // Handle theme changes
    useEffect(() => {
      if (darkTheme !== undefined && viewRef.current) {
        viewRef.current.dispatch({
          effects: THEME.reconfigure(darkTheme ? yettoDark : yettoLight),
        });
        if (darkTheme) {
          document.documentElement.dataset.theme = "dark";
        } else {
          delete document.documentElement.dataset.theme;
        }
      }
    }, [darkTheme]);

    // Expose imperative API
    useImperativeHandle(
      ref,
      () => ({
        view: viewRef.current,
        getValue: () => viewRef.current?.state.doc.toString() ?? "",
        setValue: (newValue: string) => {
          viewRef.current?.dispatch({
            changes: {
              from: 0,
              to: viewRef.current.state.doc.length,
              insert: newValue,
            },
          });
        },
        focus: () => viewRef.current?.focus(),
        insertText: (text: string) => {
          const view = viewRef.current;
          if (view) {
            const pos = view.state.selection.main.head;
            view.dispatch({
              changes: { from: pos, insert: text },
              selection: { anchor: pos + text.length },
            });
          }
        },
        getSelection: () => {
          const range = viewRef.current?.state.selection.main;
          return { from: range?.from ?? 0, to: range?.to ?? 0 };
        },
        setSelection: (from: number, to?: number) => {
          viewRef.current?.dispatch({
            selection: { anchor: from, head: to ?? from },
          });
        },
        executeCommand: (command) => {
          return viewRef.current ? command(viewRef.current) : false;
        },
      }),
      [isReady]
    );

    return <div ref={containerRef} className={className} style={style} />;
  }
);

SthenoEditor.displayName = "SthenoEditor";
