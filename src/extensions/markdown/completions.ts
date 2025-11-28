import {
  Completion,
  CompletionContext,
  snippet,
} from "@codemirror/autocomplete";

const options: Completion[] = [
  {
    apply: snippet("![${1:alt_text}](${2:url})\n\n${3}"),
    detail: "An inline image",
    label: "/image",
    section: "Markdown",
    type: "text",
  },
  {
    apply: snippet("[${1:link_text}](${2:url}) ${3}"),
    detail: "A link to some other place",
    label: "/link",
    section: "Markdown",
    type: "text",
  },
  {
    apply: snippet("```${1:language}\n${2:code}\n```"),
    detail: "A block of code or other preformatted text",
    label: "/codeBlock",
    section: "Markdown",
    type: "text",
  },
];

export function markdownCompletions(context: CompletionContext) {
  const word = context.matchBefore(/\/\w*/);

  if (!word) return;

  if (word.from == word.to && !context.explicit) return null;

  return {
    from: word.from,
    options,
  };
}
