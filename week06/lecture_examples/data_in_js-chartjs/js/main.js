import { initMap } from "./stations_map.js";
import { initChart } from "./stations_chart.js";
import { loadStationsData } from "./stations_data.js";

// Load neighborhood and station data...
const { hoods, stations } = await loadStationsData();

// Create the map...
const mapEl = document.querySelector("#map");
const map = initMap(mapEl, hoods, stations);

// Create a chart of station densities...
const chartEl = document.querySelector("#chart canvas");
const chart = initChart(chartEl, hoods, stations);

// Expose the data and visualizations to the global
// scope for easier debugging in the console...
Object.assign(window, { hoods, stations, map, chart });