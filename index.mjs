import util from 'util'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { reporter } from 'vfile-reporter'
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug'
import rehypeToc from 'rehype-toc'

import rehypeCustomHighlight from './rehype-custom-highlight.js'
import remarkCallouts, { calloutHastHandlers } from './remark-callouts.js'

/**
 * Small utility to move the table of contents generated 
 * by rehype-toc to the {{TOC}} marker in the document
 */
function rehypeMoveToc() {
  return (tree) => {
    let toc = tree.children.shift();
    visit(tree, (n, i, p) => {
      if(n.type == 'text' && n.value == '{{TOC}}')
        p.children[i] = toc;
    });
  };
}

/**
 * Small utility to print the full mdast/hast tree
 */
function printTree() {
  return (tree) => console.log(util.inspect(tree, { showHidden: false, depth: null, colors: true }));
}

async function convertMarkdownToHtml(markdown) {
  const html = await unified()
    .data('settings', {fragment: true})
    .use(remarkPresetLintConsistent)
    .use(remarkPresetLintRecommended)
    .use(remarkCallouts)
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkRehype, calloutHastHandlers)
    .use(rehypeSlug)
    .use(rehypeCustomHighlight)
    .use(rehypeToc, { headings: [ "h2", "h3" ] })
    .use(rehypeMoveToc)
    .use(rehypeStringify)
    .process(markdown);

    // console.error(reporter(file));
  return html;
}

export { convertMarkdownToHtml };