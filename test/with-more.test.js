/*global require,describe,beforeEach,afterEach,it,expect*/

var fixtures = require('./helpers/fixtures'),
    SquishyList = require('./../main'),
    testPCF,
    pcfEl;

function nodeListToArray(nl) {
    "use strict";
    return [].map.call(nl, function(element) {
        return element;
    });
}

describe("o-squishy-list behaviour with More", function() {
    "use strict";

    beforeEach(function(){
        fixtures.insertWithMore();
        pcfEl = document.querySelector('ul');
        testPCF = new SquishyList(pcfEl);
    });

    afterEach(function() {
        testPCF.destroy();
        testPCF = null;
        pcfEl = null;
        fixtures.reset();
    });

    describe("Initialisation", function() {
        it("is defined", function() {
            expect(SquishyList).toBeDefined();
        });

        it("initial dom changes", function() {
            expect(pcfEl.querySelectorAll('[data-priority][aria-hidden="true"]').length).toEqual(0);
        });
    });

    describe("Hiding item elements", function() {

        it("Items without priority are hidden first", function() {
            pcfEl.style.width = "850px";
            testPCF.squish();
            expect(pcfEl.querySelectorAll(':not([data-priority]):not([data-more])[aria-hidden="true"]').length).toEqual(2);
        });

        it("Priority 3 and lower items are hidden next", function() {
            pcfEl.style.width = "650px";
            testPCF.squish();
            expect(pcfEl.querySelectorAll('[aria-hidden="true"]').length).toEqual(4);
            expect(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]').length).toEqual(2);
            expect(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]').length).toEqual(2);
        });

        it("Priority 2 and lower items are hidden next", function() {
            pcfEl.style.width = "350px";
            testPCF.squish();
            expect(pcfEl.querySelectorAll('[aria-hidden="true"]').length).toEqual(7);
            expect(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]').length).toEqual(2);
            expect(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]').length).toEqual(2);
            expect(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]').length).toEqual(3);
        });

    });

    describe("Items are re-shown when size allows", function() {

        beforeEach(function() {
            pcfEl.style.width = "650px";
            testPCF.squish();
            expect(pcfEl.querySelectorAll(':not([data-more])[aria-hidden="true"]').length).toEqual(4);
            pcfEl.style.width = "1000px";
            testPCF.squish();
        });

        it("Items are shown", function() {
            expect(pcfEl.querySelectorAll(':not([data-more])[aria-hidden="true"]').length).toEqual(0);
        });

        it("More element is hidden", function() {
            expect(pcfEl.querySelectorAll('[data-more][aria-hidden="true"]').length).toEqual(1);
        });

    });

    describe("getHiddenItems(), getRemainingItems()", function() {

        it("When items without priority are hidden", function() {
            pcfEl.style.width = "850px";
            testPCF.squish();
            expect(testPCF.getHiddenItems().length).toEqual(2);
            expect(testPCF.getHiddenItems()[0]).toEqual(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[0]);
            expect(testPCF.getHiddenItems()[1]).toEqual(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[1]);
            expect(testPCF.getRemainingItems().length).toEqual(7);
            expect(testPCF.getRemainingItems()).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"]):not([data-more])')));
        });

        it("When priority 3 and lower items are hidden", function() {
            pcfEl.style.width = "650px";
            testPCF.squish();
            expect(testPCF.getHiddenItems().length).toEqual(4);
            expect(testPCF.getHiddenItems()[2]).toEqual(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[0]);
            expect(testPCF.getHiddenItems()[3]).toEqual(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[1]);
            expect(testPCF.getRemainingItems().length).toEqual(5);
            expect(testPCF.getRemainingItems()).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"]):not([data-more])')));
        });

        it("When priority 2 and lower items are hidden", function() {
            pcfEl.style.width = "350px";
            testPCF.squish();
            expect(testPCF.getHiddenItems().length).toEqual(7);
            expect(testPCF.getHiddenItems()[4]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[0]);
            expect(testPCF.getHiddenItems()[5]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[1]);
            expect(testPCF.getHiddenItems()[6]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[2]);
            expect(testPCF.getRemainingItems().length).toEqual(2);
            expect(testPCF.getRemainingItems()).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"]):not([data-more])')));
        });

        it("When all items are re-shown", function() {
            pcfEl.style.width = "350px";
            testPCF.squish();
            pcfEl.style.width = "1000px";
            testPCF.squish();
            expect(testPCF.getHiddenItems().length).toEqual(0);
            expect(testPCF.getRemainingItems().length).toEqual(9);
            expect(testPCF.getRemainingItems()).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"]):not([data-more])')));
        });

    });

    describe("Events fired when items are hidden or shown", function() {

        var pcfLastEvent;

        function pcfEventHandler(ev) {
            pcfLastEvent = ev.detail;
        }

        beforeEach(function() {
            pcfLastEvent = null;
            document.body.addEventListener('oSquishyList.change', pcfEventHandler, false);
        });

        afterEach(function() {
            document.body.removeEventListener('oSquishyList.change', pcfEventHandler, false);
        });

        it("When items without priority are hidden", function() {
            pcfEl.style.width = "850px";
            testPCF.squish();
            expect(pcfLastEvent.hiddenItems.length).toEqual(2);
            expect(pcfLastEvent.hiddenItems[0]).toEqual(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[0]);
            expect(pcfLastEvent.hiddenItems[1]).toEqual(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[1]);
            expect(pcfLastEvent.remainingItems.length).toEqual(7);
            expect(pcfLastEvent.remainingItems).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"]):not([data-more])')));
        });

        it("When priority 3 and lower items are hidden", function() {
            pcfEl.style.width = "650px";
            testPCF.squish();
            expect(pcfLastEvent).toBeTruthy();
            expect(pcfLastEvent.hiddenItems.length).toEqual(4);
            expect(pcfLastEvent.hiddenItems[2]).toEqual(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[0]);
            expect(pcfLastEvent.hiddenItems[3]).toEqual(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[1]);
            expect(pcfLastEvent.remainingItems.length).toEqual(5);
            expect(pcfLastEvent.remainingItems).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"]):not([data-more])')));
        });

        it("When priority 2 and lower items are hidden", function() {
            pcfEl.style.width = "350px";
            testPCF.squish();
            expect(pcfLastEvent).toBeTruthy();
            expect(pcfLastEvent.hiddenItems.length).toEqual(7);
            expect(pcfLastEvent.hiddenItems[4]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[0]);
            expect(pcfLastEvent.hiddenItems[5]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[1]);
            expect(pcfLastEvent.hiddenItems[6]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[2]);
            expect(pcfLastEvent.remainingItems.length).toEqual(2);
            expect(pcfLastEvent.remainingItems).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"]):not([data-more])')));
        });

        it("When all items are re-shown", function() {
            pcfEl.style.width = "350px";
            testPCF.squish();
            pcfEl.style.width = "1000px";
            testPCF.squish();
            expect(pcfLastEvent).toBeTruthy();
            expect(pcfLastEvent.hiddenItems.length).toEqual(0);
            expect(pcfLastEvent.remainingItems.length).toEqual(9);
            expect(pcfLastEvent.remainingItems).toEqual(nodeListToArray(pcfEl.querySelectorAll(':not([aria-hidden="true"]):not([data-more])')));
        });

    });

    describe("More item is shown when items are hidden", function() {

        afterEach(function() {
            expect(pcfEl.querySelectorAll('[data-more]:not([aria-hidden="true"])').length).toEqual(1);
        });

        it("When items without priority are hidden", function() {
            pcfEl.style.width = "850px";
            testPCF.squish();
        });

        it("When priority 3 and lower items are hidden", function() {
            pcfEl.style.width = "650px";
            testPCF.squish();
        });

        it("When priority 2 and lower items are hidden", function() {
            pcfEl.style.width = "350px";
            testPCF.squish();
        });

    });

});