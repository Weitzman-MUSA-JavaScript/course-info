import { initHoodsSelect } from './hoods_select.js';
import { initMap } from './stations_map.js';
import { loadStationsData } from './stations_data.js';

/*
Custom event types:
~~~~~~~~~~~~~~~~~~~
- neighborhoodselected: emitted when a neighborhood is (un)selected in list.
  Detail: {
    name (string): name of the neighborhood
    selected (boolean): whether the neighborhood is selected or not
  }
*/
const events = new EventTarget();

// Load neighborhood and station data...
const { hoods, stations } = await loadStationsData();

// Create the neighborhood select...
const hoodListEl = document.querySelector('#neighborhoods');
initHoodsSelect(hoodListEl, hoods, events);

// Create the map...
const mapEl = document.querySelector("#map");
const map = initMap(mapEl, hoods, stations, events);
