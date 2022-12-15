import { Controller } from "@hotwired/stimulus"
import { EditorView } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { SthenoConfig } from "../../../src/index"

// Types
import type { ValueDefinitionMap } from "@hotwired/stimulus/dist/types/core/value_properties"

// data-controller="stheno"
export default class extends Controller {
  /**
   * Class properties
   */
  // The CodeMirror EditorView that will be used by the system
  view: EditorView

  /**
   * Targets
   */
  // data-stheno-target="editor"
  static targets: string[] = ["editor"]

  // Provided by Stimulus
  declare readonly hasEditorTarget: boolean
  declare readonly editorTargets: HTMLDivElement[]
  declare readonly editorTarget: HTMLDivElement

  /**
   * Values
   */
  // data-stheno-submit-url-value="/submit-msg"
  static values: ValueDefinitionMap = {
    url: String
  }

  // Provided by Stimulus
  declare readonly hasUrlValue: boolean
  declare urlValue: string

  /**
   * Lifecycle methods
   */
  connect(): void {
    this.view = new EditorView({
      parent: this.editorTarget,
      state: EditorState.create(SthenoConfig)
    })
  }

  /**
   * Actions
   */

  // data-action="stheno#submit:prevent"
  submit(event) {
    console.log(event)
    console.log(this.view.state.doc.toString())
  }
}
