import { marked } from "marked";

import { html } from "@codemirror/lang-html";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { Controller } from "@hotwired/stimulus";

import { createMultiLineCommand, createWrapTextCommand, getSthenoConfig, images } from "../../../src/index";
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
  static targets: string[] = ["editor", "output", "rendered", "toolbar"];
  declare readonly hasEditorTarget: boolean;
  declare readonly editorTargets: HTMLDivElement[];
  declare readonly editorTarget: HTMLDivElement;
  declare readonly hasOutputTarget: boolean;
  declare readonly outputTarget: HTMLDivElement;
  declare readonly hasRenderedTarget: boolean;
  declare readonly renderedTarget: HTMLDivElement;

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

  mention(): void {
    console.log("@mention");
  }

  wrap({ params }: SthenoEventObject): void {
    if (!params.mark) return;
    const nodeNameMap: Record<string, string> = {
      "**": "StrongEmphasis",
      "*": "Emphasis",
      "_": "Emphasis",
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
}
