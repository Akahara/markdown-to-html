import { RULES_HTML, RULES_JS, RULES_CSS, RULES_PHP } from "./lex-js-rules.js";
import { lex } from "./lex-js.js";

export const KNOWN_LANGUAGE_RULES = {
    html: RULES_HTML,
    php: RULES_PHP,
    js: RULES_JS,
    javascript: RULES_JS,
    css: RULES_CSS,
}

/** @type {import("./lex-js.js").LanguageRules} */
export const DEFAULT_LANGUAGE_RULES = {
    name: 'DEFAULT',
    contextSeparators: [],
    defaultClass: 'misc',
    separators: [],
    separatorsClass: undefined,
    tokens: [],
}

export default function rehypeCustomHighlight(options) {
    options = options || {};
    options.classPrefix = options.classPrefix || 'cdhg-';

    return (tree) => visit(tree);

    function visit(tree) {
        tryAffect(tree);
        if(tree.children) {
            for(let child of tree.children)
                visit(child);
        }
    }
    
    function tryAffect(node) {
        if(node.tagName != 'code' || node.children.length != 1)
            return;
        let firstChild = node.children[0];
        if(firstChild.type != 'text')
            return;
        let text = firstChild.value.trim();
        let languageName = node.properties?.className?.find(x => x.startsWith('language-'));
        
        if(languageName != null) {
            // use the markdown-provided language
            languageName = languageName.substr('language-'.length);
        } else if(text.startsWith('```') && text.endsWith('```')) {
            // find the language ourselves
            text = text.substr(3, text.length-6);
            let split = text.indexOf('\n');
            languageName = text.substr(0, split);
            text = text.substr(split+1);
        } else {
            return;
        }

        if(languageName == 'php' && text.includes('<?php'))
            languageName = 'html';

        let rules = KNOWN_LANGUAGE_RULES[languageName] || DEFAULT_LANGUAGE_RULES;

        let tokens = lex(text, rules);
        
        node.children = [];
        for(let tk of tokens) {
            node.children.push({
                type: 'element',
                tagName: 'span',
                properties: { className: tk.class.map(c => options.classPrefix + c) },
                children: [ { type: 'text', value: tk.text } ],
            });
        }
    }
}