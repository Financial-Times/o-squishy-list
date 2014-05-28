/*global require,describe,beforeEach,afterEach,it,expect*/

var fixtures = require('./helpers/fixtures'),
    PrioritisedContentFilter = require('./../main'),
    testPCF,
    pcfEl;

describe("oPrioritisedContentFilter behaviour without More", function() {
    "use strict";

    beforeEach(function(){
        fixtures.insertWithoutMore();
        pcfEl = document.querySelector('ul');
        testPCF = new PrioritisedContentFilter(pcfEl);
    });

    afterEach(function() {
        testPCF.destroy();
        testPCF = null;
        pcfEl = null;
        fixtures.reset();
    });

    describe("Initialisation", function() {
        it("is defined", function() {
            expect(PrioritisedContentFilter).toBeDefined();
        });

        it("initial dom changes", function() {
            expect(pcfEl.querySelectorAll('[data-priority][aria-hidden="true"]').length).toEqual(0);
        });
    });

    describe("Hiding item elements", function() {

        it("Items without priority are hidden first", function() {
            pcfEl.style.width = "850px";
            testPCF.filter();
            expect(pcfEl.querySelectorAll(':not([data-priority]):not([data-more])[aria-hidden="true"]').length).toEqual(2);
        });

        it("Priority 3 and lower items are hidden next", function() {
            pcfEl.style.width = "650px";
            testPCF.filter();
            expect(pcfEl.querySelectorAll('[aria-hidden="true"]').length).toEqual(4);
            expect(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]').length).toEqual(2);
            expect(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]').length).toEqual(2);
        });

        it("Priority 2 and lower items are hidden next", function() {
            pcfEl.style.width = "350px";
            testPCF.filter();
            expect(pcfEl.querySelectorAll('[aria-hidden="true"]').length).toEqual(7);
            expect(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]').length).toEqual(2);
            expect(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]').length).toEqual(2);
            expect(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]').length).toEqual(3);
        });

    });

    describe("Items are re-shown when size allows", function() {

        beforeEach(function() {
            pcfEl.style.width = "650px";
            testPCF.filter();
            expect(pcfEl.querySelectorAll(':not([data-more])[aria-hidden="true"]').length).toEqual(4);
            pcfEl.style.width = "1000px";
            testPCF.filter();
        });

        it("Items are shown", function() {
            expect(pcfEl.querySelectorAll(':not([data-more])[aria-hidden="true"]').length).toEqual(0);
        });

    });

    describe("Events fired when items are hidden or shown", function() {

        var pcfLastEvent;

        function pcfEventHandler(ev) {
            pcfLastEvent = ev.detail;
        }

        beforeEach(function() {
            pcfLastEvent = null;
            document.body.addEventListener('oPrioritisedContentFilter.change', pcfEventHandler, false);
        });

        afterEach(function() {
            document.body.removeEventListener('oPrioritisedContentFilter.change', pcfEventHandler, false);
        });

        it("When items without priority are hidden", function() {
            pcfEl.style.width = "850px";
            testPCF.filter();
            expect(pcfLastEvent.hiddenItems.length).toEqual(2);
            expect(pcfLastEvent.hiddenItems[0]).toEqual(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[0]);
            expect(pcfLastEvent.hiddenItems[1]).toEqual(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[1]);
        });

        it("When priority 3 and lower items are hidden", function() {
            pcfEl.style.width = "650px";
            testPCF.filter();
            expect(pcfLastEvent).toBeTruthy();
            expect(pcfLastEvent.hiddenItems.length).toEqual(4);
            expect(pcfLastEvent.hiddenItems[2]).toEqual(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[0]);
            expect(pcfLastEvent.hiddenItems[3]).toEqual(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[1]);
        });

        it("When priority 2 and lower items are hidden", function() {
            pcfEl.style.width = "350px";
            testPCF.filter();
            expect(pcfLastEvent).toBeTruthy();
            expect(pcfLastEvent.hiddenItems.length).toEqual(7);
            expect(pcfLastEvent.hiddenItems[4]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[0]);
            expect(pcfLastEvent.hiddenItems[5]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[1]);
            expect(pcfLastEvent.hiddenItems[6]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[2]);
        });

        it("When all items are re-shown", function() {
            pcfEl.style.width = "350px";
            testPCF.filter();
            pcfEl.style.width = "1000px";
            testPCF.filter();
            expect(pcfLastEvent).toBeTruthy();
            expect(pcfLastEvent.hiddenItems.length).toEqual(0);
        });

    });

});