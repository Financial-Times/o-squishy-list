o-prioritised-content-filter [![Build Status](https://travis-ci.org/Financial-Times/o-prioritised-content-filter.png?branch=master)](https://travis-ci.org/Financial-Times/o-prioritised-content-filter)
=======

Hides lowest priority items when space does not allow.

## Construction

Given a root HTML element, __o-prioritised-content-filter__ will assume each immediate element child is a _content item_. 

The _content items_ should be given a `data-priority` attribute containing a positive integer to indicate its priority with regard to display. The lower the number the higher the priority. Low-priority items will be hidden first, high-priority items will be hidden last.

Priority numbers do not have to start from 1 or be consecutive: the values `20`, `34`, `80` are valid and express the same relative priorities as `1`, `2`, `3`.

Where multiple items share the same priority number, they will be hidden or shown at the same time. This allows declarative configuration of the behaviour - either all items hiding and showing at once, or each item hiding and showing individually - or a combination of the two.

If an item doesn't not have a `data-priority` attribute, then it will be treated as lower priority than the lowest explicitly-set priority. Therefore if no items have the attribute, they will _all_ hide and show together.

An example with four items using three levels of priority:

```html
<ul>
    <li data-priority="2">Medium priority item</li>
    <li data-priority="1">High priority item</li>
    <li data-priority="2">Medium priority item</li>
    <li>Low priority item</li>
</ul>
```

In this example, the last item is in effect treated as priority `3`.

## Styling

The root element should have minimum and maximum widths set.

In order to calculate the total width required, items must be set to `display: inline-block` or `float: left`.

## Construction

No code will run automatically.

An __o-prioritised-content-filter__ object must be constructed for each container you want to filter.

```javascript

var oPrioritisedContentFilter = require('o-prioritised-content-filter');

var nav = new oPrioritisedContentFilter(document.getElementsByTagName('ul'));
```

A optional second argument can be passed, containing a configuration object, with the following possible properties:

* `filterOnResize` (boolean, default `true`) - if `true` will listen for the `window.resize` event and automatically call `.filter()`

### Primary and core experience

When the JS has run, a `data-o-prioritised-content-filter-js` attribute will be set on the root element. This can be used to in CSS selectors to target primary or core.

For core experience, it is recommended to style content items so that they can all be accessible when they are shown - e.g. via wrapping or scrolling.

The `data-priority` attributes could also be used in CSS selectors if you wanted to only show high-priority items in the core experience:

```css
nav li:not([data-priority='1']) {
    display: none;
}
```


## Javascript

### Methods

* `filter()` Hide items of lowest priority that don't currently fit into the available width.
* `destroy()` Unbind events, un-hide items etc.

### Events

This module will dispatch the following events on its root element:

* `oPrioritisedContentFilter.ready` - when the object has constructed.
* `oPrioritisedContentFilter.change` - when the item(s) in view change - e.g. items have been hidden or shown.
    * The `detail.hiddenItems` property of the event object will contain an array of the hidden item elements. This will be an empty array when all items are shown.

A common use-case for this module is a variable-width navigation, where as the available space narrows, navigation items 'drop off' and are added to an expanded 'drop-down' menu.

To achieve this, products should listen to the `oPrioritisedContentFilter.change` event, and use the included list of hidden items to determine what to add to the expandable drop-down menu - which should be outside the __o-prioritised-content-filter__ root element.

For example:

```javascript
document.getElementsByTagName('ul')[0].addEventListener('oPrioritisedContentFilter.change', function(ev) {
    if (ev.detail.hiddenItems.length > 0) {
        // Loop through ev.detail.hiddenItems array
        // Extract the useful data from each element & add it to the More Menu
    }
}, false);
```