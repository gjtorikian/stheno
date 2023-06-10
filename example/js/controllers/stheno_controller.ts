import { Controller } from "@hotwired/stimulus"
import { EditorView } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { getSthenoConfig, wrapText, prependLines } from "../../../src/index"

type SthenoActionParams = {
  mark: string
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
  declare readonly hasToolbarTarget: boolean
  declare readonly toolbarTarget: HTMLElement
  declare readonly toolbarTargets: HTMLElement[]

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
      state: EditorState.create(getSthenoConfig(this.langValue))
    })
  }

  wrap({ params }: { params: SthenoActionParams }): void {
    wrapText(params.mark, this.view)
    this.view.focus()
  }

  prependLine({ params }: { params: SthenoActionParams }): void {
    prependLines(params.mark, this.view)
    this.view.focus()
  }

  link(): void {
    console.log('[link-text](link-url)')
  }

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
