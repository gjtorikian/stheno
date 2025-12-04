import { html } from "@codemirror/lang-html";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { Controller } from "@hotwired/stimulus";
import { marked } from "marked";

import {
  createMultiLineCommand,
  createWrapTextCommand,
  getSthenoConfig,
  images,
  setupThemeListener,
} from "../../../src/index";
import { toggleTheme } from "../../../src/themes/index";

interface SthenoEventObject {
  params: {
    mark?: string;
    blockType?: string;
    ordered?: boolean;
  };
}

// data-controller="stheno"
export default class extends Controller<HTMLDivElement> {
  // The CodeMirror EditorView that will be used by the system
  view: EditorView;
  // The CodeMirror EditorView for HTML output display
  outputView: EditorView;

  // data-stheno-target="editor"
  // data-stheno-target="output"
  // data-stheno-target="rendered"
  // data-stheno-target="toolbar"
  // data-stheno-target="tab"
  static targets: string[] = ["editor", "output", "rendered", "toolbar", "tab"];
  declare readonly hasEditorTarget: boolean;
  declare readonly editorTargets: HTMLDivElement[];
  declare readonly editorTarget: HTMLDivElement;
  declare readonly hasOutputTarget: boolean;
  declare readonly outputTarget: HTMLDivElement;
  declare readonly hasRenderedTarget: boolean;
  declare readonly renderedTarget: HTMLDivElement;
  declare readonly tabTargets: HTMLButtonElement[];

  // data-stheno-value="/submit-msg"
  // data-stheno-lang-value="json"
  static values = {
    action: String,
    lang: {
      type: String,
      default: "markdown",
    },
  };
  declare readonly hasActionValue: boolean;
  declare actionValue: string;
  declare langValue: string;

  connect(): void {
    this.view = new EditorView({
      parent: this.editorTarget,
      state: EditorState.create(
        getSthenoConfig(
          this.langValue,
          images({
            container: "flex justify-center items-center shadow-inner bg-neutral-200 p-4 my-2",
            img: "object-scale-down h-72",
          }),
          EditorView.domEventHandlers({
            dragenter(event, view) {
              event.preventDefault();
            },
            drop(event) {
              event.preventDefault();
              console.log(event);
              console.table(event.dataTransfer);
            },
            paste(event: ClipboardEvent) {
              console.log(event);
              console.log("why?", event.clipboardData?.items);
              console.log(event.clipboardData?.files);
              if (event.clipboardData?.items) {
                event.preventDefault();
                console.log("Paste had files, skipping normal work");
              } else {
                console.log("normal paste event");
              }
            },
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              this.updateOutput();
            }
          }),
        ),
      ),
    });

    // Create read-only HTML output viewer
    this.outputView = new EditorView({
      parent: this.outputTarget,
      state: EditorState.create({
        doc: "",
        extensions: [
          html(),
          syntaxHighlighting(defaultHighlightStyle),
          EditorState.readOnly.of(true),
        ],
      }),
    });

    // Set up system theme listener for automatic dark/light mode switching
    setupThemeListener(this.view);
  }

  updateOutput(): void {
    const markdown = this.view.state.doc.toString();
    const htmlOutput = marked.parse(markdown, { async: false }) as string;

    // Update rendered HTML preview
    this.renderedTarget.innerHTML = htmlOutput;

    // Update raw HTML code view
    this.outputView.dispatch({
      changes: {
        from: 0,
        to: this.outputView.state.doc.length,
        insert: htmlOutput,
      },
    });
  }

  switchTheme() {
    toggleTheme(this.view);
    this.view.focus();
  }

  link(): void {}

  image(): void {
    console.log("![image-alt-text](image-url)");
  }

  kitchenSink(): void {
    const content = `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

This is **bold text** and this is *italic text*.

This is ~~strikethrough~~ text and \`inline code\`.

[Link to the project](https://github.com/gjtorikian/stheno)!

> This is a blockquote
> with _multiple_ lines
>
> Inline **works** here too.

- Unordered list item 1
- Unordered list item 2
- Unordered list item 3

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

- [ ] Unchecked task item
- [x] Demonstrate horizontal rule tag
- [ ] Another task

---

\`\`\`ruby
def hello_world
  puts "Hello, World!"
end
\`\`\`

![Sample Image](https://via.placeholder.com/150)
`;

    this.view.dispatch({
      changes: {
        from: 0,
        to: this.view.state.doc.length,
        insert: content,
      },
    });
    this.updateOutput();
    this.view.focus();
  }

  mention(): void {
    console.log("@mention");
  }

  wrap({ params }: SthenoEventObject): void {
    if (!params.mark) return;
    const nodeNameMap: Record<string, string> = {
      "**": "StrongEmphasis",
      "*": "Emphasis",
      _: "Emphasis",
      "`": "InlineCode",
      "~~": "Strikethrough",
      "[": "Link",
    };
    createWrapTextCommand(this.view, nodeNameMap[params.mark] || "StrongEmphasis", params.mark);
    this.view.focus();
  }

  prependLine({ params }: SthenoEventObject): void {
    const type = params.blockType || (params.ordered ? "orderedList" : "unorderedList");
    createMultiLineCommand(this.view, type);
    this.view.focus();
  }

  switchTab(event: Event): void {
    const clickedTab = event.currentTarget as HTMLButtonElement;
    const tabName = clickedTab.dataset.tab;

    // Update tab styles
    for (const tab of this.tabTargets) {
      if (tab.dataset.tab === tabName) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    }

    // Toggle content visibility
    if (tabName === "rendered") {
      this.renderedTarget.classList.remove("hidden");
      this.outputTarget.classList.add("hidden");
    } else {
      this.renderedTarget.classList.add("hidden");
      this.outputTarget.classList.remove("hidden");
    }
  }
}
