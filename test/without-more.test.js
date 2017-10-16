/*global require,describe,beforeEach,afterEach,it*/

import proclaim from 'proclaim';

import * as fixtures from './helpers/fixtures.js';
import SquishyList from './../main';

let testPCF;
let pcfEl;

function nodeListToArray(nl) {
	return [].map.call(nl, (element) => {
		return element;
	});
}

describe("o-squishy-list behaviour without More", () => {
	beforeEach(() => {
		fixtures.insertWithoutMore();
		pcfEl = document.querySelector('ul');
		testPCF = new SquishyList(pcfEl);
	});

	afterEach(() => {
		testPCF.destroy();
		testPCF = null;
		pcfEl = null;
		fixtures.reset();
	});

	describe("Initialisation", () => {
		it("is defined", () => {
			proclaim.isDefined(SquishyList);
		});

		it("initial dom changes", () => {
			proclaim.lengthEquals(pcfEl.querySelectorAll('[data-priority][aria-hidden="true"]'), 0);
		});
	});

	describe("Hiding item elements", () => {

		it("Items without priority are hidden first", () => {
			pcfEl.style.width = "850px";
			testPCF.squish();
			proclaim.lengthEquals(pcfEl.querySelectorAll(':not([data-priority]):not([data-more])[aria-hidden="true"]'), 2);
		});

		it("Priority 3 and lower items are hidden next", () => {
			pcfEl.style.width = "650px";
			testPCF.squish();
			proclaim.lengthEquals(pcfEl.querySelectorAll('[aria-hidden="true"]'), 4);
			proclaim.lengthEquals(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]'), 2);
			proclaim.lengthEquals(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]'), 2);
		});

		it("Priority 2 and lower items are hidden next", () => {
			pcfEl.style.width = "450px";
			testPCF.squish();
			proclaim.lengthEquals(pcfEl.querySelectorAll('[aria-hidden="true"]'), 6);
			proclaim.lengthEquals(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]'), 2);
			proclaim.lengthEquals(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]'), 2);
			proclaim.lengthEquals(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]'), 2);
		});

	});

	describe("Items are re-shown when size allows", () => {

		beforeEach(() => {
			pcfEl.style.width = "650px";
			testPCF.squish();
			proclaim.lengthEquals(pcfEl.querySelectorAll(':not([data-more])[aria-hidden="true"]'), 4);
			pcfEl.style.width = "1000px";
			testPCF.squish();
		});

		it("Items are shown", () => {
			proclaim.lengthEquals(pcfEl.querySelectorAll(':not([data-more])[aria-hidden="true"]'), 0);
		});

	});

	describe("getHiddenItems(), getRemainingItems()", () => {

		it("When items without priority are hidden", () => {
			pcfEl.style.width = "850px";
			testPCF.squish();
			proclaim.lengthEquals(testPCF.getHiddenItems(), 2);
			proclaim.deepEqual(testPCF.getHiddenItems()[0], pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[0]);
			proclaim.deepEqual(testPCF.getHiddenItems()[1], pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[1]);
			proclaim.lengthEquals(testPCF.getRemainingItems(), 7);
			proclaim.deepEqual(testPCF.getRemainingItems(), nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
		});

		it("When priority 3 and lower items are hidden", () => {
			pcfEl.style.width = "650px";
			testPCF.squish();
			proclaim.lengthEquals(testPCF.getHiddenItems(), 4);
			proclaim.deepEqual(testPCF.getHiddenItems()[0], pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[0]);
			proclaim.deepEqual(testPCF.getHiddenItems()[1], pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[1]);
			proclaim.lengthEquals(testPCF.getRemainingItems(), 5);
			proclaim.deepEqual(testPCF.getRemainingItems(), nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
		});

		it("When priority 2 and lower items are hidden", () => {
			pcfEl.style.width = "450px";
			testPCF.squish();
			proclaim.lengthEquals(testPCF.getHiddenItems(), 6);
			proclaim.deepEqual(testPCF.getHiddenItems()[0], pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[0]);
			proclaim.deepEqual(testPCF.getHiddenItems()[1], pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[1]);
			proclaim.lengthEquals(testPCF.getRemainingItems(), 3);
			proclaim.deepEqual(testPCF.getRemainingItems(), nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
		});

		it("When all items are re-shown", () => {
			pcfEl.style.width = "350px";
			testPCF.squish();
			pcfEl.style.width = "1000px";
			testPCF.squish();
			proclaim.lengthEquals(testPCF.getHiddenItems(), 0);
			proclaim.lengthEquals(testPCF.getRemainingItems(), 9);
			proclaim.deepEqual(testPCF.getRemainingItems(), nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
		});

	});

	describe("Events fired when items are hidden or shown", () => {

		let pcfLastEvent;

		function pcfEventHandler(ev) {
			pcfLastEvent = ev.detail;
		}

		beforeEach(() => {
			pcfLastEvent = null;
			document.body.addEventListener('oSquishyList.change', pcfEventHandler, false);
		});

		afterEach(() => {
			document.body.removeEventListener('oSquishyList.change', pcfEventHandler, false);
		});

		it("When items without priority are hidden", () => {
			pcfEl.style.width = "850px";
			testPCF.squish();
			proclaim.lengthEquals(pcfLastEvent.hiddenItems, 2);
			proclaim.deepEqual(pcfLastEvent.hiddenItems[0], pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[0]);
			proclaim.deepEqual(pcfLastEvent.hiddenItems[1], pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[1]);
			proclaim.lengthEquals(pcfLastEvent.remainingItems, 7);
			proclaim.deepEqual(pcfLastEvent.remainingItems, nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
		});

		it("When priority 3 and lower items are hidden", () => {
			pcfEl.style.width = "650px";
			testPCF.squish();
			proclaim.ok(pcfLastEvent);
			proclaim.lengthEquals(pcfLastEvent.hiddenItems, 4);
			proclaim.deepEqual(pcfLastEvent.hiddenItems[0], pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[0]);
			proclaim.deepEqual(pcfLastEvent.hiddenItems[1], pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[1]);
			proclaim.lengthEquals(pcfLastEvent.remainingItems, 5);
			proclaim.deepEqual(pcfLastEvent.remainingItems, nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
		});

		it("When priority 2 and lower items are hidden", () => {
			pcfEl.style.width = "450px";
			testPCF.squish();
			proclaim.ok(pcfLastEvent);
			proclaim.lengthEquals(pcfLastEvent.hiddenItems, 6);
			proclaim.deepEqual(pcfLastEvent.hiddenItems[0], pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[0]);
			proclaim.deepEqual(pcfLastEvent.hiddenItems[1], pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[1]);
			proclaim.lengthEquals(pcfLastEvent.remainingItems, 3);
			proclaim.deepEqual(pcfLastEvent.remainingItems, nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
		});

		it("When all items are re-shown", () => {
			pcfEl.style.width = "350px";
			testPCF.squish();
			pcfEl.style.width = "1000px";
			testPCF.squish();
			proclaim.ok(pcfLastEvent);
			proclaim.lengthEquals(pcfLastEvent.hiddenItems, 0);
			proclaim.lengthEquals(pcfLastEvent.remainingItems, 9);
			proclaim.deepEqual(pcfLastEvent.remainingItems, nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
		});

	});

});
