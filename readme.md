o-prioritised-content-filter [![Build Status](https://travis-ci.org/Financial-Times/o-prioritised-content-filter.png?branch=master)](https://travis-ci.org/Financial-Times/o-prioritised-content-filter)
=======

Hides lowest priority items when space does not allow.

## Construction

Given a root HTML element, __o-prioritised-content-filter__ will assume each immediate element child is a _content item_. 

The content items should be given a `data-priority` attribute containing a positive integer to indicate its priority with regard to display. Low-priority items will be hidden first, high-priority items will be hidden last.

Where multiple items share the same priority number, they will all be hidden or shown together.

If an item doesn't not have a `data-priority` attribute, then it will be given a priority of `99`. Therefore if no items have the attribute, they will all hide and show together.

An example with four items using three levels of priority:

```html
<ul>
    <li data-priority="2">Medium priority item</li>
    <li data-priority="1">High priority item</li>
    <li data-priority="2">Medium priority item</li>
    <li>Low priority item</li>
</ul>
```

## Styling

In order to calculate the total width required, items must be set to `display: inline-block` or `float: left`.

## Core experience

It is recommended to style content items so that they can all be accessible when they are shown - e.g. via wrapping or scrolling.

## Events

This module will dispatch the following events on its root element:

* `oPrioritisedContentFilter.change` - when the item(s) in view change - e.g. items have been hidden or shown.
    * The `detail.hiddenItems` property of the event object will contain an array of the hidden item elements. This will be an empty array when all items are shown.

