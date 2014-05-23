/*global module*/

function PrioritisedContentFilter(rootEl, opts) {
    "use strict";

    var allItemEls,
        prioritySortedItemEls,
        hiddenItemEls,
        debounceTimeout,
        options = opts || { filterOnResize: true };

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
        var itemEls = [],
            childNodeEl;
        for (var c = 0, l = rootEl.childNodes.length; c < l; c++) {
            childNodeEl = rootEl.childNodes[c];
            if (childNodeEl.nodeType === 1 && !childNodeEl.hasAttribute('data-more')) {
                itemEls.push(childNodeEl);
            }
        }
        return itemEls;
    }

    function getElPriority(el) {
        return parseInt(el.getAttribute('data-priority'), 10);
    }

    function getPrioritySortedChildNodeEls() {
        allItemEls = getItemEls();
        prioritySortedItemEls = [];
        for (var c = 0, l = allItemEls.length; c < l; c++) {
            var thisChildEl = allItemEls[c],
                thisChildPriority = getElPriority(thisChildEl) || 99;
            if (!Array.isArray(prioritySortedItemEls[thisChildPriority])) {
                prioritySortedItemEls[thisChildPriority] = [];
            }
            prioritySortedItemEls[thisChildPriority].push(thisChildEl);
        }
        prioritySortedItemEls = prioritySortedItemEls.filter(function(v) {
            return v !== undefined;
        });
    }

    function showAllElements() {
        hiddenItemEls = [];
        for (var c = 0, l = allItemEls.length; c < l; c++) {
            allItemEls[c].removeAttribute('aria-hidden');
        }
    }

    function hideElements(els) {
        hiddenItemEls = hiddenItemEls.concat(els);
        for (var c = 0, l = els.length; c < l; c++) {
            els[c].setAttribute('aria-hidden', 'true');
        }
    }

    function doesContentFit() {
        var visibleItemsWidth = 0;
        for (var c = 0, l = allItemEls.length; c < l; c++) {
            if (!allItemEls[c].hasAttribute('aria-hidden')) {
                visibleItemsWidth += allItemEls[c].offsetWidth; // Needs to take into account margins too
            }
        }
        return visibleItemsWidth <= rootEl.clientWidth;
    }

    function filter() {
        showAllElements();
        if (!doesContentFit()) {
            for (var p = prioritySortedItemEls.length - 1; p >= 0; p--) {
                hideElements(prioritySortedItemEls[p]);
                if (doesContentFit()) {
                    break;
                }
            }
        }
        dispatchCustomEvent('oPrioritisedContentFilter.change', { hiddenItems: hiddenItemEls });
    }

    function resizeHandler() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(filter, 50);
    }

    function destroy() {
        for (var c = 0, l = allItemEls.length; c < l; c++) {
            allItemEls[c].removeAttribute('aria-hidden');
        }
        window.removeEventListener('resize', resizeHandler, false);
        rootEl.removeAttribute('data-o-prioritised-content-filter-js');
    }

    rootEl.setAttribute('data-o-prioritised-content-filter-js', '');
    getPrioritySortedChildNodeEls();
    filter();
    if (options.filterOnResize) {
        window.addEventListener('resize', resizeHandler, false);
    }

    this.filter = filter;
    this.destroy = destroy;

    dispatchCustomEvent('oPrioritisedContentFilter.ready');

}

module.exports = PrioritisedContentFilter;