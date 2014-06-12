/*global require*/

var SquishyList = require('./../../main');

var els = document.querySelectorAll('.drop-off');

for (var c = 0, l = els.length; c < l; c++) {
    new SquishyList(els[c]);
}