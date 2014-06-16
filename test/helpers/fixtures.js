/*global exports*/

var sandboxEl;

function createSandbox() {
    "use strict";
    if (document.querySelector('.sandbox')) {
        sandboxEl = document.querySelector('.sandbox');
    } else {
        sandboxEl = document.createElement('div');
        sandboxEl.setAttribute('class', 'sandbox');
        document.body.appendChild(sandboxEl);
    }
}

function reset() {
    "use strict";
    sandboxEl.innerHTML = '';
}

function insert(html) {
    "use strict";
    createSandbox();
    sandboxEl.innerHTML = html;
}

function getStyles() {
    return [
        '<style>',
        'ul {',
        'margin: 0;',
        'padding: 0;',
        'white-space: nowrap;',
        'width: 1000px;',
        '}',
        'li {',
        'display: inline-block;',
        'margin: 0;',
        'padding: 0;',
        'width: 100px;',
        'list-style-type: none;',
        '}',
        'li[aria-hidden=true] {',
        'display: none;',
        '}',
        '</style>'].join('');
}

function insertWithoutMore() {
    "use strict";
    var html = [
        '<ul>',
            '<li data-priority="2">P2</li>',
            '<li data-priority="1">P1</li>',
            '<li data-priority="3">P3</li>',
            '<li>NP</li>',
            '<li data-priority="-1">Ex</li>',
            '<li data-priority="1">P1</li>',
            '<li data-priority="3">P3</li>',
            '<li>NP</li>',
            '<li data-priority="2">P2</li>',
        '</ul>'
    ];
    insert(getStyles() + html.join(''));
}

function insertWithMore() {
    "use strict";
    var html = [
        '<ul>',
        '<li data-priority="2">P2</li>',
        '<li data-priority="1">P1</li>',
        '<li data-priority="3">P3</li>',
        '<li>NP</li>',
        '<li data-priority="-1">Ex</li>',
        '<li data-priority="1">P1</li>',
        '<li data-priority="3">P3</li>',
        '<li>NP</li>',
        '<li data-priority="2">P2</li>',
        '<li data-more aria-hidden="true">P2</li>',
        '</ul>'
    ];
    insert(getStyles() + html.join(''));
}

exports.insertWithoutMore = insertWithoutMore;
exports.insertWithMore = insertWithMore;
exports.reset = reset;