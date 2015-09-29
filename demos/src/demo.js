/*global require*/

import SquishyList from './../../main';

const els = document.querySelectorAll('.drop-off');

for (let c = 0, l = els.length; c < l; c++) {
	new SquishyList(els[c]);
}
