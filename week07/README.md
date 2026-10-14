## Before Class...

### Watch

#### Constructing a cohesive interface

- **Cross-component Communication with Custom Events** (~50 min), <https://share.descript.com/view/Doe9dBnc5K0>
  - 0:00 - Introduction & Goal: Intercomponent Communication
  - 1:28 - Review: Built-in Browser and Leaflet Events
  - 4:20 - The Event Bus Pattern
  - 7:52 - Refactoring Event Listeners for Readability
  - 10:30 - Sending (i.e. dispatching) a custom event
  - 21:45 - Receiving (i.e., listening for) custom events
  - 28:17 - Layer groups in Leaflet
  - 35:15 - Wiring Up the Filter Logic
  - 42:02 - Debugging: Fixing Data and Logic Bugs
  - 48:28 - Styling Circle Markers & Wrap-up

#### Diving into visualization libraries

- **SVG vs. Canvas in Maps** (~38 min), <https://share.descript.com/view/WmAXqcbini3>
  - 0:00 - Introduction: From Data File to Shapes on Screen
  - 1:02 - Storage Formats vs Display Formats
  - 3:24 - Geospatial Data Storage Formats
  - 5:42 - Rendering as Vector (SVG) vs. Raster (Canvas)
  - 9:51 - SVG Explained
  - 16:57 - Benefits of Using SVG
  - 23:54 - Limits of SVG
  - 29:18 - How Canvas Works Under the Hood
  - 33:50 - Mapbox GL, Canvas Performance & Large Data Q&A

- **Tools in the D3 Toolbox**, _Coming Soon!_

<!--
## References

- Points Unkown Story Map Tutorial - https://pointsunknown.nyc/web%20mapping/mapbox/2020/04/15/11_MapboxStorytelling.html
-->

### Practice

- JavaScript Exercises
  - Choose one or two of the **Part 3 - Combining Data** exercises in the [Data in JavaScript Exercises](https://github.com/Weitzman-MUSA-JavaScript/data-in-js-exercises/) repository.

    > **AI recommendation: EXPLORE** -- The exercises in this repository don't all have a single correct solution, but any AI agent will be able to come up with _some_ solution. I recommend attempting the exercises on your own.
    >
    > However, each exercise comes with some pre-existing instructional comments and scaffolding code. If you are going to use AI for anything, I recommend that you use the `/student-explore` skill to understand what the existing code does.

## In Class...

- The various ways we can load modules
  - Using `<script src="..."></script>` in an HTML file -- Ideal for older libraries that don't use the ES module syntax
  - Using `<script src="..." type="module"></script>` in an HTML file -- Ideal for our code that uses ES module syntax
  - Using `import * from 'https://...';` in a JS module -- Ideal when:
    - We're loading newer libraries that do use ES module syntax, and are hosted on a CDN
    - We're writing a quick script and still working out the dependencies
  - Using `<script type="importmap">...</script>` and `import * from '...';` -- Ideal when:
    - We're loading newer libraries that do use ES module syntax, and are hosted on a CDN
    - We've worked out what our dependencies should be
  - Using `npm install ...` and `import * from '...';` -- Ideal when we're using a build system, like vite
- Practical Asynchronous JS (by example)
  - UI Events
  - Loading Data & APIs
  - Geolocation

## References

- Mapbox raster tiles in Leaflet maps - [../resources/webmap-tips.md](../resources/webmap-tips.md)