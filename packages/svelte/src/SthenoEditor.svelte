<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
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

  // Props
  export let value = "";
  export let extensions: Extension[] = [];
  export let readOnly = false;
  export let autoFocus = false;
  export let placeholder: string | undefined = undefined;
  export let systemTheme = true;
  export let darkTheme: boolean | undefined = undefined;
  export let imageConfig: { container?: string; img?: string } | null | undefined = undefined;
  export let minHeight = "100px";
  export let maxHeight: string | undefined = undefined;

  // Event handlers as props (for advanced use)
  export let onUpdate: SthenoEventHandlers["onUpdate"] = undefined;
  export let onSelectionChange: SthenoEventHandlers["onSelectionChange"] = undefined;
  export let onPaste: SthenoEventHandlers["onPaste"] = undefined;
  export let onDrop: SthenoEventHandlers["onDrop"] = undefined;
  export let onCursorChange: SthenoEventHandlers["onCursorChange"] = undefined;

  const dispatch = createEventDispatcher<{
    change: string;
    focus: FocusEvent;
    blur: FocusEvent;
    ready: EditorView;
  }>();

  let container: HTMLDivElement;
  let view: EditorView | null = null;

  // Exported methods
  export function getView(): EditorView | null {
    return view;
  }

  export function getValue(): string {
    return view?.state.doc.toString() ?? "";
  }

  export function setValue(newValue: string): void {
    if (view) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: newValue },
      });
    }
  }

  export function focus(): void {
    view?.focus();
  }

  export function insertText(text: string): void {
    if (view) {
      const pos = view.state.selection.main.head;
      view.dispatch({
        changes: { from: pos, insert: text },
        selection: { anchor: pos + text.length },
      });
    }
  }

  export function getSelection(): { from: number; to: number } {
    const range = view?.state.selection.main;
    return { from: range?.from ?? 0, to: range?.to ?? 0 };
  }

  export function setSelection(from: number, to?: number): void {
    view?.dispatch({
      selection: { anchor: from, head: to ?? from },
    });
  }

  export function executeCommand(command: (view: EditorView) => boolean): boolean {
    return view ? command(view) : false;
  }

  function buildExtensions(): Extension[] {
    const exts: Extension[] = [...sthenoConfig()];

    const eventExts = createEventExtensions({
      onChange: (newValue) => {
        value = newValue;
        dispatch("change", newValue);
      },
      onFocus: (_v, event) => dispatch("focus", event),
      onBlur: (_v, event) => dispatch("blur", event),
      onUpdate,
      onSelectionChange,
      onPaste,
      onDrop,
      onCursorChange,
    });
    exts.push(...eventExts);

    if (readOnly) {
      exts.push(EditorState.readOnly.of(true));
    }

    if (placeholder) {
      exts.push(
        EditorView.contentAttributes.of({ "aria-placeholder": placeholder })
      );
    }

    if (imageConfig !== null) {
      // Only pass imageConfig if both container and img are defined
      const config = imageConfig && imageConfig.container && imageConfig.img
        ? { container: imageConfig.container, img: imageConfig.img }
        : null;
      exts.push(images(config));
    }

    exts.push(
      EditorView.theme({
        "&.cm-editor": {
          minHeight,
          ...(maxHeight && { maxHeight, overflow: "auto" }),
        },
      })
    );

    exts.push(...extensions);

    return exts;
  }

  onMount(() => {
    view = new EditorView({
      parent: container,
      state: EditorState.create({
        doc: value,
        extensions: buildExtensions(),
      }),
    });

    dispatch("ready", view);

    if (systemTheme && darkTheme === undefined) {
      setupThemeListener(view);
    }

    if (autoFocus) {
      requestAnimationFrame(() => {
        view?.focus();
      });
    }
  });

  onDestroy(() => {
    view?.destroy();
    view = null;
  });

  // Reactive value updates
  $: if (view && value !== view.state.doc.toString()) {
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: value },
    });
  }

  // Reactive theme updates
  $: if (view && darkTheme !== undefined) {
    view.dispatch({
      effects: THEME.reconfigure(darkTheme ? yettoDark : yettoLight),
    });
    if (darkTheme) {
      document.documentElement.dataset.theme = "dark";
    } else {
      delete document.documentElement.dataset.theme;
    }
  }
</script>

<div bind:this={container} {...$$restProps} />
