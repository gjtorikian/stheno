import { Controller } from "@hotwired/stimulus"
import { EditorView } from "@codemirror/view"
import { EditorState, Transaction } from "@codemirror/state"
import { getSthenoConfig, wrapText, prependLines, toggleTheme } from "../../../src/index"
import { snippet } from "@codemirror/autocomplete"

interface SthenoEventObject extends Event {
  params: {
    mark?: string
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
      state: EditorState.create(getSthenoConfig(this.langValue))
    })
  }

  wrap({ params }: SthenoEventObject): void {
    if (!params.mark) return
    wrapText(params.mark, this.view)
    this.view.focus()
  }

  prependLine({ params }: SthenoEventObject): void {
    if (!params.mark) return
    prependLines(params.mark, this.view)
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
