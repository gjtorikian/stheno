/*
 * A minimal example of how to consume Stheno
 */

// Minimal imports required by the consumer of the library / config
import { EditorView } from "@codemirror/view"
import { EditorState } from "@codemirror/state"

// The actual configuration object that will be exported
import { SthenoConfig } from "../src/index"

// Grab the Element you'd like to apply stheno to
let parent = document.getElementById("editor")

// Make Typescript happy (getElementById could technically be null)
if (parent === null) {
  parent = document.body
}

// Create a codemirror EditorState with our pre-configured setup
let state = EditorState.create(SthenoConfig)

// Create a new EditorView using our EditorState and attach it to the DOM
let view = new EditorView({
  state,
  parent,
})
