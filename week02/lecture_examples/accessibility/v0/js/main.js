import * as L from 'https://cdn.skypack.dev/leaflet@1.9.4';
import * as csv from 'https://cdn.skypack.dev/csv-parse@5.5.0/sync.js';
import * as d3ScaleChromatic from 'https://cdn.skypack.dev/d3-scale-chromatic@3';

const d3 = {
  ...d3ScaleChromatic,
};

//
// Create the map object and a base tile layer.
//

/**
 * Create the map object and a base tile layer.
 *
 * @return {L.Map} The map
 */
function initMap() {
  const map = L.map('map', {preferCanvas: true, zoomSnap: 0, zoomDelta: 0.5}).setView([39.99, -75.15], 11);

  L.tileLayer('https://api.mapbox.com/styles/v1/{username}/{styleId}/tiles/{tileSize}/{z}/{x}/{y}{r}?access_token={apiKey}', {
    username: 'mapbox',
    styleId: 'light-v11',
    tileSize: 512,
    zoomOffset: -1,
    apiKey: 'pk.eyJ1IjoibWp1bWJlLXRlc3QiLCJhIjoiY2w3ZTh1NTIxMTgxNTQwcGhmODU2NW5kaSJ9.pBPd19nWO-Gt-vTf1pOHBA',

    // Standard Mapbox attribution from https://docs.mapbox.com/help/getting-started/attribution/#other-mapping-frameworks
    attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
  }).addTo(map);

  return map;
}

//
// Download geographic and demographic data.
//

/**
 * Download and index the demographic data as a CSV. Each record of the CSV
 * contains the census variables P10_001N - P10_009N, followed by information
 * to construct a GeoID (state, county, tract, and blockgroup).
 *
 * @return {object} An object literal mapping from Census GEOIDs to arrays of
 *                  demographic values.
 */
async function downloadDemographicData() {
  const dmgResp = await fetch('../data/phl_blockgroup_dmg.csv');
  const dmgText = await dmgResp.text();
  const dmgRows = csv.parse(dmgText, {
    columns: false, // Don't generate object literals -- just use arrays
    from_line: 2, // Skip the first line (the header)
  });

  const dmgByGeoid = {};
  for (const row of dmgRows) {
    const [state, county, tract, bg] = row.slice(row.length - 4);
    const geoid = `${state}${county}${tract}${bg}`;
    dmgByGeoid[geoid] = row.slice(0, row.length - 4);
  }

  return dmgByGeoid;
}

/**
 * Download Philadelphia Census geography GeoJSON.
 *
 * @return {FeatureCollection} A feature collection representing blockgroup
 *                             geographies in Philadelphia.
 */
async function downloadGeographicData() {
  const geoResp = await fetch('../data/phl_blockgroups.geojson');
  const geoJson = await geoResp.json();

  return geoJson;
}

//
// Create the JSON layer
//

const RACE_LABELS = [
  'White',
  'Black or African American',
  'American Indian and Alaska Native',
  'Asian',
  'Native Hawaiian and Other Pacific Islander',
  'Some Other Race',
  'Two or More Races',
];

/**
 * Find the maximal item in an array, according to some key function.
 *
 * @param {Array} arr The array to search through
 * @param {Function} fn Optional. The key function to construct comparable
 *                      values. If not specified, the value of the array items
 *                      themselves will be compared.
 * @return {object} An object with the maximal item, the item's index, and the
 *                  compared value.
 */
function maximal(arr, fn) {
  let maxInfo = null;
  for (const [index, item] of arr.entries()) {
    const value = fn ? fn(item) : item;

    if (maxInfo === null || value > maxInfo.value) {
      maxInfo = { value, item, index };
    }
  }
  return maxInfo;
}

/**
 * Get the GeoID of a given blockgroup.
 *
 * @param {Feature} feature A feature representing the Census blockgroup
 * @return {string} The GeoID of the blockgroup.
 */
function getGeoID(feature) {
  return feature.properties['GEOID'];
}

/**
 * Calculate demographic summary information for a given blockgroup record.
 *
 * @param {Array} dmgRow An array of demographic information, as loaded
 *                       from a CSV
 * @return {object} An object with demographic summary information
 */
function getDemographicSummary(dmgRow) {
  const [totalPop, , ...racePops] = dmgRow.map((x) => 1 * x);

  if (totalPop <= 2) {
    return null;
  }

  const {value: largestRacePop, index: largestRaceIndex} = maximal(racePops);
  const largestRaceLabel = RACE_LABELS[largestRaceIndex];
  return {
    totalPop,
    largestRacePop,
    largestRaceIndex,
    largestRaceLabel,
  };
}

let THRESHOLD = 0.5;

/**
 * Construct a path options object for use in styling GeoJSON features.
 *
 * @param {Feature} feature A Census blockgroup feature
 * @param {Array} dmgData Census demographic data, indexed on GeoID
 * @return {object} Path options for a GeoJSON feature style
 */
function calcFeatureStyle(feature, dmgData) {
  const colors = d3.schemeCategory10;

  const geoid = getGeoID(feature);
  const record = dmgData[geoid];
  const summary = getDemographicSummary(record);

  if (summary === null) {
    return {
      fill: false,
      stroke: false,
    };
  }

  const largestRacePortion = 1.0 * summary.largestRacePop / summary.totalPop;
  const minSegregatedPortion = THRESHOLD;

  const color = colors[summary.largestRaceIndex];
  const opacity = Math.max(0, (largestRacePortion - minSegregatedPortion) / (1 - minSegregatedPortion));

  return {
    fillColor: color,
    fillOpacity: opacity,
    stroke: true,
    opacity: opacity / 2,
    color: color,
    weight: 1,
  };
}

function initDataLayer(geoData, dmgData) {
  const dataLayer = L.geoJSON(geoData, {
    style: (f) => calcFeatureStyle(f, dmgData),
  });

  dataLayer.bindTooltip((l) => {
    const geoid = getGeoID(l.feature);
    const row = dmgData[geoid];
    const summary = getDemographicSummary(row);

    return summary === null ? 'No statistics<br>available' : `
      ${(summary.largestRacePop * 100.0 / summary.totalPop).toFixed(1)}% ${summary.largestRaceLabel}<br>
      (out of ${summary.totalPop} adults)
    `;
  });

  dataLayer.on('tooltipopen', (evt) => {
    evt.layer.setStyle({
      stroke: true,
      weight: 2,
      color: 'gray',
      opacity: 1,
    });
  });

  dataLayer.on('tooltipclose', (evt) => {
    dataLayer.resetStyle();
  });

  return dataLayer;
}

/**
 * This zip function (generator) operates like the Python zip function.
 * https://docs.python.org/3/library/functions.html#zip
 *
 * @param  {...Array} arrays One or more arrays to combine
 * @yield  Array
 */
function* zip(...arrays) {
  const minLength = Math.min(...arrays.map((arr) => arr.length));

  for (let i = 0; i < minLength; ++i) {
    yield arrays.map((arr) => arr[i]);
  }
}

function initLegend() {
  const legend = L.control({position: 'bottomright'});

  legend.onAdd = (map) => {
    const div = L.DomUtil.create('div', 'info legend');
    const races = RACE_LABELS;
    const colors = d3.schemeCategory10;

    // Loop through the races and generate a label and colored square for each
    div.innerHTML = `
      <h2>Racial Classifications</h2>

      <ul class="legend-entries">
        ${[...zip(races, colors)].map(([race, color]) => `
          <li class="legend-entry">
            <span class="legend-icon" style="background-color: ${color};"></span>
            <span class="legend-label">${race.replace(/ /g, '&nbsp;')}</span>
          </li>
        `).join(' ')}
      </ul>

      <p class="legend-description"><em>
        A census block group will only be visible if the percentage of the total
        population within that block group is dominated (above a threshold) by a
        single racial classification.
      </em></p>

      <h2>Majority Threshold: <span id="majority-threshold-display">50%</span></h2>
      <input id="majority-threshold" type="range" min="0" max="100" value="50">
    `;

    const thresholdInput = div.querySelector('#majority-threshold');
    const thresholdDisplay = div.querySelector('#majority-threshold-display');
    thresholdInput.addEventListener('mousedown', (evt) => evt.stopPropagation());
    thresholdInput.addEventListener('touchstart', (evt) => evt.stopPropagation());
    thresholdInput.addEventListener('input', () => {
      THRESHOLD = thresholdInput.value / 100.0;
      thresholdDisplay.innerHTML = `${thresholdInput.value}%`;
      dataLayer.resetStyle();
    });

    return div;
  };

  return legend;
}

const map = initMap();
const [geoData, dmgData] = await Promise.all([
  downloadGeographicData(),
  downloadDemographicData(),
]);
const dataLayer = initDataLayer(geoData, dmgData);
const legend = initLegend();

legend.addTo(map);
dataLayer.addTo(map);
map.flyToBounds(dataLayer.getBounds(), {duration: 1});

Object.assign(window, {
  map,
  geoData,
  dmgData,
  dataLayer,
  d3,
});
