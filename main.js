export default
class SquishyList {
	constructor(rootEl, opts){
		this.element = rootEl;
		this.moreWidth = 0;
		this.options = opts || { filterOnResize: true };

		this.getPrioritySortedChildNodeEls();
		this.moreEl = this.element.querySelector('[data-more]');
		if (this.moreEl) {
			this.showEl(this.moreEl);
			this.moreWidth = this.moreEl.offsetWidth;
			this.hideEl(this.moreEl);
		}
		this.squish();
		if (this.options.filterOnResize) {
			window.addEventListener('resize', this.resizeHandler.bind(this), false);
		}

		this.dispatchCustomEvent('oSquishyList.ready');
	}

	static init(el, opts) {
		if (!el) {
			el = document.body;
		}
		if (!(el instanceof HTMLElement)) {
			el = document.querySelector(el);
		}
		if (/\bo-squishy-list\b/.test(el.getAttribute('data-o-component'))) {
			return new SquishyList(el, opts);
		}
		return [].map.call(el.querySelectorAll('[data-o-component="o-squishy-list"]'), el => new SquishyList(el, opts));
	}

	dispatchCustomEvent(name, data) {
		if (document.createEvent && this.element.dispatchEvent) {
			const event = document.createEvent('Event');
			event.initEvent(name, true, true);
			if (data) {
				event.detail = data;
			}
			this.element.dispatchEvent(event);
		}
	}

	getItemEls() {
		const itemEls = [];
		let childNodeEl;

		for (let c = 0, l = this.element.childNodes.length; c < l; c++) {
			childNodeEl = this.element.childNodes[c];

			// Make it flexible so that other product and modules can manually hide elements and o-squishy-list won't add it to it's list
			if (childNodeEl.nodeType === 1 && !childNodeEl.hasAttribute('data-more') && !childNodeEl.hasAttribute('data-o-squishy-list--ignore')) {
				itemEls.push(childNodeEl);
			}
		}
		return itemEls;
	}

	showEl(el) { // eslint-disable-line class-methods-use-this
		if (el) {
			el.removeAttribute('aria-hidden');
		}
	}

	hideEl(el) { // eslint-disable-line class-methods-use-this
		if (el) {
			el.setAttribute('aria-hidden', 'true');
		}
	}

	getElPriority(el) { // eslint-disable-line class-methods-use-this
		return parseInt(el.getAttribute('data-priority'), 10);
	}

	getPrioritySortedChildNodeEls() {
		this.allItemEls = this.getItemEls();
		this.prioritySortedItemEls = [];
		const unprioritisedItemEls = [];
		for (let c = 0, l = this.allItemEls.length; c < l; c++) {
			const thisItemEl = this.allItemEls[c];
			const thisItemPriority = this.getElPriority(thisItemEl);
			if (isNaN(thisItemPriority)) {
				unprioritisedItemEls.push(thisItemEl);
			} else if (thisItemPriority >= 0) {
				if (!Array.isArray(this.prioritySortedItemEls[thisItemPriority])) {
					this.prioritySortedItemEls[thisItemPriority] = [];
				}
				this.prioritySortedItemEls[thisItemPriority].push(thisItemEl);
			}
		}
		if (unprioritisedItemEls.length > 0) {
			this.prioritySortedItemEls.push(unprioritisedItemEls);
		}
		this.prioritySortedItemEls = this.prioritySortedItemEls.filter(function(v) {
			return v !== undefined;
		});
	}

	showAllItems() {
		this.hiddenItemEls = [];
		for (let c = 0, l = this.allItemEls.length; c < l; c++) {
			this.showEl(this.allItemEls[c]);
		}
	}

	hideItems(els) {
		// We want highest priority items to be at the beginning of the array
		for (let i = els.length - 1; i > -1; i--) {
			this.hiddenItemEls.unshift(els[i]);
			this.hideEl(els[i]);
		}
	}

	getVisibleContentWidth() {
		let visibleItemsWidth = 0;
		for (let c = 0, l = this.allItemEls.length; c < l; c++) {
			if (!this.allItemEls[c].hasAttribute('aria-hidden')) {
				visibleItemsWidth += this.allItemEls[c].offsetWidth; // Needs to take into account margins too
			}
		}
		return visibleItemsWidth;
	}

	doesContentFit() {
		return this.getVisibleContentWidth() <= this.element.clientWidth;
	}

	getHiddenItems() {
		return this.hiddenItemEls;
	}

	getRemainingItems() {
		return this.allItemEls.filter((el) => {
			return this.hiddenItemEls.indexOf(el) === -1;
		});
	}

	squish() {
		this.showAllItems();
		if (this.doesContentFit()) {
			this.hideEl(this.moreEl);
		} else {
			for (let p = this.prioritySortedItemEls.length - 1; p >= 0; p--) {
				this.hideItems(this.prioritySortedItemEls[p]);
				if ((this.getVisibleContentWidth() + this.moreWidth) <= this.element.clientWidth) {
					this.showEl(this.moreEl);
					break;
				}
			}
		}
		this.dispatchCustomEvent('oSquishyList.change', {
			hiddenItems: this.getHiddenItems(),
			remainingItems: this.getRemainingItems()
		});
	}

	resizeHandler() {
		clearTimeout(this.debounceTimeout);
		this.debounceTimeout = setTimeout(this.squish.bind(this), 50);
	}

	destroy() {
		for (let c = 0, l = this.allItemEls.length; c < l; c++) {
			this.allItemEls[c].removeAttribute('aria-hidden');
		}
		window.removeEventListener('resize', this.resizeHandler, false);
		this.element.removeAttribute('data-o-squishy-list-js');
	}

}

const constructAll = function() {
	SquishyList.init();
	document.removeEventListener('o.DOMContentLoaded', constructAll);
};

if (typeof window !== 'undefined') {
	document.addEventListener('o.DOMContentLoaded', constructAll);
}
