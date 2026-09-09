import { gbfsStationToFeature } from './indego.js';

// Create a Leaflet Map
const mapElement = document.querySelector('#map');
const map = L.map(mapElement, { zoomSnap: 0, }).setView([39.95, -75.16], 12);

// Load neighborhood data in GeoJSON format
const hoodsResponse = await fetch('data/philadelphia-neighborhoods.geojson');
const hoodsData = await hoodsResponse.json();
const hoodsLayer = L.geoJSON(hoodsData)
  .bindTooltip((layer) => {
    const name = layer.feature.properties.MAPNAME;
    const density = layer.feature.properties.stationDensity !== undefined ? 
      layer.feature.properties.stationDensity.toFixed(2) :
      '(loading...)';

    return `
      <dl>
        <dt>Neighborhood</dt>
        <dd>${name}</dd>

        <dt>Station Density (stations per sq km)</dt>
        <dd>${density}</dd>
      </dl>
    `;
  })
  .addTo(map);

// Fit the map to the bounds of the neighborhoods layer
const hoodsBounds = hoodsLayer.getBounds();
map.fitBounds(hoodsBounds, { padding: [20, 20] });

// Load station data in GBFS format
const stationsFeedUrl = 'https://gbfs.bcycle.com/bcycle_indego/station_information.json';
const stationsResponse = await fetch(stationsFeedUrl);
const stationsData = await stationsResponse.json();

// Convert GBFS station data to GeoJSON features
const stationsFeatures = stationsData.data.stations.map(gbfsStationToFeature);
const stationsLayer = L.geoJSON(stationsFeatures, {
  pointToLayer: (feature, latlng) => {
    return L.circleMarker(latlng, { radius: 2, stroke: false, fillOpacity: 1, fillColor: 'black' });
  }
}).addTo(map);

// Pre-calculating the station density for each neighborhood
hoodsData.features.forEach((hoodFeature) => {
  const areaSqKm = turf.area(hoodFeature) / 1e6;
  const stationsFeaturesInHood = stationsFeatures.filter((stationFeature) => {
    return turf.booleanPointInPolygon(stationFeature, hoodFeature);
  });
  const stationCount = stationsFeaturesInHood.length;
  const stationDensity = stationCount / areaSqKm;

  Object.assign(hoodFeature.properties, {
    areaSqKm,
    stationCount,
    stationDensity,
  });
});

Object.assign(window, {
  map,
  hoodsData,
  stationsData,
  stationsFeatures,
  gbfsStationToFeature,
});
