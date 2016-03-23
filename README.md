# o-squishy-list [![Build Status](https://circleci.com/gh/Financial-Times/o-squishy-list.png?style=shield&circle-token=ee4f1c6916b8eccede740336aca671173da8f2b5)](https://circleci.com/gh/Financial-Times/o-squishy-list)

Hides lowest priority items when space does not allow.

## Construction

Given a root HTML element, __o-squishy-list__ will assume each immediate element child is a _content item_.

## Declaring content item priorities

The _content items_ should be given a `data-priority` attribute containing a positive integer to indicate its priority with regard to display. The lower the number the higher the priority. Low-priority items will be hidden first, high-priority items will be hidden last.

Priority numbers do not have to start from 1 or be consecutive: the values `20`, `34`, `80` are valid and express the same relative priorities as `1`, `2`, `3`.

Where multiple items share the same priority number, they will be hidden or shown at the same time. This allows declarative configuration of the behaviour - either all items hiding and showing at once, or each item hiding and showing individually - or a combination of the two.

If an item doesn't have a `data-priority` attribute, then it will be treated as lower priority than the lowest explicitly-set priority. Therefore if no items have the attribute, they will _all_ hide and show together.

An example with four items using three levels of priority (the last item will be assumed to be priority 3):

```html
<ul>
    <li data-priority="2">Medium priority item</li>
    <li data-priority="1">High priority item</li>
    <li data-priority="2">Medium priority item</li>
    <li>Low priority item</li>
</ul>
```

Sometimes you might want a particular content item to never be hidden. You can do this by setting its priority to `-1` to remove it from the priorities list.

### More

If some cases you might want a 'more' item which will only show when content has been hidden due to insufficient space. Simply add another `<li>` with a `data-more` attribute. It should also have a `aria-hidden="true"` attribute:

```html
<ul>
    <li data-priority="2">Medium priority item</li>
    <li data-priority="1">High priority item</li>
    <li data-priority="2">Medium priority item</li>
    <li>Low priority item</li>
    <li data-more aria-hidden="true">More</li>
</ul>
```

When a _More_ item element is present, sufficient _content items_ will be hidden to make space for it to show. The width of the _More_ item should not be allowed to change, as only the initial width is used for the content filtering calculations.

The __More__ item will not be hidden, even if there is not sufficient space for it to show.

### Hiding items manually

If you need to hide a list item manually via CSS or JS, you need to add the data-attribute `data-o-squishy-list--ignore` to that item. This way, `o-squishy-list` will stop adding that item to its item list.

```html
<ul class="drop-off">
    <li data-priority="2" data-o-squishy-list--ignore="true">Ignore me</li>
    <li data-priority="1">Priority 1</li>
    <li data-priority="3">Priority 3</li>
    <li>No priority</li>
</ul>
```

## Styling

The root element should have minimum and maximum widths set.

In order to calculate the total width required, items must be set to `display: inline-block` or `float: left`.

### Primary and core experience

When the JS has run, a `data-o-squishy-list-js` attribute will be set on the root element. This can be used in CSS selectors to target primary or core.

For core experience, it is recommended to style content items so that they can all be accessible when they are shown - e.g. via wrapping or scrolling.

The `data-priority` attributes could also be used in CSS selectors if you wanted to only show high-priority items in the core experience:

```css
nav li:not([data-priority='1']) {
    display: none;
}
```

## Javascript

### Construction

No code will run automatically.

An __o-squishy-list__ object must be constructed for each container you want to filter.

```javascript
var oSquishyList = require('o-squishy-list');

var nav = new oSquishyList(document.getElementsByTagName('ul'));
```

A optional second argument can be passed, containing a configuration object, with the following possible properties:

* `filterOnResize` (boolean, default `true`) - if `true` will listen for the `window.resize` event and automatically call `.squish()`

### Methods

* `squish()` Hide items of lowest priority that don't currently fit into the available width.
* `getHiddenItems()` Returns a list of the currently hidden item elements.
* `getRemainingItems()` Returns a list of the currently remaining item elements.
* `destroy()` Unbind events, un-hide items etc.

### Events

This module will dispatch the following events on its root element:

* `oSquishyList.ready` - when the object has constructed.
* `oSquishyList.change` - when the item(s) in view change - e.g. items have been hidden or shown. The event object will contain the following properties:
    * `detail.hiddenItems` - array of the hidden item elements. This will be an empty array when all items are shown. The _more_ item will not be included in this array.
    * `detail.remainingItems` - array of the remaining item elements. This will be an empty array when all items are hidden. The _more_ item will not be included in this array.

A common use-case for this module is a variable-width navigation, where as the available space narrows, navigation items 'drop off' and are added to an expanded 'drop-down' menu.

To achieve this, products should listen to the `oSquishyList.change` event, and use the included list of hidden items to determine what to add to the expandable drop-down menu.

For example:

```javascript
document.getElementsByTagName('ul')[0].addEventListener('oSquishyList.change', function(ev) {
    if (ev.detail.hiddenItems.length > 0) {
        // Loop through ev.detail.hiddenItems array
        // Extract the useful data from each element & add it to the More Menu
    }
}, false);
```

----

## License

Copyright (c) 2016 Financial Times Ltd. All rights reserved.

This software is published under the [MIT licence](http://opensource.org/licenses/MIT).
