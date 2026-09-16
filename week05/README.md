## Before Class

### Watch

- **The importance of well-structured code:** _Is Designing Different to Coding?_, ([Modern Software Engineering on YouTube](https://www.youtube.com/watch?v=aPSk2f3Vkz0), ~20 min)
- **Manipulating the DOM** (~78 min), <https://share.descript.com/view/1QidFjqvf1V>
  - 0:00 – Introduction to DOM Manipulation
  - 5:43 – Example: Building a Dynamic Neighborhood List
  - 14:12 – Using innerHTML
  - 23:41 – Input elements
  - 27:23 – Getting Checkbox Values
  - 28:49 – Selecting Checked Checkboxes with querySelectorAll
  - 32:09 – Sorting the List Alphabetically
  - 36:31 – Wiring Up the Search Input
  - 43:37 – Listening for Input Events (change vs. input)
  - 47:33 – Filtering the Neighborhood List
  - 54:23 – Question: Watch Variables
  - 56:59 – Question: Using dot vs. square brackets for attribute lookup
  - 58:48 – Question: The neighborhoods dataset
  - 1:01:38 – Case-Insensitive Search
  - 1:05:21 – Preserving Checkbox State with Cached List Items

<!-- - Dashboards Discussion (**optional, as we will discuss on Wednesday**; recorded from 2024 in-class discussion) ([video](https://share.descript.com/view/cEFZytGb1mr), ~45 min) -->

#### Wireframing a Dashboard

- Wireframing a Dashboard (part 1 - Sketching the Idea) ([video](https://share.descript.com/view/xhgonTkkpix), ~17 min)

### Practice

- JavaScript Exercises
  - Fork [DOM Exercises](https://github.com/Weitzman-MUSA-JavaScript/dom-exercises) repository. Follow the instructions in the comments in [exercises/js/index.js](https://github.com/Weitzman-MUSA-JavaScript/dom-exercises/blob/main/exercises/js/index.js) to select and manipulate the Document Object Model (DOM) elements. Refer to the document structure in [exercises/index.html](https://github.com/Weitzman-MUSA-JavaScript/dom-exercises/blob/main/exercises/index.html).

    > **AI recommendation: DISABLE** -- The exercises in this repository will be relatively trivial for any AI agent to complete. **I recommend entirely disabling any AI assistance, even auto-complete, while working through these exercises.**

  - Choose one or two of the **Part 1: Accessing Data** exercises in the [Data in JavaScript Exercises](https://github.com/Weitzman-MUSA-JavaScript/data-in-js-exercises/) repository.

    > **AI recommendation: EXPLORE** -- The exercises in this repository don't all have a single correct solution, but any AI agent will be able to come up with _some_ solution. I recommend attempting the exercises on your own.
    >
    > However, each exercise comes with some pre-existing instructional comments and scaffolding code. If you are going to use AI for anything, I recommend that you use the `/student-explore` skill to understand what the existing code does.

## In Class

### Practice

#### Wireframing

In this exercise you'll build on the choropleth map that you created in the previous class. Imagine that the map is a part of a dashboard that you are creating for the commonwealth's election commission. They want users to be able to not just see the data on the map, but also to be able to click on a given county and see more detailed information about the election results (such as a chart showing the distribution of votes for different candidates, or the history of election outcomes) for that county in a separate panel.

1. Choose a layout from <https://www.mapuipatterns.com/>
2. Create a mock up of the dashboard that includes the map and a panel that shows detailed information about the selected county.

## References

- Designing for Users
  - [18F User Stories Method Card](https://guides.18f.org/methods/decide/user-stories/)
  - [18F Wireframing Method Card](https://guides.18f.org/methods/make/wireframing/)
  - [18F Prototyping Method Card](https://guides.18f.org/methods/make/prototyping/)

<!--

- Leaflet Docs - GeoJSON pointToLayer Option, https://leafletjs.com/reference.html#geojson-pointtolayer
- Leaflet Examples - Custom Icons, https://leafletjs.com/examples/custom-icons/
- Leaflet Docs - Icon, https://leafletjs.com/reference.html#icon
- Leaflet Docs - Path Options, https://leafletjs.com/reference.html#path-option
- The Noun Project - https://thenounproject.com/
  - Bike marker icon derived from: _Bike_ by Yosua Bungaran from <a href="https://thenounproject.com/browse/icons/term/bike/" target="_blank" title="Bike Icons">Noun Project</a> (CC BY 3.0)

-->