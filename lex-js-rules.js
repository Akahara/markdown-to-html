/**
 * Common classes:
 *   variable
 *   number
 *   builtin
 *   separator
 *   text
 *   keyword
 *   misc
 *   comment
 *   class
 */

/**
 * @typedef {string[]|string} ClassList
 */

/**
 * @typedef {Object} SyntaxToken
 * @property {(string|RegExp)[]} elements
 * @property {ClassList} class
 */

/**
 * @typedef {Object} ContextSeparator
 * @property {string} enter
 * @property {string} exit
 * @property {LanguageRules} rules
 * @property {ClassList} class
 */

/**
 * @typedef {Object} LanguageRules
 * @property {string} name
 * @property {string[]|string} separators
 * @property {ClassList} separatorsClass
 * @property {ClassList} defaultClass
 * @property {ContextSeparator[]} contextSeparators
 * @property {SyntaxToken} tokens
 */

/** @type {LanguageRules} */
export const RULES_TEXT = {
    name: 'TEXT',
    separators: [],
    separatorsClass: null,
    contextSeparators: undefined,
    defaultClass: 'text',
    tokens: [],
};

/** @type {LanguageRules} */
export const RULES_COMMENT = {
    name: 'COMMENT',
    separators: [],
    separatorsClass: null,
    contextSeparators: [],
    defaultClass: 'comment',
    tokens: [],
}

export const TEXT_CONTEXT_SEPARATORS = [
    { enter: '"', exit: '"', rules: RULES_TEXT, class: [ 'text', 'text-quote' ] },
    { enter: '\'', exit: '\'', rules: RULES_TEXT, class: [ 'text', 'text-quote' ] },
];
RULES_TEXT.contextSeparators = TEXT_CONTEXT_SEPARATORS;

export function COMMENT_CONTEXT_SEPARATORS({ singleLineDoubleSlash, slashStar, singleLineOctothorp }) {
    let sep = [];
    if(singleLineDoubleSlash) sep.push({ enter: '//', exit: '\n', rules: RULES_COMMENT, class: 'comment' });
    if(slashStar)             sep.push({ enter: '/*', exit: '*/', rules: RULES_COMMENT, class: 'comment' });
    if(singleLineOctothorp)   sep.push({ enter: '#' , exit: '\n', rules: RULES_COMMENT, class: 'comment' });
    return sep;
}

/** @type {SyntaxToken[]} */
export const LITERAL_TOKENS = [
    {
        elements: [ /^\d+(\.\d+)?$/ ],
        class: 'number',
    },
];

/** @type {LanguageRules} */
const RULES_JS_TEMPLATE_LITERAL = {
    name: 'JS_TEMPLATE_LITERAL',
    defaultClass: 'text',
    separators: [],
    separatorsClass: null,
    contextSeparators: [
        { enter: '${', exit: '}', rules: undefined, class: 'js-template-literal' },
    ],
    tokens: [],
}

/** @type {LanguageRules} */
export const RULES_JS = {
    name: 'JAVASCRIPT',
    separators: '(){}[];+-*/%!?^|&=<>.,: \n\t\r',
    separatorsClass: 'separator',
    defaultClass: 'invalid',
    contextSeparators: [
        ...TEXT_CONTEXT_SEPARATORS,
        ...COMMENT_CONTEXT_SEPARATORS({ singleLineDoubleSlash: true, slashStar: true }),
        { enter: '`', exit: '`', rules: RULES_JS_TEMPLATE_LITERAL, class: [ 'text', 'text-quote' ] },
    ],
    tokens: [
        {
            elements: [
                'abstract', 'arguments', 'await', 'boolean',
                'break', 'byte', 'case', 'catch',
                'char', 'class', 'const', 'continue',
                'debugger', 'default', 'delete', 'do',
                'double', 'else', 'enum', 'eval',
                'export', 'extends', 'false', 'final',
                'finally', 'float', 'for', 'function',
                'goto', 'if', 'implements', 'import',
                'in', 'instanceof', 'int', 'interface',
                'let', 'long', 'native', 'new',
                'null', 'package', 'private', 'protected',
                'public', 'return', 'short', 'static',
                'super', 'switch', 'synchronized', 'this',
                'throw', 'throws', 'transient', 'true',
                'try', 'typeof', 'var', 'void',
                'volatile', 'while', 'with', 'yield',
                
                'of', 'async',
            ],
            class: 'keyword',
        },
        {
            elements: [
                'Array', 'Date', 'eval', 'function',
                'hasOwnProperty', 'Infinity', 'isFinite', 'isNaN',
                'isPrototypeOf', 'length', 'Math', 'NaN',
                'name', 'Number', 'Object', 'prototype',
                'String', 'toString', 'undefined', 'valueOf',
            ],
            class: 'builtin'
        },
        {
            elements: [
                'console', 'log', 'warn', 'error',
            ],
            class: 'builtin',
        },
        {
            elements: [
                'alert', 'all', 'anchor', 'anchors',
                'area', 'assign', 'blur', 'button',
                'checkbox', 'clearInterval', 'clearTimeout', 'clientInformation',
                'close', 'closed', 'confirm', 'constructor',
                'crypto', 'decodeURI', 'decodeURIComponent', 'defaultStatus',
                'document', 'element', 'elements', 'embed',
                'embeds', 'encodeURI', 'encodeURIComponent', 'escape',
                'event', 'fileUpload', 'focus', 'form',
                'forms', 'frame', 'innerHeight', 'innerWidth',
                'layer', 'layers', 'link', 'location',
                'mimeTypes', 'navigate', 'navigator', 'frames',
                'frameRate', 'hidden', 'history', 'image',
                'images', 'offscreenBuffering', 'open', 'opener',
                'option', 'outerHeight', 'outerWidth', 'packages',
                'pageXOffset', 'pageYOffset', 'parent', 'parseFloat',
                'parseInt', 'password', 'pkcs11', 'plugin',
                'prompt', 'propertyIsEnum', 'radio', 'reset',
                'screenX', 'screenY', 'scroll', 'secure',
                'select', 'self', 'setInterval', 'setTimeout',
                'status', 'submit', 'taint', 'text',
                'textarea', 'top', 'unescape', 'untaint',
                'window',
            ],
            class: [ 'builtin', 'variable' ],
        },
        {
            elements: [ /^[a-z_]\w+$/ ],
            class: 'variable',
        },
        {
            elements: [ /^[A-Z]\w+$/ ],
            class: 'class',
        },
        ...LITERAL_TOKENS
    ],
};
RULES_JS_TEMPLATE_LITERAL.contextSeparators[0].rules = RULES_JS;

/** @type {LanguageRules} */
export const RULES_PHP = {
    name: 'PHP',
    separators: '(){}[];+-*/%^!|&=<>.,: \n\t\r',
    separatorsClass: 'separator',
    defaultClass: 'invalid',
    contextSeparators: [
        ...TEXT_CONTEXT_SEPARATORS,
        ...COMMENT_CONTEXT_SEPARATORS({ singleLineDoubleSlash: true, slashStar: true }),
    ],
    tokens: [
        ...LITERAL_TOKENS,
        {
            // https://www.w3schools.com/php/php_ref_keywords.asp
            elements: [
                'abstract', 'and', 'as', 'break',
                'callable', 'case', 'catch', 'class',
                'clone', 'const', 'continue', 'declare',
                'default', 'do', 'echo', 'else',
                'elseif', 'empty', 'enddeclare', 'endfor',
                'endforeach', 'endif', 'endswitch', 'endwhile',
                'extends', 'final', 'finally', 'fn',
                'for', 'foreach', 'function', 'global',
                'goto', 'if', 'implements', 'include',
                'include_once', 'instanceof', 'insteadof', 'interface',
                'isset', 'list', 'namespace', 'new',
                'or', 'print', 'private', 'protected',
                'public', 'require', 'require_once', 'return',
                'static', 'switch', 'throw', 'trait',
                'try', 'unset', 'use', 'var',
                'while', 'xor', 'yield', 'yield from',
            ],
            class: 'keyword',
        },
        {
            // https://www.php.net/manual/en/indexes.functions.php
            // php has 3452 non namespaced keywords...
            // instead of adding 10+kb to this file we assume that
            // "something that looks like a keyword is a keyword"
            // php is dump.
            elements: [ /^\w+$/, /^\$_\w+$/ ],
            class: 'builtin',
        },
        {
            elements: [ /^\$\w+$/ ],
            class: 'variable',
        },
    ],
}

/** @type {LanguageRules} */
const RULES_CSS_INNER = {
    name: 'CSS_INNER',
    separators: ';() \n\r\t',
    separatorsClass: 'separator',
    contextSeparators: [
        ...TEXT_CONTEXT_SEPARATORS,
        ...COMMENT_CONTEXT_SEPARATORS({ slashStar: true }),
    ],
    defaultClass: 'css-value',
    tokens: [
        {
            elements: [ /^(\w|\-)+:$/ ],
            class: 'css-attribute',
        },
        ...LITERAL_TOKENS,
    ],
}

/** @type {LanguageRules} */
export const RULES_CSS = {
    name: 'CSS',
    separators: ';>*() \n\r\t',
    separatorsClass: 'separator',
    contextSeparators: [
        ...TEXT_CONTEXT_SEPARATORS,
        ...COMMENT_CONTEXT_SEPARATORS({ slashStar: true }),
        { enter: '{', exit: '}', rules: RULES_CSS_INNER, class: 'separator' },
    ],
    defaultClass: 'css-selector',
    // https://www.w3schools.com/cssref/
    tokens: [],
}

/** @type {LanguageRules} */
export const RULES_HTML_NODE = {
    name: 'HTML_NODE',
    separators: '=/ ',
    separatorsClass: 'separator',
    contextSeparators: [
        ...TEXT_CONTEXT_SEPARATORS,
    ],
    defaultClass: 'invalid',
    tokens: [
        {
            elements: [ '!DOCTYPE' ],
            class: 'builtin',
        },
        {
            // https://html.spec.whatwg.org/#elements-3
            elements: [
                'a', 'abbr', 'address', 'area',
                'article', 'aside', 'audio', 'b',
                'base', 'bdi', 'bdo', 'blockquote',
                'body', 'br', 'button', 'canvas',
                'caption', 'cite', 'code', 'col',
                'colgroup', 'data', 'datalist', 'dd',
                'del', 'details', 'dfn', 'dialog',
                'div', 'dl', 'dt', 'em',
                'embed', 'fieldset', 'figcaption', 'figure',
                'footer', 'form', 'h1', 'h2',
                'h3', 'h4', 'h5', 'h6',
                'head', 'header', 'hgroup', 'hr',
                'html', 'i', 'iframe', 'img',
                'input', 'ins', 'kbd', 'label',
                'legend', 'li', 'link', 'main',
                'map', 'mark', 'MathML math', 'menu',
                'meta', 'meter', 'nav', 'noscript',
                'object', 'ol', 'optgroup', 'option',
                'output', 'p', 'picture', 'pre',
                'progress', 'q', 'rp', 'rt',
                'ruby', 's', 'samp', 'script',
                'section', 'select', 'slot', 'small',
                'source', 'span', 'strong', 'style',
                'sub', 'summary', 'sup', 'SVG svg',
                'table', 'tbody', 'td', 'template',
                'textarea', 'tfoot', 'th', 'thead',
                'time', 'title', 'tr', 'track',
                'u', 'ul', 'var', 'video',
                'wbr' 
            ],
            class: 'html-element',
        },
        {
            elements: [
                'abbr', 'accept', 'accept-charset', 'accesskey',
                'action', 'allow', 'allowfullscreen', 'alt',
                'as', 'async', 'autocapitalize', 'autocomplete',
                'autocomplete', 'autofocus', 'autoplay', 'blocking',
                'charset', 'checked', 'cite', 'class',
                'color', 'cols', 'colspan', 'content',
                'contenteditable', 'controls', 'coords', 'crossorigin',
                'data', 'datetime', 'datetime', 'decoding',
                'default', 'defer', 'dir', 'dir',
                'dirname', 'disabled', 'disabled', 'disabled',
                'download', 'draggable', 'enctype', 'enterkeyhint',
                'for', 'for', 'form', 'formaction',
                'formenctype', 'formmethod', 'formnovalidate', 'formtarget',
                'headers', 'height', 'hidden', 'high',
                'href', 'href', 'href', 'hreflang',
                'http-equiv', 'id', 'imagesizes', 'imagesrcset',
                'inert', 'inputmode', 'integrity', 'is',
                'ismap', 'itemid', 'itemprop', 'itemref',
                'itemscope', 'itemtype', 'kind', 'label',
                'lang', 'list', 'loading', 'loop',
                'low', 'max', 'max', 'maxlength',
                'media', 'method', 'min', 'min',
                'minlength', 'multiple', 'muted', 'name',
                'name', 'name', 'name', 'name',
                'name', 'nomodule', 'nonce', 'novalidate',
                'open', 'open', 'optimum', 'pattern',
                'ping', 'placeholder', 'playsinline', 'poster',
                'preload', 'readonly', 'readonly', 'referrerpolicy',
                'rel', 'rel', 'required', 'reversed',
                'rows', 'rowspan', 'sandbox', 'scope',
                'selected', 'shape', 'size', 'sizes',
                'sizes', 'slot', 'span', 'spellcheck',
                'src', 'srcdoc', 'srclang', 'srcset',
                'start', 'step', 'style', 'tabindex',
                'target', 'target', 'target', 'title',
                'title', 'title', 'title', 'title',
                'translate', 'type', 'type', 'type',
                'type', 'type', 'type', 'usemap',
                'value', 'value', 'value', 'value',
                'value', 'width', 'wrap'
            ],
            class: 'html-attribute',
        },
    ],
}

/** @type {LanguageRules} */
export const RULES_HTML = {
    name: 'HTML',
    separators: [],
    separatorsClass: null,
    defaultClass: 'misc',
    contextSeparators: [
        { enter: '<?=', exit: '?>', rules: RULES_PHP, class: 'html-context-switch' },
        { enter: '<?php', exit: '?>', rules: RULES_PHP, class: 'html-context-switch' },
        { enter: '<script>', exit: '</script>', rules: RULES_JS, class: 'html-context-switch' },
        { enter: '<style>', exit: '</style>', rules: RULES_CSS, class: 'html-context-switch' },
        { enter: '<', exit: '>', rules: RULES_HTML_NODE, class: 'separator' },
    ],
    tokens: [],
};