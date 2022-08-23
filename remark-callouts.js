import { all } from "mdast-util-to-hast";

// https://help.obsidian.md/How+to/Use+callouts
const AVAILABLE_CALLOUTS = [
    'note',
    'abstract', 'summary', 'tldr',
    'info', 'todo',
    'tip', 'hint', 'important',
    'success', 'check', 'done',
    'question', 'help', 'faq',
    'warning', 'caution', 'attention',
    'failure', 'fail', 'missing',
    'danger', 'error',
    'bug',
    'example',
    'quote', 'cite',
];

export default function remarkCallouts() {

    return (tree) => {
        visit(tree);
    };

    function visit(tree) {
        tryAffect(tree);
        if(tree.children) {
            for(let child of tree.children)
                visit(child);
        }
    }

    function tryAffect(tree) {
        if(tree.type != 'blockquote')
            return;
        let titleLineNode = tree.children[0];
        if(titleLineNode == null || titleLineNode.type != 'paragraph')
            return;
        let typeNode = titleLineNode.children[0];
        if(typeNode == null || typeNode.type != 'text')
            return;
        let r = /\[!(.*)\].*/;
        let r1 = /\[!(.*)\]/g;
        let type = typeNode.value.match(r)?.[1];
        if(!AVAILABLE_CALLOUTS.includes(type))
            return;
        
        tree.type = 'callout';
        tree.calloutType = type;
        typeNode.value = typeNode.value.replace(r1, '');
    }
}

function mdastCalloutToHast(h, node) {
    let properties = { className: [`callout-${node.calloutType}`, 'callout'] }; // TODO check
    let children = all(h, node);
    let l = h(node, 'blockquote', properties, children);
    // l.children[0].tagName = 'h6';
    l.children = [
        l.children.shift(),
        {
            type: 'element',
            tagName: 'div',
            children: l.children
        }
    ];
    return l;
}

export const calloutHastHandlers = {
    handlers: {
        callout: mdastCalloutToHast
    }
};