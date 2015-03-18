/*global require,describe,beforeEach,afterEach,it,expect*/
"use strict";

import * as fixtures from './helpers/fixtures.js';
import SquishyList from './../main.js';

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
			expect(SquishyList).toBeDefined();
		});

		it("initial dom changes", () => {
			expect(pcfEl.querySelectorAll('[data-priority][aria-hidden="true"]').length).toEqual(0);
		});
	});

	describe("Hiding item elements", () => {

		it("Items without priority are hidden first", () => {
			pcfEl.style.width = "850px";
			testPCF.squish();
			expect(pcfEl.querySelectorAll(':not([data-priority]):not([data-more])[aria-hidden="true"]').length).toEqual(2);
		});

		it("Priority 3 and lower items are hidden next", () => {
			pcfEl.style.width = "650px";
			testPCF.squish();
			expect(pcfEl.querySelectorAll('[aria-hidden="true"]').length).toEqual(4);
			expect(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]').length).toEqual(2);
			expect(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]').length).toEqual(2);
		});

		it("Priority 2 and lower items are hidden next", () => {
			pcfEl.style.width = "450px";
			testPCF.squish();
			expect(pcfEl.querySelectorAll('[aria-hidden="true"]').length).toEqual(6);
			expect(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]').length).toEqual(2);
			expect(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]').length).toEqual(2);
			expect(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]').length).toEqual(2);
		});

	});

	describe("Items are re-shown when size allows", () => {

		beforeEach(() => {
			pcfEl.style.width = "650px";
			testPCF.squish();
			expect(pcfEl.querySelectorAll(':not([data-more])[aria-hidden="true"]').length).toEqual(4);
			pcfEl.style.width = "1000px";
			testPCF.squish();
		});

		it("Items are shown", () => {
			expect(pcfEl.querySelectorAll(':not([data-more])[aria-hidden="true"]').length).toEqual(0);
		});

	});

	describe("getHiddenItems(), getRemainingItems()", () => {

		it("When items without priority are hidden", () => {
			pcfEl.style.width = "850px";
			testPCF.squish();
			expect(testPCF.getHiddenItems().length).toEqual(2);
			expect(testPCF.getHiddenItems()[0]).toEqual(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[0]);
			expect(testPCF.getHiddenItems()[1]).toEqual(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[1]);
			expect(testPCF.getRemainingItems().length).toEqual(7);
			expect(testPCF.getRemainingItems()).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
		});

		it("When priority 3 and lower items are hidden", () => {
			pcfEl.style.width = "650px";
			testPCF.squish();
			expect(testPCF.getHiddenItems().length).toEqual(4);
			expect(testPCF.getHiddenItems()[2]).toEqual(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[0]);
			expect(testPCF.getHiddenItems()[3]).toEqual(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[1]);
			expect(testPCF.getRemainingItems().length).toEqual(5);
			expect(testPCF.getRemainingItems()).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
		});

		it("When priority 2 and lower items are hidden", () => {
			pcfEl.style.width = "450px";
			testPCF.squish();
			expect(testPCF.getHiddenItems().length).toEqual(6);
			expect(testPCF.getHiddenItems()[4]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[0]);
			expect(testPCF.getHiddenItems()[5]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[1]);
			expect(testPCF.getRemainingItems().length).toEqual(3);
			expect(testPCF.getRemainingItems()).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
		});

		it("When all items are re-shown", () => {
			pcfEl.style.width = "350px";
			testPCF.squish();
			pcfEl.style.width = "1000px";
			testPCF.squish();
			expect(testPCF.getHiddenItems().length).toEqual(0);
			expect(testPCF.getRemainingItems().length).toEqual(9);
			expect(testPCF.getRemainingItems()).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
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
			expect(pcfLastEvent.hiddenItems.length).toEqual(2);
			expect(pcfLastEvent.hiddenItems[0]).toEqual(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[0]);
			expect(pcfLastEvent.hiddenItems[1]).toEqual(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[1]);
			expect(pcfLastEvent.remainingItems.length).toEqual(7);
			expect(pcfLastEvent.remainingItems).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
		});

		it("When priority 3 and lower items are hidden", () => {
			pcfEl.style.width = "650px";
			testPCF.squish();
			expect(pcfLastEvent).toBeTruthy();
			expect(pcfLastEvent.hiddenItems.length).toEqual(4);
			expect(pcfLastEvent.hiddenItems[2]).toEqual(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[0]);
			expect(pcfLastEvent.hiddenItems[3]).toEqual(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[1]);
			expect(pcfLastEvent.remainingItems.length).toEqual(5);
			expect(pcfLastEvent.remainingItems).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
		});

		it("When priority 2 and lower items are hidden", () => {
			pcfEl.style.width = "450px";
			testPCF.squish();
			expect(pcfLastEvent).toBeTruthy();
			expect(pcfLastEvent.hiddenItems.length).toEqual(6);
			expect(pcfLastEvent.hiddenItems[4]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[0]);
			expect(pcfLastEvent.hiddenItems[5]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[1]);
			expect(pcfLastEvent.remainingItems.length).toEqual(3);
			expect(pcfLastEvent.remainingItems).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
		});

		it("When all items are re-shown", () => {
			pcfEl.style.width = "350px";
			testPCF.squish();
			pcfEl.style.width = "1000px";
			testPCF.squish();
			expect(pcfLastEvent).toBeTruthy();
			expect(pcfLastEvent.hiddenItems.length).toEqual(0);
			expect(pcfLastEvent.remainingItems.length).toEqual(9);
			expect(pcfLastEvent.remainingItems).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"])')));
		});

	});

});
