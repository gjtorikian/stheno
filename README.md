# Stheno

An opinionated, powerful CodeMirror configuration by Yetto.

## Usage

At the moment, it's early days. Stheno is ultimately going to be a highly customized State bit for use with CodeMirror. End consumers of the library will need to instantiate an `EditorView` themselves in order to consume that bit of State.

The good news there is that everything is "just codemirror" under the hood, we just take care of the complicated pieces and get out of your way for the rest.

The "bad" news is that you'll need to do a minimal amount of configuration yourself to get it mounted with whatever frontend library you prefer.

At Yetto, we use Stimulus.js to provide Stheno as part of our application, and assume that you're placing the editor in an HTML Form element.

To provide a minimal example, this is a simplified version of a real Stheno controller:

```typescript
import { Controller } from "@hotwired/stimulus"
import { EditorView } from "@codemirror/view"
import { EditorState, Transaction } from "@codemirror/state"
import { getSthenoConfig } from "@yettoapp/stheno"

// data-controller="stheno"
export default class SthenoController extends Controller {

  // data-stheno-target="editor"
  // data-stheno-target="formInput"
  static targets: string[] = ['editor', 'formInput']

  // data-stheno-lang-value="markdown | json"
  static values = {
    lang: {
      type: String,
      default: "markdown",
    }
  }

  connect() {
    this.view = new EditorView({
      parent: this.editorTarget,
      state: EditorState.create(getSthenoConfig(this.langValue))
    })
  }

  submit() {
    // Update the hidden form input with the state of the editor
    // That way normal HTML form submission mechanics will work
    // with the editor
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
```

Which allows us to have the following HTML structure for the editor:

```html
<form action="/comment"
      method="POST"
      data-controller="stheno"
      data-stheno-lang-value="markdown"
  >
    <!-- INSERT TOOLBARS OR OTHER FORM INPUTS HERE -->
    <input type="hidden" data-stheno-target="formInput" name="comment" id="comment">
    <div data-stheno-target="editor">
      <!-- Stheno will be here -->
    </div>
    <button data-action="stheno#submit">Submit</button>
  </form>
```

That way Stheno can handle all the presentation and functionality for the editor _without_ requiring you to deal with the form submission.

## Inspirations

* https://github.com/yeliex/codemirror-extensions
* https://github.com/silverbulletmd/silverbullet
