### Markdown to HTML

This is a simple script to convert markdown files to HTML files.
It is based on [unified](https://github.com/unifiedjs/unified), [remark](https://github.com/remarkjs/remark) and [rehype](https://github.com/rehypejs/rehype), with two extensions that allow for [obsidian](https://obsidian.md/) style callouts language blocks with an easy-to-customize parser.

#### Usage

CLI:
```bash
node index_cli.js <input.md> <output.html>
cat <input.md> | node index_cli.js > <output.html>
```

Node:
```js
const { convertMarkdownToHtml } = require('./markdown-to-html.js');

const html = await convertMarkdownToHtml(markdown);
console.log(`${html}`);
```

Alternatively you can write your own `convertMarkdownToHtml` function using the provided one as a template (**this is the prefered approach**). Additional languages can be defined, see `lex-js-rules.js` for examples.

Have a good day!