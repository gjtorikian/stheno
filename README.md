# Stheno

An opinionated, powerful CodeMirror configuration by Yetto.

## Background

Historically, help desks and customer communication tools assume that you need a "rich text editor" to enable support professionals to communicate with customers and users. The thinking is that effective communication requires at least a little styling, and they're not wholly wrong.

However, they make a leap from that reality to the idea that all communication should function similarly to a "comment box" in PHPBB, and then immediately find themselves trying to make overly simple editors work in a far more complex workflow.

Slash commands, templates, linting, components, keyboard shortcuts, macros, etc all get tacked on to a simple comment box designed for _very_ basic layout tooling.

Several years ago, some developer tools decided that Markdown might be an interesting way to solve this problem -- just use plain text and let the formatting be handled by syntax. This was an amazing step forward, but it hit two primary problems:

1. People like visual feedback and the ability to know what their end user's are going to see before they comment on anything
2. Non-developer users initially react negatively to syntax-only formatting, and developers hate writing documentation and teaching new users things (I'll call this The RTFM Problem)

With that history in mind, Stheno is Yetto's way of codifying the following beliefs:

### Markup language is code

Support professionals in particular are used to fighting their input tools and have never been given the power of an IDE -- power that developers often take for granted. Markdown is the correct syntax to enable this, but treating markdown as a set of key commands instead of a programming syntax for communication itself has capped its usefulness in all other apps that support it.

Don't hide the syntax from professionals, teach them to "see the matrix" and give them visual hints _around_ the syntax. Don't hide the complexity and infantilize them, make the complexity approachable.

Let the evil orange website argue forever that "html isn't coding", they're wrong and we don't care what they think.

### Professional support communication requires more than spellcheck

A spellchecker is fine, but what about hooking up something like [alexjs](https://alexjs.com/) to catch insensitive or non-inclusive writing? What about adding [write-good](https://github.com/btford/write-good) to enforce a writing style and help your team improve how it writes? What about enabling tools like [MermaidJS](https://mermaid-js.github.io/mermaid/#/) to make graphical communication with users as simple as text? What about tables? What if you don't want any of the things I just mentioned?

In traditional Rich Text Editors and all other help desks, you might have a series of checkboxes to enable and disable things, or at best you have a "block" editor for "fancy components". In most cases they don't get that far and you expect your customers to create and upload custom images.

In a Stheno world, you expose linting. You give them strongly typed JSON objects they can add in their settings that apply either org wide or just for their specific use. Love VIM? Go ahead and use it instead of the default keybindings. Want to have a personal dictionary? Do it. Want every single help desk article title to autoinsert a link? Do it.

Just don't make me stop typing and click things.

### The editor should not be an afterthought

On average, ~50% of a support professional's day is spent communicating with users (source: my lived experience for the last decade).

The productivity and ergonomic gains made by supercharging the writing and editing experience itself is obvious, and programmers have known this forever (hence the cottage industry built around making their editor work for them).

Our belief is that if you give the same power and focus provided by IDE's to a support professional, you'll 25x their ability to get their work done.

### Markdown for communication, JSON for configuration

We've talked a lot about markdown already, but let's talk about JSON for a sec. All this power is worthless if it's not easy to configure, and we believe that JSON is a better choice than YAML for most users. As such, it's the only other supported language by Stheno. There are a few reasons for that.

1. YAML is complicated. JSON has a limited spec that an individual person can learn in less than 2 hours. Once you know the rules, you never forget them.
2. YAML is whitespace dependent. Editors should never have to deal with lint errors becauase an invisible whitespace character prevents their configuration from being saved until they learn wtf unicode is.
3. JSON is browser native. It's easy to parse, no additional tooling is necessary, and passing it around on the web is the default.
4. All JSON is valid YAML. Choosing JSON right now doesn't force us to **never** support Yaml in the future. Should we change our minds, all configuration a user has provided will still parse exactly as they have it. The same is not true in reverse.

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
