## Before Class...

### Watch

#### Constructing a cohesive interface

* **Cross-component Communication with Custom Events** (~50 min), <https://share.descript.com/view/Doe9dBnc5K0>
  * 00:00 - Introduction & Goal: Intercomponent Communication
  * 01:28 - Review: Built-in Browser and Leaflet Events
  * 04:20 - The Event Bus Pattern
  * 07:52 - Refactoring Event Listeners for Readability
  * 10:30 - Sending (i.e. dispatching) a custom event
  * 21:45 - Receiving (i.e., listening for) custom events
  * 28:17 - Layer groups in Leaflet
  * 35:15 - Wiring Up the Filter Logic
  * 42:02 - Debugging: Fixing Data and Logic Bugs
  * 48:28 - Styling Circle Markers & Wrap-up

* **Mockup to Implementation, part 1** ([video](https://share.descript.com/view/B0A67bzC2IP), ~57 min)
  * 00:00 - Live Coding: Bikeshare Dashboard
  * 17:54 - Geolocation API
  * 28:40 - Closures
  * 33:43 - Order of Events
  * 34:58 - Keeping Geolocation Up-to-date with watchPosition
  * 40:33 - Spoofing Your Geolocation Position
  * 42:41 - Communicating with Custom Icons

* **The Mapbox Geocoding API** ([video](https://share.descript.com/view/aBvOo8hLX16), ~38 min)
  * 00:00 - Address Search Component Overview
  * 01:41 - The Mapbox Geocoding API
  * 07:59 - API Sandboxes & Playgrounds
  * 11:22 - Existing Autocomplete Plugins for Leaflet & Mapbox GL JS
  * 13:25 - Structure of the Component
  * 14:44 - Debouncing API Requests
  * 21:28 - HTTP Request Methods
  * 23:55 - URL Query Parameters
  * 26:51 - URL Percent Encoding
  * 32:55 - Retrieving Data from the API
  * 34:33 - Modifying the UI Based on the API Response

#### Diving into visualization libraries

* **SVG vs. Canvas in Maps** (~38 min), <https://share.descript.com/view/WmAXqcbini3>
  * 00:00 - Introduction: From Data File to Shapes on Screen
  * 01:02 - Storage Formats vs Display Formats
  * 03:24 - Geospatial Data Storage Formats
  * 05:42 - Rendering as Vector (SVG) vs. Raster (Canvas)
  * 09:51 - SVG Explained
  * 16:57 - Benefits of Using SVG
  * 23:54 - Limits of SVG
  * 29:18 - How Canvas Works Under the Hood
  * 33:50 - Mapbox GL, Canvas Performance & Large Data Q&A

* **Dynamic Map Markers with SVG** ([video](https://share.descript.com/view/Xa4sLnl2bf0), ~13 min)
  * 00:00 - Dynamic Map Markers Overview
  * 01:59 - SVG Markers
  * 03:44 - Inkscape & The Noun Project for Icons
  * 07:41 - Creating the Custom Marker Icon
  * 10:42 - SVG in Charts with Billboard.js

* **The Mapbox Map Tile APIs** ([video](https://share.descript.com/view/ivykbqIRtDk), ~18 min)
  * 00:00 - Map Tile APIs Overview
  * 02:44 - Raster Web Map Tile Representation
  * 12:23 - Vector Web Map Tile Representation

* **Tools in the D3 Toolbox**, _Coming Soon!_

### Practice

* JavaScript Exercises
  * Choose one or two of the **Part 3 - Combining Data** exercises in the [Data in JavaScript Exercises](https://github.com/Weitzman-MUSA-JavaScript/data-in-js-exercises/) repository.

    > **AI recommendation: EXPLORE** -- The exercises in this repository don't all have a single correct solution, but any AI agent will be able to come up with _some_ solution. I recommend attempting the exercises on your own.
    >
    > However, each exercise comes with some pre-existing instructional comments and scaffolding code. If you are going to use AI for anything, I recommend that you use the `/student-explore` skill to understand what the existing code does.

## In Class...

* Practical Asynchronous JS (by example)
  * UI Events
  * Loading Data & APIs
  * Geolocation

## References

* Bikeshare dashboard [mockup for the live-coding](https://github.com/mjumbewu/dashboard-project/tree/2024-bikeshare/mockup)
* The Noun Project - <https://thenounproject.com/>
  * "Bike" icon by [Yosua Bungaran](https://thenounproject.com/creator/yosuabungaran/) - <https://thenounproject.com/icon/bike-7149629/>
* Mapbox raster tiles in Leaflet maps - [../resources/webmap-tips.md](../resources/webmap-tips.md)
* FreeCodeCamp D3 Resources: <https://www.freecodecamp.org/learn/data-visualization/>
* Observable HQ (like Jupyter Notebooks for JS): <https://observablehq.com/>
* D3 Graph Gallery (for starter graphs): <https://d3-graph-gallery.com/>
