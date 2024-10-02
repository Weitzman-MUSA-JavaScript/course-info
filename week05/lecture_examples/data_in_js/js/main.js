import * as turf from 'https://cdn.jsdelivr.net/npm/@turf/turf@7.1.0/+esm';

const mapEl = document.querySelector('#map');
const map = L.map(mapEl);

// Add neighborhoods to map...
const hoodsResponse = await fetch('data/philadelphia-neighborhoods.geojson');
const hoodsCollection = await hoodsResponse.json();
const hoodsLayer = L.geoJSON(hoodsCollection);

hoodsLayer.addTo(map);
map.fitBounds(hoodsLayer.getBounds());

// Add bikeshare stations to map...
const stationsResponse = await fetch('https://gbfs.bcycle.com/bcycle_indego/station_information.json');
const stationsData = await stationsResponse.json();

function gbfsStationToFeature(gbfsStation) {
  return {
    type: 'Feature',
    properties: gbfsStation,
    geometry: {
      type: 'Point',
      coordinates: [gbfsStation.lon, gbfsStation.lat],
    }
  };
}
window.gbfsStationToFeature = gbfsStationToFeature;
window.stationsData = stationsData;

const stations = stationsData.data.stations.map(gbfsStationToFeature);

const stationsLayer = L.geoJSON(stations);
stationsLayer.addTo(map);

// Add tooltip with name and bikeshare density...
for (const hood of hoodsCollection.features) {
  function stationInHood(station) {
    return turf.booleanPointInPolygon(station, hood);
  }

  const hoodStations = stations.filter(stationInHood);

  const areaSqKm = hood.properties['Shape_Area'] / 3280.84 / 3280.84;
  const stationCount = hoodStations.length;
  const stationDensity = stationCount / areaSqKm;

  Object.assign(hood.properties, { areaSqKm, stationCount, stationDensity});
}

hoodsLayer.bindTooltip(layer => {
  const hood = layer.feature;
  const name = hood.properties['LISTNAME'];
  const density = hood.properties.stationDensity.toFixed(2);
  return `${name}<br>${density} stations / sq km`;
});