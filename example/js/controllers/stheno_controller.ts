import { Controller } from "@hotwired/stimulus"
import { EditorView } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { SthenoConfig } from "../../../src/index"

// data-controller="stheno"
export default class extends Controller<HTMLFormElement> {
  // The CodeMirror EditorView that will be used by the system
  view: EditorView

  // data-rich-text-area-target="editor"
  // data-rith-text-area-target="formInput"
  static targets: string[] = ['editor', 'formInput']
  declare readonly hasEditorTarget: boolean
  declare readonly editorTargets: HTMLDivElement[]
  declare readonly editorTarget: HTMLDivElement
  declare readonly hasFormInputTarget: boolean
  declare readonly formInputTarget: HTMLInputElement
  declare readonly formInputTargets: HTMLInputElement[]

  // data-rich-text-area-action-value="/submit-msg"
  static values = {
    action: String
  }
  declare readonly hasUrlValue: boolean
  declare urlValue: string

  connect(): void {
    this.view = new EditorView({
      parent: this.editorTarget,
      state: EditorState.create(SthenoConfig)
    })
  }

  submit(event: Event) {
    // Update the hidden form input with the state of the editor
    this.formInputTarget.value = this.view.state.doc.toString()

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
