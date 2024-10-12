function initMap(el, hoods, stations, events) {
  const map = L.map(el, { preferCanvas: true, zoomSnap: 0 });
  const selectedHoods = [];

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

  // Add the stations to the map...
  const stationsLayer = L.layerGroup().addTo(map);
  function populateStations(stations) {
    stationsLayer.clearLayers();

    for (const station of stations) {
      const marker = L.circleMarker([
        station.geometry.coordinates[1],
        station.geometry.coordinates[0],
      ], {
        radius: 3,
        interactive: false,
        color: "green",
        weight: 0,
        fillOpacity: 0.8,
      });
      stationsLayer.addLayer(marker);
    }
  }
  populateStations(stations);

  // Add event listeners...
  events.addEventListener('neighborhoodselected', (evt) => {
    const { name, selected } = evt.detail;
    if (selected) {
      selectedHoods.push(name);
    } else {
      const index = selectedHoods.indexOf(name);
      selectedHoods.splice(index, 1);
    }

    const selectedStations = stations.filter((station) => {
      return selectedHoods.includes(station.properties.neighborhoodName);
    });
    populateStations(selectedHoods.length > 0 ? selectedStations : stations);
  });

  return map;
}

export { initMap };