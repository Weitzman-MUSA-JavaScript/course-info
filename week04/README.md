## Before Class...

### Watch

- Introduction to CSS Layouts - ([video](https://share.descript.com/view/epmjwwWCJPj), ~44 min)
- Responding to User Events in JavaScript -- ([video](https://share.descript.com/view/X22VUMWF8Nl), ~35 min)
- SVG, Canvas, and Map Accessibility - _Coming Soon_

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