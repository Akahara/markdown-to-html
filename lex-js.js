/**
 * @typedef {Object} Token
 * @property {string} text
 * @property {string[]} class
 */

/**
 * @param {string} text The text to tokenize
 * @param {import("./lex-js-rules").LanguageRules} languageRules The language rules to start from
 * @returns {Token[]} The parsed tokens
 */
export function lex(text, languageRules) {
    let rulesStack = [];
    let stackPopTk = [];
    let activeRule = languageRules;

    let tokens = [];
    let previousCursor = 0;
    let currentCursor = 0;

    function addNormalToken() {
        if(currentCursor == previousCursor)
            return;
        tokens.push(getNormalToken(text.substr(previousCursor, currentCursor-previousCursor), activeRule));
    }

    continue_parsing:
    while(currentCursor < text.length) {
        if(stackPopTk.length > 0 && text.startsWith(stackPopTk[stackPopTk.length-1].exit, currentCursor)) {
            // context switch
            addNormalToken();
            let cs = stackPopTk.pop();
            activeRule = rulesStack.pop();
            tokens.push({ text: cs.exit, class: asArray(cs.class) });
            currentCursor += cs.exit.length;
            previousCursor = currentCursor;
            continue continue_parsing;
        }
        for(let cs of activeRule.contextSeparators) {
            if(text.startsWith(cs.enter, currentCursor)) {
                // context switch
                addNormalToken();
                rulesStack.push(activeRule);
                stackPopTk.push(cs);
                tokens.push({ text: cs.enter, class: asArray(cs.class) });
                activeRule = cs.rules;
                currentCursor += cs.enter.length;
                previousCursor = currentCursor;
                continue continue_parsing;
            }
        }
        for(let s of activeRule.separators) {
            if(text.startsWith(s, currentCursor)) {
                addNormalToken();
                currentCursor += s.length;
                previousCursor = currentCursor;
                tokens.push({ text: s, class: asArray(activeRule.separatorsClass) });
                continue continue_parsing;
            }
        }
        if(text[currentCursor] == '\\')
            currentCursor++;
        currentCursor++;
    }

    addNormalToken();
    collapseTokens(tokens);

    while(stackPopTk.length > 0 && stackPopTk[stackPopTk.length-1].exit.match(/^[\n\t\r ]$/)) {
        rulesStack.pop();
        stackPopTk.pop();
    }

    if(rulesStack.length > 0)
        console.warn('Rules remaining: ', rulesStack.map(r => r.name), ", in", activeRule.name);

    return tokens;
}

function collapseTokens(tokens) {
    for(let i = 0; i < tokens.length-1; i++) {
        if(arrayEquals(tokens[i].class, tokens[i+1].class)) {
            tokens[i].text += tokens.splice(i+1, 1)[0].text;
            i--;
        }
    }
}

function arrayEquals(a, b) {
    if(a.length !== b.length)
        return false;
    for(let i = 0; i < a.length; i++)
        if(a[i] !== b[i])
            return false;
    return true;
}

function getNormalToken(text, rule) {
    for(let tokenClass of rule.tokens) {
        for(let syntax of tokenClass.elements) {
            if(typeof syntax == 'string' ? text == syntax : text.match(syntax))
                return { text: text, class: asArray(tokenClass.class) };
        }
    }
    return { text: text, class: asArray(rule.defaultClass) };
}

function asArray(element) {
    return Array.isArray(element) ? element : [ element ];
}