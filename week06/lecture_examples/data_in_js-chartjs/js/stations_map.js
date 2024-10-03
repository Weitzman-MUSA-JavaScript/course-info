function initMap(el, hoods, stations) {
  const map = L.map(el, { preferCanvas: true, zoomSnap: 0 });

  // Add the neighborhoods and stations to the map...
  const hoodsLayer = L.geoJSON(hoods, {
    style: {
      color: "#0af",
      weight: 0.5,
      fillOpacity: 0.4,
    },
  }).addTo(map);
  hoodsLayer.bindTooltip((layer) => {
    const hood = layer.feature;
    const name = hood.properties["LISTNAME"];
    const density = hood.properties.stationDensity.toFixed(1);
    return `${name}<br>${density} stations / sq km`;
  });

  map.fitBounds(hoodsLayer.getBounds(), { padding: [20, 20] });

  const stationsLayer = L.geoJSON(stations, {
    pointToLayer: (feature, latlng) =>
      L.circleMarker(latlng, {
        radius: 3,
        interactive: false,
      }),
    style: {
      color: "green",
      weight: 0,
      fillOpacity: 0.8,
    },
  }).addTo(map);

  return map;
}

export { initMap };