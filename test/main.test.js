/*global require,describe,beforeEach,afterEach,it,expect*/

var fixtures = require('./helpers/fixtures'),
    PrioritisedContentFilter = require('./../main'),
    testPCF,
    pcfEl;

describe("oPrioritisedContentFilter behaviour", function() {
    "use strict";

    var pcfLastEvent;

    function pcfEventHandler(ev) {
        pcfLastEvent = ev.detail;
    }

    beforeEach(function(){
        fixtures.insertSimple();
        pcfEl = document.querySelector('ul');
        testPCF = new PrioritisedContentFilter(pcfEl);
        pcfLastEvent = null;
        document.body.addEventListener('oPrioritisedContentFilter.change', pcfEventHandler, false);
    });

    afterEach(function() {
        testPCF.destroy();
        document.body.removeEventListener('oPrioritisedContentFilter.change', pcfEventHandler, false);
        testPCF = null;
        pcfEl = null;
        fixtures.reset();
    });

    it("is defined", function() {
        expect(PrioritisedContentFilter).toBeDefined();
    });

    it("initial dom changes", function() {
        expect(pcfEl.querySelectorAll('[aria-hidden="true"]').length).toEqual(0);
    });

    it("all items without priority are hidden first", function() {
        pcfEl.style.width = "850px";
        testPCF.hideEnoughToFit();
        expect(pcfEl.querySelectorAll('[aria-hidden="true"]').length).toEqual(2);
        expect(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]').length).toEqual(2);
        expect(pcfLastEvent).toBeTruthy();
        expect(pcfLastEvent.hiddenItems.length).toEqual(2);
        expect(pcfLastEvent.hiddenItems[0]).toEqual(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[0]);
        expect(pcfLastEvent.hiddenItems[1]).toEqual(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]')[1]);
    });

    it("all priority 3 and lower items are hidden next", function() {
        pcfEl.style.width = "650px";
        testPCF.hideEnoughToFit();
        expect(pcfEl.querySelectorAll('[aria-hidden="true"]').length).toEqual(4);
        expect(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]').length).toEqual(2);
        expect(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]').length).toEqual(2);
        expect(pcfLastEvent).toBeTruthy();
        expect(pcfLastEvent.hiddenItems.length).toEqual(4);
        expect(pcfLastEvent.hiddenItems[2]).toEqual(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[0]);
        expect(pcfLastEvent.hiddenItems[3]).toEqual(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]')[1]);
    });

    it("all priority 2 and lower items are hidden next", function() {
        pcfEl.style.width = "350px";
        testPCF.hideEnoughToFit();
        expect(pcfEl.querySelectorAll('[aria-hidden="true"]').length).toEqual(7);
        expect(pcfEl.querySelectorAll(':not([data-priority])[aria-hidden="true"]').length).toEqual(2);
        expect(pcfEl.querySelectorAll('[data-priority="3"][aria-hidden="true"]').length).toEqual(2);
        expect(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]').length).toEqual(3);
        expect(pcfLastEvent).toBeTruthy();
        expect(pcfLastEvent.hiddenItems.length).toEqual(7);
        expect(pcfLastEvent.hiddenItems[4]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[0]);
        expect(pcfLastEvent.hiddenItems[5]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[1]);
        expect(pcfLastEvent.hiddenItems[6]).toEqual(pcfEl.querySelectorAll('[data-priority="2"][aria-hidden="true"]')[2]);
    });

    it("all items are re-shown when size allows", function() {
        pcfEl.style.width = "650px";
        testPCF.hideEnoughToFit();
        expect(pcfEl.querySelectorAll('[aria-hidden="true"]').length).toEqual(4);
        pcfEl.style.width = "1000px";
        testPCF.hideEnoughToFit();
        expect(pcfEl.querySelectorAll('[aria-hidden="true"]').length).toEqual(0);
        expect(pcfLastEvent).toBeTruthy();
        expect(pcfLastEvent.hiddenItems.length).toEqual(0);
    });

});