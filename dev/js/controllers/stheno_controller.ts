import { Controller } from "@hotwired/stimulus"
import { EditorView } from "@codemirror/view"
import { EditorState, Transaction } from "@codemirror/state"
import { getSthenoConfig, wrapText, prependLines, toggleTheme } from "../../../src/index"
import { images } from "../../../src/index"

interface SthenoEventObject extends Event {
  params: {
    mark?: string
    ordered?: boolean
  }
}

// data-controller="stheno"
export default class extends Controller<HTMLFormElement> {
  // The CodeMirror EditorView that will be used by the system
  view: EditorView

  // data-stheno-target="editor"
  // data-stheno-target="formInput"
  // data-stheno-target="toolbar"
  static targets: string[] = ['editor', 'formInput', 'toolbar']
  declare readonly hasEditorTarget: boolean
  declare readonly editorTargets: HTMLDivElement[]
  declare readonly editorTarget: HTMLDivElement
  declare readonly hasFormInputTarget: boolean
  declare readonly formInputTarget: HTMLInputElement
  declare readonly formInputTargets: HTMLInputElement[]

  // data-stheno-value="/submit-msg"
  // data-stheno-lang-value="json"
  static values = {
    action: String,
    lang: {
      type: String,
      default: "markdown",
    }
  }
  declare readonly hasActionValue: boolean
  declare actionValue: string
  declare langValue: string

  connect(): void {
    this.view = new EditorView({
      parent: this.editorTarget,
      state: EditorState.create(getSthenoConfig(this.langValue,
        images({
          container: "flex justify-center items-center shadow-inner bg-neutral-200 p-4 my-2",
          img: "object-scale-down h-72"
        }),
        EditorView.domEventHandlers({
          dragenter(event, view) {
            event.preventDefault()
          },
          drop(event) {
            event.preventDefault()
            console.log(event)
            console.table(event.dataTransfer)
          },
          paste(event: ClipboardEvent) {
            console.log(event)
            console.log('why?', event.clipboardData?.items)
            console.log(event.clipboardData?.files)
            if (event.clipboardData?.items) {
              event.preventDefault()
              console.log("Paste had files, skipping normal work")
            } else {
              console.log("normal paste event")
            }
          }
        })
      ))
    })
  }

  wrap({ params }: SthenoEventObject): void {
    if (!params.mark) return
    wrapText(params.mark, this.view)
    this.view.focus()
  }

  prependLine({ params }: SthenoEventObject): void {
    if (!params.mark) return

    if (params.ordered) {
      prependLines(params.mark, this.view, params.ordered)
    } else {
      prependLines(params.mark, this.view)
    }
    this.view.focus()
  }

  switchTheme() {
    toggleTheme(this.view)
    this.view.focus()
  }

  link(): void { }

  image(): void {
    console.log('![image-alt-text](image-url)')
  }

  mention(): void {
    console.log('@mention')
  }

  submit(event: Event) {
    // Update the hidden form input with the state of the editor
    this.formInputTarget.value = this.view.state.doc.toString()
    console.log(this.view.state.doc.toString())
    // Dispatch a transaction to clear the editor
    this.view.dispatch({
      changes: [{
        from: 0,
        to: this.view.state.doc.length,
        insert: ""
      }]
    })
  }
}
