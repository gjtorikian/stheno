<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted, watch } from "vue";
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
  /** v-model value */
  modelValue?: string;
  /** Additional CodeMirror extensions */
  extensions?: Extension[];
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
}

export interface SthenoEditorExpose {
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

const props = withDefaults(defineProps<SthenoEditorProps>(), {
  modelValue: "",
  extensions: () => [],
  readOnly: false,
  autoFocus: false,
  systemTheme: true,
  minHeight: "100px",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  ready: [view: EditorView];
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const viewRef = shallowRef<EditorView | null>(null);

const buildExtensions = (): Extension[] => {
  const exts: Extension[] = [...sthenoConfig()];

  // Event handlers bridging to Vue events
  const eventExts = createEventExtensions({
    onChange: (value) => {
      emit("update:modelValue", value);
      emit("change", value);
    },
    onFocus: (_view, event) => emit("focus", event),
    onBlur: (_view, event) => emit("blur", event),
    onUpdate: props.onUpdate,
    onSelectionChange: props.onSelectionChange,
    onPaste: props.onPaste,
    onDrop: props.onDrop,
    onCursorChange: props.onCursorChange,
  });
  exts.push(...eventExts);

  if (props.readOnly) {
    exts.push(EditorState.readOnly.of(true));
  }

  if (props.placeholder) {
    exts.push(
      EditorView.contentAttributes.of({ "aria-placeholder": props.placeholder })
    );
  }

  if (props.imageConfig !== null) {
    // Only pass imageConfig if both container and img are defined
    const config = props.imageConfig && props.imageConfig.container && props.imageConfig.img
      ? { container: props.imageConfig.container, img: props.imageConfig.img }
      : null;
    exts.push(images(config));
  }

  exts.push(
    EditorView.theme({
      "&.cm-editor": {
        minHeight: props.minHeight,
        ...(props.maxHeight && { maxHeight: props.maxHeight, overflow: "auto" }),
      },
    })
  );

  exts.push(...props.extensions);

  return exts;
};

onMounted(() => {
  if (!containerRef.value) return;

  const view = new EditorView({
    parent: containerRef.value,
    state: EditorState.create({
      doc: props.modelValue,
      extensions: buildExtensions(),
    }),
  });

  viewRef.value = view;
  emit("ready", view);

  if (props.systemTheme && props.darkTheme === undefined) {
    setupThemeListener(view);
  }

  if (props.autoFocus) {
    requestAnimationFrame(() => {
      view.focus();
    });
  }
});

onUnmounted(() => {
  viewRef.value?.destroy();
  viewRef.value = null;
});

// Watch for v-model changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (viewRef.value) {
      const currentValue = viewRef.value.state.doc.toString();
      if (newValue !== currentValue) {
        viewRef.value.dispatch({
          changes: {
            from: 0,
            to: viewRef.value.state.doc.length,
            insert: newValue,
          },
        });
      }
    }
  }
);

// Watch for theme changes
watch(
  () => props.darkTheme,
  (isDark) => {
    if (isDark !== undefined && viewRef.value) {
      viewRef.value.dispatch({
        effects: THEME.reconfigure(isDark ? yettoDark : yettoLight),
      });
      if (isDark) {
        document.documentElement.dataset.theme = "dark";
      } else {
        delete document.documentElement.dataset.theme;
      }
    }
  }
);

// Expose API
defineExpose<SthenoEditorExpose>({
  get view() { return viewRef.value; },
  getValue: () => viewRef.value?.state.doc.toString() ?? "",
  setValue: (value: string) => {
    viewRef.value?.dispatch({
      changes: { from: 0, to: viewRef.value.state.doc.length, insert: value },
    });
  },
  focus: () => viewRef.value?.focus(),
  insertText: (text: string) => {
    const view = viewRef.value;
    if (view) {
      const pos = view.state.selection.main.head;
      view.dispatch({
        changes: { from: pos, insert: text },
        selection: { anchor: pos + text.length },
      });
    }
  },
  getSelection: () => {
    const range = viewRef.value?.state.selection.main;
    return { from: range?.from ?? 0, to: range?.to ?? 0 };
  },
  setSelection: (from: number, to?: number) => {
    viewRef.value?.dispatch({
      selection: { anchor: from, head: to ?? from },
    });
  },
  executeCommand: (command) => {
    return viewRef.value ? command(viewRef.value) : false;
  },
});
</script>

<template>
  <div ref="containerRef" />
</template>
