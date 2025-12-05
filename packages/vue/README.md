# @yettoapp/stheno-vue

Vue 3 components for [Stheno](https://github.com/yettoapp/stheno), an opinionated CodeMirror configuration.

## Installation

```bash
npm install @yettoapp/stheno-vue @yettoapp/stheno @codemirror/state @codemirror/view
```

## Basic Usage

```vue
<script setup>
import { ref } from "vue";
import { SthenoEditor } from "@yettoapp/stheno-vue";

const content = ref("# Hello World");
</script>

<template>
  <SthenoEditor v-model="content" @change="console.log" />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `""` | v-model binding for content |
| `extensions` | `Extension[]` | `[]` | Additional CodeMirror extensions |
| `readOnly` | `boolean` | `false` | Make the editor read-only |
| `autoFocus` | `boolean` | `false` | Focus editor on mount |
| `placeholder` | `string` | - | Placeholder text when empty |
| `systemTheme` | `boolean` | `true` | Auto-detect system dark/light mode |
| `darkTheme` | `boolean` | - | Force dark theme (overrides `systemTheme`) |
| `imageConfig` | `object \| null` | - | Custom classes for image decorations |
| `minHeight` | `string` | `"100px"` | Minimum editor height |
| `maxHeight` | `string` | - | Maximum editor height (enables scroll) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | v-model update |
| `change` | `string` | Content changed |
| `focus` | `FocusEvent` | Editor focused |
| `blur` | `FocusEvent` | Editor blurred |
| `ready` | `EditorView` | Editor initialized |

### Advanced Event Props

For fine-grained control, pass event handlers as props:

| Prop | Type | Description |
|------|------|-------------|
| `onUpdate` | `(viewUpdate: ViewUpdate) => void` | Any editor update |
| `onSelectionChange` | `(selections: SelectionRange[], viewUpdate: ViewUpdate) => void` | Selection changed |
| `onPaste` | `(event: ClipboardEvent, view: EditorView) => boolean \| void` | Paste event |
| `onDrop` | `(event: DragEvent, view: EditorView) => boolean \| void` | Drop event |
| `onCursorChange` | `(position: number, line: number, column: number) => void` | Cursor moved |

## Exposed Methods

Access the editor imperatively using a template ref:

```vue
<script setup>
import { ref } from "vue";
import { SthenoEditor } from "@yettoapp/stheno-vue";

const editorRef = ref(null);

const handleSubmit = () => {
  const content = editorRef.value?.getValue();
  console.log(content);
  editorRef.value?.setValue("");
};
</script>

<template>
  <SthenoEditor ref="editorRef" />
  <button @click="handleSubmit">Submit</button>
</template>
```

### Exposed API

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `view` | `EditorView \| null` | The CodeMirror EditorView instance |
| `getValue()` | `() => string` | Get current content |
| `setValue(value)` | `(value: string) => void` | Set content |
| `focus()` | `() => void` | Focus the editor |
| `insertText(text)` | `(text: string) => void` | Insert text at cursor |
| `getSelection()` | `() => { from: number; to: number }` | Get selection range |
| `setSelection(from, to?)` | `(from: number, to?: number) => void` | Set selection |
| `executeCommand(cmd)` | `(cmd: (view: EditorView) => boolean) => boolean` | Execute a CodeMirror command |

## Toolbar Composable

Use `useStheno` to create toolbar buttons with formatting commands:

```vue
<script setup>
import { SthenoEditor, useStheno } from "@yettoapp/stheno-vue";

const {
  editorRef,
  bold,
  italic,
  code,
  strikethrough,
  link,
  bulletList,
  orderedList,
  taskList,
  quote,
  codeBlock,
  horizontalRule,
  toggleTheme,
} = useStheno();
</script>

<template>
  <div>
    <div class="toolbar">
      <button @click="bold">Bold</button>
      <button @click="italic">Italic</button>
      <button @click="code">Code</button>
      <button @click="strikethrough">Strikethrough</button>
      <button @click="link">Link</button>
      <button @click="bulletList">Bullet List</button>
      <button @click="orderedList">Numbered List</button>
      <button @click="taskList">Task List</button>
      <button @click="quote">Quote</button>
      <button @click="codeBlock">Code Block</button>
      <button @click="horizontalRule">Horizontal Rule</button>
      <button @click="toggleTheme">Toggle Theme</button>
    </div>
    <SthenoEditor @ready="(view) => (editorRef = view)" />
  </div>
</template>
```

## Customization

### Themes

```vue
<!-- Auto-detect system theme (default) -->
<SthenoEditor :system-theme="true" />

<!-- Force dark theme -->
<SthenoEditor :dark-theme="true" />

<!-- Force light theme -->
<SthenoEditor :dark-theme="false" />

<!-- Reactive theme control -->
<script setup>
const isDark = ref(false);
</script>
<template>
  <SthenoEditor :dark-theme="isDark" />
  <button @click="isDark = !isDark">Toggle Theme</button>
</template>
```

### Image Decorations

Stheno renders inline image previews. Customize with CSS classes:

```vue
<SthenoEditor
  :image-config="{
    container: 'my-image-container',
    img: 'my-image',
  }"
/>

<!-- Disable image previews -->
<SthenoEditor :image-config="null" />
```

### Custom Extensions

Add any CodeMirror extension:

```vue
<script setup>
import { lineNumbers } from "@codemirror/view";
import { history } from "@codemirror/commands";

const extensions = [lineNumbers(), history()];
</script>

<template>
  <SthenoEditor :extensions="extensions" />
</template>
```

### CSS Variables

Override theme colors with CSS variables:

```css
:root {
  --stheno-keyword-color: #d73a49;
  --stheno-string-color: #032f62;
  --stheno-comment-color: #6a737d;
}

[data-theme="dark"] {
  --stheno-keyword-color: #f97583;
  --stheno-string-color: #9ecbff;
  --stheno-comment-color: #959da5;
}
```

## File Upload Example

Handle paste and drop events for file uploads:

```vue
<script setup>
import { SthenoEditor } from "@yettoapp/stheno-vue";

async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", { method: "POST", body: formData });
  const { url } = await response.json();
  return url;
}

const handlePaste = async (event, view) => {
  const files = event.clipboardData?.files;
  if (files?.length) {
    event.preventDefault();
    const url = await uploadFile(files[0]);
    const pos = view.state.selection.main.head;
    view.dispatch({
      changes: { from: pos, insert: `![uploaded image](${url})` },
    });
    return true;
  }
};

const handleDrop = async (event, view) => {
  const files = event.dataTransfer?.files;
  if (files?.length) {
    event.preventDefault();
    const url = await uploadFile(files[0]);
    const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
    if (pos !== null) {
      view.dispatch({
        changes: { from: pos, insert: `![uploaded image](${url})` },
      });
    }
    return true;
  }
};
</script>

<template>
  <SthenoEditor :on-paste="handlePaste" :on-drop="handleDrop" />
</template>
```

## Two-Way Binding

Use `v-model` for seamless two-way data binding:

```vue
<script setup>
import { ref, watch } from "vue";
import { SthenoEditor } from "@yettoapp/stheno-vue";

const content = ref("# Hello World");

// React to external changes
watch(content, (newValue) => {
  console.log("Content updated:", newValue);
});

// Programmatically update content
function clearEditor() {
  content.value = "";
}
</script>

<template>
  <SthenoEditor v-model="content" />
  <button @click="clearEditor">Clear</button>
  <pre>{{ content }}</pre>
</template>
```

## TypeScript

Full TypeScript support is included. Import types as needed:

```vue
<script setup lang="ts">
import type { SthenoEditorProps, SthenoEditorExpose } from "@yettoapp/stheno-vue";
import type { EditorView } from "@codemirror/view";

const editorRef = ref<SthenoEditorExpose | null>(null);

const handleReady = (view: EditorView) => {
  console.log("Editor ready", view);
};
</script>
```
