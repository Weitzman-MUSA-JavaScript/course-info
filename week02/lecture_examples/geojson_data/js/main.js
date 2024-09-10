//
// Create a new Leaflet map object to be displayed in the #map div
//
const element = document.querySelector("#map");
const map = L.map(element, { maxZoom: 18 });

//
// Add a base layer to the map
//
const mapboxStyle = "mapbox/streets-v12";
const mapboxKey = "pk.eyJ1IjoibWp1bWJlLXRlc3QiLCJhIjoiY2w3ZTh1NTIxMTgxNTQwcGhmODU2NW5kaSJ9.pBPd19nWO-Gt-vTf1pOHBA";

const baseLayer = L.tileLayer(
  `https://api.mapbox.com/styles/v1/${mapboxStyle}/tiles/{z}/{x}/{y}{r}?access_token=${mapboxKey}`,
  { zoomOffset: -1, tileSize: 512 }
);
baseLayer.addTo(map);

//
// Load GeoJSON data from a file and add it to the map
//
const response = await fetch("shapes.json");
const data = await response.json();

const dataLayer = L.geoJSON(data, {
  pointToLayer: (feature, latlng) => L.circleMarker(latlng),
  style: (feature) =>
    feature.geometry.type === "Point"
      ? { stroke: false, radius: 6, fillOpacity: 1 }
      : {},
    interactive: true,
});
dataLayer.bindTooltip((layer) => layer.feature.properties.name);
dataLayer.addTo(map);

// dataLayer.addEventListener("mouseover", (event) => {
//   const layer = event.layer;
//   const feature = event.layer.feature;
//   const latlng = event.latlng;

//   layer.tooltip = (layer.tooltip || L.tooltip())
//     .setLatLng(latlng)
//     .setContent(feature.properties.name)
//     .addTo(map);
// });

// dataLayer.addEventListener("mouseout", (event) => {
//   const layer = event.layer;
//   if (layer.tooltip) {
//     layer.tooltip.removeFrom(map);
//   }
// });

//
// Fit the map to the bounds of the GeoJSON data
//
map.fitBounds(dataLayer.getBounds());
