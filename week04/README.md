## Before Class...

### Watch

- **Introduction to CSS Layouts** - ([video](https://share.descript.com/view/epmjwwWCJPj), ~44 min)
  - 00:00 — Introduction: Layout Frameworks in CSS
  - 00:24 — The Box Model
  - 03:20 — Block Elements
  - 09:38 — Box Sizing: content-box vs. border-box
  - 14:04 — Inline Elements
  - 19:35 — The Flexbox Framework
  - 28:11 — Grid Framework
  - 29:15 — CSS Positioning: Static & Relative
  - 32:34 — CSS Positioning: Absolute
  - 34:31 — CSS Positioning: Fixed
  - 37:06 — CSS Positioning: Sticky
- **Working with Data in JavaScript (pt. 1)** -- ([video](https://share.descript.com/view/OWy4U1lVLmb), 131 min -- _PLEASE WATCH THIS AT 1.5x SPEED, IT'S SO LONG 😭_)
  - 0:00 - Introduction: Why Transform Data in JavaScript
  - 1:54 - Exploring the Datasets: Indego GBFS & Philly Neighborhoods
  - 6:59 - Project Setup: HTML/CSS Scaffolding
  - 21:44 - Initializing the Leaflet Map
  - 26:40 - Fetching & Rendering Neighborhood GeoJSON
  - 38:44 - Understanding Data Standards: GBFS & GTFS
  - 46:52 - Converting GBFS Stations to GeoJSON Features
  - 1:03:56 - Debugging a JavaScript Error
  - 1:13:43 - Styling Station Markers
  - 1:17:31 - Adding Tooltips: Name & Density
  - 1:25:14 - Calculating Area with Turf.js
  - 1:37:15 - Spatial Join: Filtering Stations by Neighborhood
  - 1:47:42 - Pre-calculating Density with forEach
  - 1:57:31 - Handling Missing/Async Data Gracefully
  - 2:05:28 - Fitting Map Bounds & Wrap-up
- **Responding to User Events in JavaScript** -- ([video](https://share.descript.com/view/X22VUMWF8Nl), ~35 min)
  - 0:00 — Introduction: From Framework Interactivity to Custom Events
  - 0:28 — Types of JavaScript Events
  - 1:56 — Two Ways to Attach Event Handlers
  - 2:09 — HTML Attributes Event Handlers
  - 9:46 — JavaScript Object Property Event Handlers
  - 16:37 — The addEventListener Function
  - 19:31 — Note #1: The style Property in JS
  - 21:39 — Note #2: Accessing the Interacted Element from an Event Handler
  - 27:20 — Note #3: Calling vs. Referencing Functions
- **SVG, Canvas, and Map Accessibility** - _Coming Soon_

### Practice

* JavaScript Exercises
  * Try to get through **part 4** of the JavaScript [exercises repository](https://github.com/Weitzman-MUSA-JavaScript/intro-js-exercises).

    > **AI recommendation: DISABLE** -- The exercises in this repository will be absolutely trivial for any AI agent to complete, but that is so far from the point. The goal is for you to start getting comfortable thinking in JavaScript. **I recommend entirely disabling any AI assistance, even auto-complete, while working through these exercises.**

## In Class...

### Review

* **JavaScript Exercises** -- We will review the **functions as values** (i.e. higher-order functions) exercise from the JavaScript [exercises repository](https://github.com/Weitzman-MUSA-JavaScript/intro-js-exercises).
* **Narrative Project Close-out Prep** -- Next week you'll be introduced to a new project. Let's review opening a pull request, and linting your work.

### Practice

In this exercise you'll build on the choropleth map that you created in the previous class. Imagine that the map is a part of a dashboard that you are creating for the commonwealth's election commission. They want users to be able to not just see the data on the map, but also to be able to click on a given county and see more detailed information about the election results for that county in a separate panel.

In the https://github.com/Weitzman-MUSA-JavaScript/pa-county-election-results repository under the layout-exercise branch you can see a mostly unstyled version of this. Check out this repository and update the layout of this page to:

1. on full screen monitors, have the map take up about 2/3 of the width of the screen and the details panel take up about 1/3 of the width of the screen. The details panel should be to the right of the map. (for an extra challenge, make the info panel "hover" over the map with space on the top, right, and bottom)
2. on smaller screens (e.g. tablets), have the map take up the full width, and half the height of the screen, with the details panel below it taking up the full width and half the height of the screen.

## References

- MDN Inline Elements - https://developer.mozilla.org/en-US/docs/Web/HTML/Element#inline_text_semantics _(Anything else on that page that's not in the inline text semantics section is a block-level element)_
- Flexbox Froggy - https://flexboxfroggy.com/
- Digital Ocean Flexbox Cheat Sheet - https://www.digitalocean.com/community/cheatsheets/css-flexbox
- CSS Tricks Flexbox Guide - https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- Grid Garden - https://cssgridgarden.com/
- Digital Ocean Grid Layout Intro - https://www.digitalocean.com/community/tutorials/css-css-grid-layout-intro
- Design Patterns for Effective Map UX - https://www.mapuipatterns.com/
- [Minnesota Accessibility Guide for Interactive Web Maps](https://mn.gov/mnit/assets/Accessibility%20Guide%20for%20Interactive%20Web%20Maps_tcm38-403564.pdf)
- [Leaflet Accessible Maps Tips](https://leafletjs.com/examples/accessibility/)