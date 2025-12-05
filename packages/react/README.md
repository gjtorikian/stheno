# @yettoapp/stheno-react

React components for [Stheno](https://github.com/yettoapp/stheno), an opinionated CodeMirror configuration.

## Installation

```bash
npm install @yettoapp/stheno-react @yettoapp/stheno @codemirror/state @codemirror/view
```

## Basic Usage

```tsx
import { SthenoEditor } from "@yettoapp/stheno-react";

function App() {
  return (
    <SthenoEditor
      defaultValue="# Hello World"
      onChange={(value) => console.log(value)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | `""` | Initial content (uncontrolled mode) |
| `value` | `string` | - | Controlled value (use with `onChange`) |
| `extensions` | `Extension[]` | `[]` | Additional CodeMirror extensions |
| `className` | `string` | - | CSS class for the container |
| `style` | `CSSProperties` | - | Inline styles for the container |
| `readOnly` | `boolean` | `false` | Make the editor read-only |
| `autoFocus` | `boolean` | `false` | Focus editor on mount |
| `placeholder` | `string` | - | Placeholder text when empty |
| `systemTheme` | `boolean` | `true` | Auto-detect system dark/light mode |
| `darkTheme` | `boolean` | - | Force dark theme (overrides `systemTheme`) |
| `imageConfig` | `object \| null` | - | Custom classes for image decorations |
| `minHeight` | `string` | `"100px"` | Minimum editor height |
| `maxHeight` | `string` | - | Maximum editor height (enables scroll) |

## Events

| Event | Type | Description |
|-------|------|-------------|
| `onChange` | `(value: string, viewUpdate: ViewUpdate) => void` | Content changed |
| `onUpdate` | `(viewUpdate: ViewUpdate) => void` | Any editor update |
| `onSelectionChange` | `(selections: SelectionRange[], viewUpdate: ViewUpdate) => void` | Selection changed |
| `onFocus` | `(view: EditorView, event: FocusEvent) => void` | Editor focused |
| `onBlur` | `(view: EditorView, event: FocusEvent) => void` | Editor blurred |
| `onPaste` | `(event: ClipboardEvent, view: EditorView) => boolean \| void` | Paste event (return `true` to prevent default) |
| `onDrop` | `(event: DragEvent, view: EditorView) => boolean \| void` | Drop event (return `true` to prevent default) |
| `onCursorChange` | `(position: number, line: number, column: number) => void` | Cursor position changed |
| `onReady` | `(view: EditorView) => void` | Editor initialized |

## Ref API

Access the editor imperatively using a ref:

```tsx
import { useRef } from "react";
import { SthenoEditor, type SthenoEditorRef } from "@yettoapp/stheno-react";

function App() {
  const editorRef = useRef<SthenoEditorRef>(null);

  const handleSubmit = () => {
    const content = editorRef.current?.getValue();
    console.log(content);
    editorRef.current?.setValue("");
  };

  return (
    <>
      <SthenoEditor ref={editorRef} />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
```

### Ref Methods

| Method | Type | Description |
|--------|------|-------------|
| `view` | `EditorView \| null` | The CodeMirror EditorView instance |
| `getValue()` | `() => string` | Get current content |
| `setValue(value)` | `(value: string) => void` | Set content |
| `focus()` | `() => void` | Focus the editor |
| `insertText(text)` | `(text: string) => void` | Insert text at cursor |
| `getSelection()` | `() => { from: number; to: number }` | Get selection range |
| `setSelection(from, to?)` | `(from: number, to?: number) => void` | Set selection |
| `executeCommand(cmd)` | `(cmd: (view: EditorView) => boolean) => boolean` | Execute a CodeMirror command |

## Toolbar Hook

Use `useStheno` to create toolbar buttons with formatting commands:

```tsx
import { SthenoEditor, useStheno } from "@yettoapp/stheno-react";

function Editor() {
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

  return (
    <div>
      <div className="toolbar">
        <button onClick={bold}>Bold</button>
        <button onClick={italic}>Italic</button>
        <button onClick={code}>Code</button>
        <button onClick={strikethrough}>Strikethrough</button>
        <button onClick={link}>Link</button>
        <button onClick={bulletList}>Bullet List</button>
        <button onClick={orderedList}>Numbered List</button>
        <button onClick={taskList}>Task List</button>
        <button onClick={quote}>Quote</button>
        <button onClick={codeBlock}>Code Block</button>
        <button onClick={horizontalRule}>Horizontal Rule</button>
        <button onClick={toggleTheme}>Toggle Theme</button>
      </div>
      <SthenoEditor
        ref={(ref) => {
          editorRef.current = ref?.view ?? null;
        }}
      />
    </div>
  );
}
```

## Customization

### Themes

```tsx
// Auto-detect system theme (default)
<SthenoEditor systemTheme={true} />

// Force dark theme
<SthenoEditor darkTheme={true} />

// Force light theme
<SthenoEditor darkTheme={false} />

// Programmatic theme control
const { toggleTheme, setDarkTheme, setLightTheme } = useStheno();
```

### Image Decorations

Stheno renders inline image previews. Customize with CSS classes:

```tsx
<SthenoEditor
  imageConfig={{
    container: "my-image-container",
    img: "my-image",
  }}
/>

// Disable image previews
<SthenoEditor imageConfig={null} />
```

### Custom Extensions

Add any CodeMirror extension:

```tsx
import { lineNumbers } from "@codemirror/view";
import { history } from "@codemirror/commands";

<SthenoEditor
  extensions={[
    lineNumbers(),
    history(),
  ]}
/>
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

```tsx
import { SthenoEditor } from "@yettoapp/stheno-react";

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", { method: "POST", body: formData });
  const { url } = await response.json();
  return url;
}

function Editor() {
  const handlePaste = async (event: ClipboardEvent, view: EditorView) => {
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

  const handleDrop = async (event: DragEvent, view: EditorView) => {
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

  return (
    <SthenoEditor
      onPaste={handlePaste}
      onDrop={handleDrop}
    />
  );
}
```

## Controlled vs Uncontrolled

### Uncontrolled (recommended for most cases)

```tsx
<SthenoEditor
  defaultValue="# Initial content"
  onChange={(value) => saveToDatabase(value)}
/>
```

### Controlled

```tsx
const [content, setContent] = useState("# Hello");

<SthenoEditor
  value={content}
  onChange={(value) => setContent(value)}
/>
```

## TypeScript

Full TypeScript support is included. Import types as needed:

```tsx
import type {
  SthenoEditorProps,
  SthenoEditorRef,
  UseSthenoReturn,
} from "@yettoapp/stheno-react";
```
