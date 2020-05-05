import proclaim from 'proclaim';
import sinon from 'sinon/pkg/sinon';

import * as fixtures from './helpers/fixtures';
import SquishyList from './../main';

let pcfEl;

describe("o-squishy-list autoinitialization", () => {
	beforeEach(() => {
		fixtures.insertWithMore();
		pcfEl = document.querySelector('ul');
	});

	afterEach(() => {
		pcfEl = null;
		fixtures.reset();
	});

	it("should have an init function", () => {
		proclaim.isFunction(SquishyList.init);
	});

	it("should autoinitialize", (done) => {
		const initSpy = sinon.spy(SquishyList, 'init');
		document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
		setTimeout(function(){
			proclaim.isTrue(initSpy.called);
			initSpy.restore();
			done();
		}, 100);
	});

	it("should not autoinitialize  when the event is not dispached", () => {
		const initSpy = sinon.spy(SquishyList, 'init');
		proclaim.isFalse(initSpy.called);
	});

	it("should create a SquishyList", () => {
		const squishy = SquishyList.init();
		proclaim.isArray(squishy);
		proclaim.isInstanceOf(squishy[0], SquishyList);
		proclaim.lengthEquals(squishy, 1);
	});

	it("should create an empty SquishyList when initialized if no SquishyList html present", () => {
		fixtures.reset();
		const squishy = SquishyList.init();
		proclaim.deepEqual(squishy, []);
		proclaim.isObject(squishy);
	});

	it("should create a SquishyList inside certain html element", () => {
		const squishy = SquishyList.init(pcfEl);
		proclaim.isInstanceOf(squishy, SquishyList);
		proclaim.isObject(squishy);
	});

	it("should create several SquishyLists inside certain html element", () => {
		fixtures.reset();
		fixtures.insertWithAndWithoutMore();
		pcfEl = document.querySelector('.sandbox');
		const squishy = SquishyList.init(pcfEl);
		proclaim.lengthEquals(squishy, 2);
		proclaim.isInstanceOf(squishy[0], SquishyList);
		proclaim.isInstanceOf(squishy[1], SquishyList);
	});

	it("should create several SquishyLists using a css selector", () => {
		fixtures.reset();
		fixtures.insertWithAndWithoutMore();
		const squishy = SquishyList.init('.sandbox');
		proclaim.lengthEquals(squishy, 2);
		proclaim.isInstanceOf(squishy[0], SquishyList);
		proclaim.isInstanceOf(squishy[1], SquishyList);
	});

	it("should resize when the window width changes", (done) => {
		fixtures.reset();
		SquishyList.init(pcfEl, { filterOnResize: true });
		const event = new CustomEvent('resize', {});
		window.dispatchEvent(event);

		// Adds an event listener to test that the callback has
		// been triggered. If done() is not reached, test will fail
		pcfEl.addEventListener('oSquishyList.change', function() {
			done();
		});
	});
});
