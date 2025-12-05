import type { BlockContext, BlockParser, Element, InlineContext } from "@lezer/markdown";

import { type Parser, Tree } from "@lezer/common";
import { parser as yamlParser } from "@lezer/yaml";

const FRONTMATTER_START = "---";
const FRONTMATTER_END = /^---$/;

function partialParse(
  ctx: BlockContext | InlineContext,
  parser: Parser,
  text: string,
  offset: number,
): Element {
  const innerTree = parser.parse(text);
  // Here we detach the syntax tree from the containing `Document` node, since
  // a parser expects that it needs to parse a full document. However, a child
  // `Document` element may or may not cause problems so we take it off its
  // root here.
  let treeElem = ctx.elt(innerTree, offset);
  const firstChild = innerTree.children[0];
  if (firstChild instanceof Tree) {
    treeElem = ctx.elt(firstChild, offset);
  }

  return treeElem;
}

// Docs: https://github.com/lezer-parser/markdown#user-content-blockparser
export const frontmatterParser: BlockParser = {
  before: "HorizontalRule",
  // We need to give the parser a name
  name: "Frontmatter",
  parse: (ctx, line) => {
    // This parser is inspired by the BlockParsers defined in
    // @lezer/markdown/src/markdown.ts
    if (line.text !== FRONTMATTER_START || ctx.lineStart !== 0) {
      return false;
    }

    // We have possible YAML frontmatter. Now we need to look for the end of
    // the frontmatter.
    // Meanwhile, we'll be collecting all lines encountered so that we can parse
    // them into a YAML AST.
    const yamlLines: string[] = [];

    // The position at which the frontmatter content starts (after "---\n")
    const from = 4;

    // Track if we've moved past the opening delimiter
    let foundClosingDelimiter = false;

    while (ctx.nextLine()) {
      if (FRONTMATTER_END.test(line.text)) {
        foundClosingDelimiter = true;
        break;
      }
      yamlLines.push(line.text);
    }

    if (!foundClosingDelimiter) {
      // The parser has collected the full rest of the document. This means
      // the frontmatter never stopped. In order to maintain readability, we
      // simply abort parsing.
      return false;
    }

    if (yamlLines.length === 0) {
      return false; // Frontmatter must have content
    }

    // A final check: A frontmatter is NOT a valid document if there is
    // whitespace at the top (i.e. no blank lines between the delimiters and the
    // frontmatter content). NOTE: Whitespace AFTER the frontmatter content is
    // allowed!
    if (yamlLines[0].trim() === "") {
      return false;
    }

    // At this point we have a full YAML frontmatter; we know where
    // it starts and we know where it ends. Parse the YAML content.
    const treeElem = partialParse(ctx, yamlParser, yamlLines.join("\n"), from);

    const wrapperNode = ctx.elt("FencedCode", 0, ctx.lineStart + 3, [
      ctx.elt("FrontmatterStart", 0, 3),
      ctx.elt("FrontmatterContent", 4, ctx.lineStart - 1, [treeElem]),
      ctx.elt("FrontmatterEnd", ctx.lineStart, ctx.lineStart + 3),
    ]);

    ctx.addElement(wrapperNode);

    return true;
  },
};
