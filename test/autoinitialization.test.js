/* eslint-env mocha, jasmine */

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
		expect(typeof SquishyList.init).toBe('function');
	});

	it("should autoinitialize", (done) => {
		spyOn(SquishyList, 'init');
		document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
		setTimeout(function(){
			expect(SquishyList.init).toHaveBeenCalled();
			done();
		}, 100);
	});

	it("should not autoinitialize  when the event is not dispached", () => {
		spyOn(SquishyList, 'init');
		expect(SquishyList.init).not.toHaveBeenCalled();
	});

	it("should create a SquishyList", () => {
		const squishy = SquishyList.init();
		expect(squishy instanceof Array).toBe(true);
		expect(squishy[0] instanceof SquishyList).toBe(true);
		expect(squishy.length).toBe(1);
	});

	it("should create an empty SquishyList when initialized if no SquishyList html present", () => {
		fixtures.reset();
		const squishy = SquishyList.init();
		expect(squishy).toEqual([]);
		expect(typeof squishy).toBe('object');
	});

	it("should create a SquishyList inside certain html element", () => {
		const squishy = SquishyList.init(pcfEl);
		expect(squishy instanceof SquishyList).toBe(true);
		expect(typeof squishy).toBe('object');
	});

	it("should create several SquishyLists inside certain html element", () => {
		fixtures.reset();
		fixtures.insertWithAndWithoutMore();
		pcfEl = document.querySelector('.sandbox');
		const squishy = SquishyList.init(pcfEl);
		expect(squishy.length).toEqual(2);
		expect(squishy[0] instanceof SquishyList).toBe(true);
		expect(squishy[1] instanceof SquishyList).toBe(true);
	});

	it("should create several SquishyLists using a css selector", () => {
		fixtures.reset();
		fixtures.insertWithAndWithoutMore();
		const squishy = SquishyList.init('.sandbox');
		expect(squishy.length).toEqual(2);
		expect(squishy[0] instanceof SquishyList).toBe(true);
		expect(squishy[1] instanceof SquishyList).toBe(true);
	});

	it("should resize when the window width changes", (done) => {
		fixtures.reset();
		SquishyList.init(pcfEl, { filterOnResize: true });
		const event = new CustomEvent('resize', {});
		document.dispatchEvent(event);
		pcfEl.addEventListener('oSquishyList.change', function() {
			expect(true).toBe(true);
			done();
		});
	});
});
