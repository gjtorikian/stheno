import { Completion, CompletionContext, snippet } from "@codemirror/autocomplete"

const options: Completion[] = [
  {
    label: "/image",
    type: "text",
    apply: snippet("![${1:alt_text}](${2:url})\n\n${3}"),
    detail: "An inline image",
    section: "Markdown"
  },
  {
    label: "/link",
    type: "text",
    apply: snippet("[${1:link_text}](${2:url}) ${3}"),
    detail: "A link to some other place",
    section: "Markdown"
  },
  {
    label: "/codeBlock",
    type: "text",
    apply: snippet("```${1:language}\n${2:code}\n```"),
    detail: "A block of code or other preformatted text",
    section: "Markdown"
  },
]

export function markdownCompletions(context: CompletionContext) {
  let word = context.matchBefore(/\/\w*/)

  if (!word) return

  if (word.from == word.to && !context.explicit)
    return null

  return {
    from: word.from,
    options,
  }
}
