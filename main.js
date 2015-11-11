/*global module*/

function SquishyList(rootEl, opts) {
	"use strict";

	var allItemEls;
	var prioritySortedItemEls;
	var hiddenItemEls;
	var moreEl;
	var moreWidth = 0;
	var debounceTimeout;
	var options = opts || { filterOnResize: true };

	function dispatchCustomEvent(name, data) {
		if (document.createEvent && rootEl.dispatchEvent) {
			var event = document.createEvent('Event');
			event.initEvent(name, true, true);
			if (data) {
				event.detail = data;
			}
			rootEl.dispatchEvent(event);
		}
	}

	function getItemEls() {
		var itemEls = [];
		var childNodeEl;

		for (var c = 0, l = rootEl.childNodes.length; c < l; c++) {
			childNodeEl = rootEl.childNodes[c];
			// Make it flexible so that other product and modules can manually hide elements and o-squishy-list won't add it to it's list
			if (childNodeEl.nodeType === 1 && !childNodeEl.hasAttribute('data-more') && !childNodeEl.hasAttribute('data-o-squishy-list--ignore')) {
				itemEls.push(childNodeEl);
			}
		}
		return itemEls;
	}

	function showEl(el) {
		if (el) {
			el.removeAttribute('aria-hidden');
		}
	}

	function hideEl(el) {
		if (el) {
			el.setAttribute('aria-hidden', 'true');
		}
	}

	function getElPriority(el) {
		return parseInt(el.getAttribute('data-priority'), 10);
	}

	function getPrioritySortedChildNodeEls() {
		allItemEls = getItemEls();
		prioritySortedItemEls = [];
		var unprioritisedItemEls = [];
		for (var c = 0, l = allItemEls.length; c < l; c++) {
			var thisItemEl = allItemEls[c],
				thisItemPriority = getElPriority(thisItemEl);
			if (isNaN(thisItemPriority)) {
				unprioritisedItemEls.push(thisItemEl);
			} else if (thisItemPriority >= 0) {
				if (!Array.isArray(prioritySortedItemEls[thisItemPriority])) {
					prioritySortedItemEls[thisItemPriority] = [];
				}
				prioritySortedItemEls[thisItemPriority].push(thisItemEl);
			}
		}
		if (unprioritisedItemEls.length > 0) {
			prioritySortedItemEls.push(unprioritisedItemEls);
		}
		prioritySortedItemEls = prioritySortedItemEls.filter(function(v) {
			return v !== undefined;
		});
	}

	function showAllItems() {
		hiddenItemEls = [];
		for (var c = 0, l = allItemEls.length; c < l; c++) {
			showEl(allItemEls[c]);
		}
	}

	function hideItems(els) {
		// We want highest priority items to be at the beginning of the array
		for (var i = els.length - 1; i > -1; i--) {
			hiddenItemEls.unshift(els[i]);
			hideEl(els[i]);
		}
	}

	function getVisibleContentWidth() {
		var visibleItemsWidth = 0;
		for (var c = 0, l = allItemEls.length; c < l; c++) {
			if (!allItemEls[c].hasAttribute('aria-hidden')) {
				visibleItemsWidth += allItemEls[c].offsetWidth; // Needs to take into account margins too
			}
		}
		return visibleItemsWidth;
	}

	function doesContentFit() {
		return getVisibleContentWidth() <= rootEl.clientWidth;
	}

	function getHiddenItems() {
		return hiddenItemEls;
	}

    function getRemainingItems() {
        return allItemEls.filter(function(el) {
            return (hiddenItemEls && hiddenItemEls.indexOf(el) === -1);
        });
    }

    function squish() {
        let previousHidden = getHiddenItems();
        let previousRemaining = getRemainingItems();
        showAllItems();
        if (doesContentFit()) {
            hideEl(moreEl);
        } else {
            for (let p = prioritySortedItemEls.length - 1; p >= 0; p--) {
                hideItems(prioritySortedItemEls[p]);
                if ((getVisibleContentWidth() + moreWidth) <= rootEl.clientWidth) {
                    showEl(moreEl);
                    break;
                }
            }
        }
        let hiddenItems = getHiddenItems();
        let remainingItems = getRemainingItems();
        let hiddenChanged = (previousHidden && previousHidden.length !== hiddenItems.length);
        let remainingChanged = (previousRemaining && previousRemaining.length !== remainingItems.length);
        if (!previousHidden || hiddenChanged || remainingChanged) {
            dispatchCustomEvent('oSquishyList.change', {
                hiddenItems: hiddenItems,
                remainingItems: remainingItems
            });
        }
    }

	function resizeHandler() {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(squish, 50);
	}

	function destroy() {
		for (var c = 0, l = allItemEls.length; c < l; c++) {
			allItemEls[c].removeAttribute('aria-hidden');
		}
		window.removeEventListener('resize', resizeHandler, false);
		rootEl.removeAttribute('data-o-squishy-list-js');
	}

	function init() {
		if (!rootEl) {
			rootEl = document.body;
		} else if (!(rootEl instanceof HTMLElement)) {
			rootEl = document.querySelector(rootEl);
		}
		rootEl.setAttribute('data-o-squishy-list-js', '');
		getPrioritySortedChildNodeEls();
		moreEl = rootEl.querySelector('[data-more]');
		if (moreEl) {
			showEl(moreEl);
			moreWidth = moreEl.offsetWidth;
			hideEl(moreEl);
		}
		squish();
		if (options.filterOnResize) {
			window.addEventListener('resize', resizeHandler, false);
		}
	}

	init();

	this.getHiddenItems = getHiddenItems;
	this.getRemainingItems = getRemainingItems;
	this.squish = squish;
	this.destroy = destroy;

	dispatchCustomEvent('oSquishyList.ready');

}

module.exports = SquishyList;
