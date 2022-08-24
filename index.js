import util from 'util'
import { unified } from 'unified'
import { visit as unistdVisit } from 'unist-util-visit'
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
    unistdVisit(tree, (n, i, p) => {
      if(n.type == 'text' && n.value == '{{TOC}}')
        p.children[i] = toc;
    });
  };
}

/**
 * Small utility to add the section number to each heading
 * # title                   <h1>1 title</h1>
 * ## subtitle            -> <h2>1.1 subtitle</h2>
 * ## another subtitle       <h2>1.2 another subtitle</h2>
 */
function rehypeAddHeadingSection(opts={ headings: ['h1','h2','h3','h4','h5','h6'] }) {
  return (tree) => visit(tree, []);

  function visit(tree, current) {
    if(tree.type == 'element' && opts.headings.includes(tree.tagName)) {
      let n = opts.headings.indexOf(tree.tagName)+1;
      while(current.length < n)
        current.push(0);
      while(current.length > n)
        current.pop();
      current[n-1]++;
      tree.children.unshift({ type: 'text', value: current.join('.')+' ' });
    }
    if(tree.children) {
      for(let c of tree.children) {
        visit(c, current);
      }
    }
  }
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
    .use(rehypeAddHeadingSection, { headings: [ "h2", "h3", "h4", "h5", "h6" ] })
    .use(rehypeStringify)
    .process(markdown);

    // console.error(reporter(file));
  return html;
}

export { convertMarkdownToHtml };