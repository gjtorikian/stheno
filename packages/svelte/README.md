# @yettoapp/stheno-svelte

Svelte components for [Stheno](https://github.com/yettoapp/stheno), an opinionated CodeMirror configuration.

## Installation

```bash
npm install @yettoapp/stheno-svelte @yettoapp/stheno @codemirror/state @codemirror/view
```

## Basic Usage

```svelte
<script>
  import { SthenoEditor } from "@yettoapp/stheno-svelte";

  let content = "# Hello World";
</script>

<SthenoEditor bind:value={content} on:change={(e) => console.log(e.detail)} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | Content value (supports `bind:value`) |
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

| Event | Detail | Description |
|-------|--------|-------------|
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

## Exported Functions

Access the editor imperatively using `bind:this`:

```svelte
<script>
  import { SthenoEditor } from "@yettoapp/stheno-svelte";

  let editor;

  function handleSubmit() {
    const content = editor.getValue();
    console.log(content);
    editor.setValue("");
  }
</script>

<SthenoEditor bind:this={editor} />
<button on:click={handleSubmit}>Submit</button>
```

### Exported API

| Function | Type | Description |
|----------|------|-------------|
| `getView()` | `() => EditorView \| null` | Get the CodeMirror EditorView instance |
| `getValue()` | `() => string` | Get current content |
| `setValue(value)` | `(value: string) => void` | Set content |
| `focus()` | `() => void` | Focus the editor |
| `insertText(text)` | `(text: string) => void` | Insert text at cursor |
| `getSelection()` | `() => { from: number; to: number }` | Get selection range |
| `setSelection(from, to?)` | `(from: number, to?: number) => void` | Set selection |
| `executeCommand(cmd)` | `(cmd: (view: EditorView) => boolean) => boolean` | Execute a CodeMirror command |

## Toolbar Store

Use `createSthenoStore` to create toolbar buttons with formatting commands:

```svelte
<script>
  import { SthenoEditor, createSthenoStore } from "@yettoapp/stheno-svelte";

  const store = createSthenoStore();
  const {
    view,
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
  } = store;
</script>

<div>
  <div class="toolbar">
    <button on:click={bold}>Bold</button>
    <button on:click={italic}>Italic</button>
    <button on:click={code}>Code</button>
    <button on:click={strikethrough}>Strikethrough</button>
    <button on:click={link}>Link</button>
    <button on:click={bulletList}>Bullet List</button>
    <button on:click={orderedList}>Numbered List</button>
    <button on:click={taskList}>Task List</button>
    <button on:click={quote}>Quote</button>
    <button on:click={codeBlock}>Code Block</button>
    <button on:click={horizontalRule}>Horizontal Rule</button>
    <button on:click={toggleTheme}>Toggle Theme</button>
  </div>
  <SthenoEditor on:ready={(e) => ($view = e.detail)} />
</div>
```

## Customization

### Themes

```svelte
<!-- Auto-detect system theme (default) -->
<SthenoEditor systemTheme={true} />

<!-- Force dark theme -->
<SthenoEditor darkTheme={true} />

<!-- Force light theme -->
<SthenoEditor darkTheme={false} />

<!-- Reactive theme control -->
<script>
  let isDark = false;
</script>

<SthenoEditor darkTheme={isDark} />
<button on:click={() => (isDark = !isDark)}>Toggle Theme</button>
```

### Image Decorations

Stheno renders inline image previews. Customize with CSS classes:

```svelte
<SthenoEditor
  imageConfig={{
    container: "my-image-container",
    img: "my-image",
  }}
/>

<!-- Disable image previews -->
<SthenoEditor imageConfig={null} />
```

### Custom Extensions

Add any CodeMirror extension:

```svelte
<script>
  import { lineNumbers } from "@codemirror/view";
  import { history } from "@codemirror/commands";

  const extensions = [lineNumbers(), history()];
</script>

<SthenoEditor {extensions} />
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

### Pass-through Attributes

Additional attributes are passed to the container div:

```svelte
<SthenoEditor class="my-editor" data-testid="editor" />
```

## File Upload Example

Handle paste and drop events for file uploads:

```svelte
<script>
  import { SthenoEditor } from "@yettoapp/stheno-svelte";

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const { url } = await response.json();
    return url;
  }

  async function handlePaste(event, view) {
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
  }

  async function handleDrop(event, view) {
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
  }
</script>

<SthenoEditor onPaste={handlePaste} onDrop={handleDrop} />
```

## Two-Way Binding

Use `bind:value` for seamless two-way data binding:

```svelte
<script>
  import { SthenoEditor } from "@yettoapp/stheno-svelte";

  let content = "# Hello World";

  // React to changes
  $: console.log("Content updated:", content);

  // Programmatically update content
  function clearEditor() {
    content = "";
  }
</script>

<SthenoEditor bind:value={content} />
<button on:click={clearEditor}>Clear</button>
<pre>{content}</pre>
```

## TypeScript

Full TypeScript support is included. Use `lang="ts"` in your script tag:

```svelte
<script lang="ts">
  import { SthenoEditor, createSthenoStore, type SthenoStore } from "@yettoapp/stheno-svelte";
  import type { EditorView } from "@codemirror/view";

  let editor: SthenoEditor;
  const store: SthenoStore = createSthenoStore();

  function handleReady(event: CustomEvent<EditorView>) {
    console.log("Editor ready", event.detail);
  }
</script>

<SthenoEditor bind:this={editor} on:ready={handleReady} />
```
