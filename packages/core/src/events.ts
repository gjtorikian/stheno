import type { Extension } from "@codemirror/state";
import type { EditorView, ViewUpdate } from "@codemirror/view";
import { EditorView as EV } from "@codemirror/view";

/**
 * Selection range information
 */
export interface SelectionRange {
  from: number;
  to: number;
  empty: boolean;
}

/**
 * Event handlers for Stheno editor
 */
export interface SthenoEventHandlers {
  /** Called when document content changes */
  onChange?: (value: string, viewUpdate: ViewUpdate) => void;
  /** Called on any editor update (changes, selection, focus, etc.) */
  onUpdate?: (viewUpdate: ViewUpdate) => void;
  /** Called when selection changes */
  onSelectionChange?: (
    selections: SelectionRange[],
    viewUpdate: ViewUpdate
  ) => void;
  /** Called when editor gains focus */
  onFocus?: (view: EditorView, event: FocusEvent) => void;
  /** Called when editor loses focus */
  onBlur?: (view: EditorView, event: FocusEvent) => void;
  /** Called when cursor position changes */
  onCursorChange?: (position: number, line: number, column: number) => void;
  /** Called on paste events - return true to prevent default handling */
  onPaste?: (event: ClipboardEvent, view: EditorView) => boolean | void;
  /** Called on drop events - return true to prevent default handling */
  onDrop?: (event: DragEvent, view: EditorView) => boolean | void;
}

/**
 * Creates CodeMirror extensions for event handling.
 * Use this to add event listeners to your editor configuration.
 *
 * @example
 * ```typescript
 * const extensions = [
 *   ...sthenoConfig(),
 *   ...createEventExtensions({
 *     onChange: (value) => console.log('Content:', value),
 *     onPaste: (event, view) => {
 *       const files = event.clipboardData?.files;
 *       if (files?.length) {
 *         handleFileUpload(files, view);
 *         return true; // Prevent default paste
 *       }
 *     },
 *   }),
 * ];
 * ```
 */
export function createEventExtensions(
  handlers: SthenoEventHandlers
): Extension[] {
  const extensions: Extension[] = [];

  // Update listener for content and selection changes
  if (
    handlers.onChange ||
    handlers.onUpdate ||
    handlers.onSelectionChange ||
    handlers.onCursorChange
  ) {
    extensions.push(
      EV.updateListener.of((update: ViewUpdate) => {
        // Always call onUpdate if provided
        handlers.onUpdate?.(update);

        // Call onChange only when document changes
        if (update.docChanged && handlers.onChange) {
          handlers.onChange(update.state.doc.toString(), update);
        }

        // Call onSelectionChange when selection changes
        if (update.selectionSet && handlers.onSelectionChange) {
          const selections = update.state.selection.ranges.map((r) => ({
            from: r.from,
            to: r.to,
            empty: r.empty,
          }));
          handlers.onSelectionChange(selections, update);
        }

        // Call onCursorChange when cursor moves
        if (
          (update.selectionSet || update.docChanged) &&
          handlers.onCursorChange
        ) {
          const pos = update.state.selection.main.head;
          const line = update.state.doc.lineAt(pos);
          handlers.onCursorChange(pos, line.number, pos - line.from);
        }
      })
    );
  }

  // DOM event handlers for focus, blur, paste, drop
  if (
    handlers.onFocus ||
    handlers.onBlur ||
    handlers.onPaste ||
    handlers.onDrop
  ) {
    extensions.push(
      EV.domEventHandlers({
        focus: handlers.onFocus
          ? (event, view) => {
              handlers.onFocus!(view, event);
              return false; // Don't prevent default focus behavior
            }
          : undefined,
        blur: handlers.onBlur
          ? (event, view) => {
              handlers.onBlur!(view, event);
              return false; // Don't prevent default blur behavior
            }
          : undefined,
        paste: handlers.onPaste
          ? (event, view) => {
              return handlers.onPaste!(event, view) ?? false;
            }
          : undefined,
        drop: handlers.onDrop
          ? (event, view) => {
              return handlers.onDrop!(event, view) ?? false;
            }
          : undefined,
      })
    );
  }

  return extensions;
}

// Re-export types from CodeMirror for convenience
export type { ViewUpdate } from "@codemirror/view";
