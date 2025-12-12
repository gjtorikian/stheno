import { useMemo, useState } from "react";
import { SthenoEditor } from "@yettoapp/stheno-react";
import { useStheno } from "@yettoapp/stheno-react";
import { marked } from "marked";
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("html", xml);

// Simple browser-compatible frontmatter parser
function parseFrontmatter(content: string): {
  data: Record<string, string>;
  content: string;
} {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content };
  }

  const yamlContent = match[1];
  const bodyContent = match[2];

  // Simple YAML key: value parser
  const data: Record<string, string> = {};
  for (const line of yamlContent.split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  }

  return { data, content: bodyContent };
}

const DEMO_CONTENT = `---
title: Welcome to Stheno
author: You
---

# Getting Started

Stheno is an **opinionated**, powerful CodeMirror configuration. Try editing this markdown!

## Features to Explore

Here are some things you can try:

- **Bold text** with \`Cmd/Ctrl + B\`
- *Italic text* with \`Cmd/Ctrl + I\`
- \`Inline code\` with \`Cmd/Ctrl + E\`
- ~~Strikethrough~~ text
- [Links](https://github.com/gjtorikian/stheno) with \`Cmd/Ctrl + K\`

### Lists

1. Ordered lists
2. With automatic numbering
3. Just keep typing!

- Bullet points
- Are also supported
- Try converting with the toolbar

### Code Blocks

\`\`\`javascript
const editor = new SthenoEditor({
  value: "Hello, Stheno!",
  systemTheme: true,
});
\`\`\`

---

*Use the toolbar above or keyboard shortcuts to format your text.*
`;

// Toolbar button component
function ToolbarButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="toolbar-btn"
      title={title}
    >
      {children}
    </button>
  );
}

export default function InteractiveEditor() {
  const {
    editorRef,
    bold,
    italic,
    code,
    strikethrough,
    link,
    bulletList,
    orderedList,
    quote,
    codeBlock,
  } = useStheno();
  const [value, setValue] = useState(DEMO_CONTENT);
  const [activeTab, setActiveTab] = useState<"rendered" | "html">("rendered");

  // Parse frontmatter and content
  const { frontmatter, htmlOutput, highlightedHtml } = useMemo(() => {
    const parsed = parseFrontmatter(value);
    const html = marked.parse(parsed.content, { async: false }) as string;
    const highlighted = hljs.highlight(html, { language: "html" }).value;
    return {
      frontmatter: parsed.data,
      htmlOutput: html,
      highlightedHtml: highlighted,
    };
  }, [value]);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Left Panel: Editor */}
      <div className="flex-1 min-w-0">
        <div className="rounded-lg border-2 border-[var(--border-color)] overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 bg-[var(--toolbar-bg)] border-b border-[var(--border-color)]">
            <ToolbarButton onClick={bold} title="Bold (Cmd+B)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M4 2h4.5a3.501 3.501 0 0 1 2.852 5.53A3.499 3.499 0 0 1 9.5 14H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm1 7v3h4.5a1.5 1.5 0 0 0 0-3Zm3.5-2a1.5 1.5 0 0 0 0-3H5v3Z" />
              </svg>
            </ToolbarButton>
            <ToolbarButton onClick={italic} title="Italic (Cmd+I)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M6 2.75A.75.75 0 0 1 6.75 2h6.5a.75.75 0 0 1 0 1.5h-2.505l-3.858 9H9.25a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h2.505l3.858-9H6.75A.75.75 0 0 1 6 2.75Z" />
              </svg>
            </ToolbarButton>
            <ToolbarButton onClick={code} title="Inline Code (Cmd+E)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </ToolbarButton>
            <ToolbarButton onClick={strikethrough} title="Strikethrough">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M11.055 8.5c.524.536.815 1.257.811 2.007a3.133 3.133 0 0 1-1.12 2.408C9.948 13.597 8.748 14 7.096 14c-1.706 0-3.104-.607-3.902-1.377a.751.751 0 0 1 1.042-1.079c.48.463 1.487.956 2.86.956 1.422 0 2.232-.346 2.676-.726.435-.372.594-.839.594-1.267 0-.472-.208-.857-.647-1.197-.448-.346-1.116-.623-1.951-.81H1.75a.75.75 0 0 1 0-1.5h12.5a.75.75 0 0 1 0 1.5ZM7.581 3.25c-2.036 0-2.778 1.082-2.778 1.786 0 .055.002.107.006.157a.75.75 0 0 1-1.496.114 3.506 3.506 0 0 1-.01-.271c0-1.832 1.75-3.286 4.278-3.286 1.418 0 2.721.58 3.514 1.093a.75.75 0 1 1-.814 1.26c-.64-.414-1.662-.853-2.7-.853Z" />
              </svg>
            </ToolbarButton>
            <ToolbarButton onClick={link} title="Link (Cmd+K)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z" />
              </svg>
            </ToolbarButton>

            <div className="w-px h-6 bg-[var(--border-color)] mx-1 self-center" />

            <ToolbarButton onClick={bulletList} title="Bullet List">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M5.75 2.5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5Zm0 5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5Zm0 5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5ZM2 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-6a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM2 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
              </svg>
            </ToolbarButton>
            <ToolbarButton onClick={orderedList} title="Numbered List">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M5 3.25a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 3.25Zm0 5a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 8.25Zm0 5a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1-.75-.75ZM.924 10.32a.5.5 0 0 1-.851-.525l.001-.001.001-.002.002-.004.007-.011c.097-.144.215-.273.348-.384.228-.19.588-.392 1.068-.392.468 0 .858.181 1.126.484.259.294.377.673.377 1.038 0 .987-.686 1.495-1.156 1.845l-.047.035c-.303.225-.522.4-.654.597h1.357a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5c0-1.005.692-1.52 1.167-1.875l.035-.025c.531-.396.8-.625.8-1.078a.57.57 0 0 0-.128-.376C1.806 10.068 1.695 10 1.5 10a.658.658 0 0 0-.429.163.835.835 0 0 0-.144.153ZM2.003 2.5V6h.503a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1h.503V3.308l-.28.14a.5.5 0 0 1-.446-.895l1.003-.5a.5.5 0 0 1 .723.447Z" />
              </svg>
            </ToolbarButton>
            <ToolbarButton onClick={quote} title="Quote">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M1.75 2.5h10.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Zm4 5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5Zm0 5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5ZM2.5 7.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 1.5 0Z" />
              </svg>
            </ToolbarButton>
            <ToolbarButton onClick={codeBlock} title="Code Block">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M16 13.25A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75ZM1.75 2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h.94l4.26-6.39a.75.75 0 0 1 1.24-.01l4.31 6.4h1.75a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25ZM5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
            </ToolbarButton>
          </div>

          {/* Editor */}
          <div className="h-[400px] overflow-auto">
            <SthenoEditor
              ref={(ref) => {
                editorRef.current = ref?.view ?? null;
              }}
              value={value}
              onChange={setValue}
              systemTheme={true}
            />
          </div>
        </div>
      </div>

      {/* Right Panel: Tabbed Output */}
      <div className="flex-1 min-w-0">
        <div className="rounded-lg border-2 border-[var(--border-color)] overflow-hidden">
          {/* Tab Bar */}
          <div className="flex items-center gap-1 p-2 bg-[var(--toolbar-bg)] border-b border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => setActiveTab("rendered")}
              className={`tab-btn px-3 py-1.5 text-sm font-semibold rounded ${
                activeTab === "rendered" ? "active" : ""
              }`}
            >
              Rendered
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("html")}
              className={`tab-btn px-3 py-1.5 text-sm font-semibold rounded ${
                activeTab === "html" ? "active" : ""
              }`}
            >
              HTML
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "rendered" ? (
            <div className="h-[400px] p-4 overflow-auto bg-[var(--page-bg)]">
              {/* Frontmatter Table */}
              {Object.keys(frontmatter).length > 0 && (
                <div className="mb-4 rounded-lg border border-[var(--border-color)] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--toolbar-bg)]">
                        <th className="px-3 py-2 text-left font-semibold border-b border-[var(--border-color)]">
                          Key
                        </th>
                        <th className="px-3 py-2 text-left font-semibold border-b border-[var(--border-color)]">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(frontmatter).map(([key, val]) => (
                        <tr
                          key={key}
                          className="border-b border-[var(--border-color)] last:border-b-0"
                        >
                          <td className="px-3 py-2 font-mono text-purple-600">
                            {key}
                          </td>
                          <td className="px-3 py-2">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/* Rendered Content */}
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              />
            </div>
          ) : (
            <div className="h-[400px] overflow-auto bg-[var(--page-bg)]">
              <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-words">
                <code
                  className="hljs"
                  dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                />
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
