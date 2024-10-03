import { initMap } from "./stations_map.js";
import { initChart } from "./stations_chart.js";
import { loadStationsData } from "./stations_data.js";

// Load neighborhood and station data...
const { hoods, stations } = await loadStationsData();

// Create the map...
const mapEl = document.querySelector("#map");
const map = initMap(mapEl, hoods, stations);

// Create a chart of station densities...
const chartEl = document.querySelector("#chart");
const chart = initChart(chartEl, hoods, stations);
