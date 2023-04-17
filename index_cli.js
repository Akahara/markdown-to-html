import fs from 'fs'
import remarkPresetLintConsistent from 'remark-preset-lint-consistent';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import remarkCallouts, { calloutHastHandlers } from './remark-callouts.js';
import remarkParse from 'remark-parse/lib/index.js';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype/lib/index.js';
import rehypeCustomHighlight from './rehype-custom-highlight.js';
import rehypeStringify from 'rehype-stringify/lib/index.js';
import { unified } from 'unified';

/**
 * Usage:
 *  node markdown-to-html/index_cli.js <input.md> <output.html>
 * Or using stdin/stdout:
 *  cat file.md | node markdown-to-html/index_cli.js > output.html
 * 
 * For some reason utf-8 encoding does not work for stdin/stdout.
 */

async function convertMarkdownToHtml(markdown) {
  const processor = unified()
    .data('settings', {fragment: true})
    .use(remarkPresetLintConsistent)
    .use(remarkPresetLintRecommended)
    .use(remarkCallouts)
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkRehype, calloutHastHandlers)
    .use(rehypeCustomHighlight)
    .use(rehypeStringify);

  const html = await processor.process(markdown);

  // console.error(reporter(file));
  return html;
}

let input = process.argv[2];
let output = process.argv[3];

if(!input) {
  // use stdin if no file is specified
  input = process.stdin.fd;
}
if(!output) {
  // use stdout if no file is specified
  output = process.stdout.fd;
}

var markdown;
try {
  markdown = fs.readFileSync(input, 'utf-8');
} catch (e) {
    console.log('Usage:                  node markdown-to-html/index_cli.js <input.md> <output.html>');
    console.log('Or using stdin/stdout:  cat file.md | node markdown-to-html/index_cli.js > output.html');
    process.exit(1);
}

(async () => {
  if(markdown.trim() == '') {
    console.log('Usage:                  node markdown-to-html/index_cli.js <input.md> <output.html>');
    console.log('Or using stdin/stdout:  cat file.md | node markdown-to-html/index_cli.js > output.html');
    process.exit(1);
  }
  const html = ''+await convertMarkdownToHtml(markdown, { headersIds: false, headerNumbers: false });
  fs.writeFileSync(output, html, 'utf-8');
})();
