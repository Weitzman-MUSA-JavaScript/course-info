import * as turf from "https://cdn.jsdelivr.net/npm/@turf/turf@7.1.0/+esm";

async function loadStationsData() {
  // Load the neighborhood data...
  const hoodsResponse = await fetch("data/philadelphia-neighborhoods.geojson");
  const hoodsCollection = await hoodsResponse.json();
  const hoods = hoodsCollection.features;

  // Load the station data...
  function gbfsStationToFeature(station) {
    return {
      type: "Feature",
      properties: station,
      geometry: {
        type: "Point",
        coordinates: [station.lon, station.lat],
      },
    };
  }

  const gbfsStationsResponse = await fetch(
    "https://gbfs.bcycle.com/bcycle_indego/station_information.json"
  );
  const gbfsStationsData = await gbfsStationsResponse.json();
  const gbfsStations = gbfsStationsData.data.stations;
  const stations = gbfsStations.map(gbfsStationToFeature);

  // Update the neighborhoods with station counts and densities...
  for (const hood of hoods) {
    function stationInHood(station) {
      return turf.booleanPointInPolygon(station, hood);
    }
    const hoodStations = stations.filter(stationInHood);
    for (const station of hoodStations) {
      station.properties.neighborhoodName = hood.properties['NAME'];
    }

    // Shape_Area is in square feet
    const areaSqKm = hood.properties["Shape_Area"] / 3280.84 / 3280.84;
    const stationCount = hoodStations.length;
    const stationDensity = stationCount / areaSqKm;

    Object.assign(hood.properties, { areaSqKm, stationCount, stationDensity });
  }

  return { hoods, stations };
}

export { loadStationsData };
