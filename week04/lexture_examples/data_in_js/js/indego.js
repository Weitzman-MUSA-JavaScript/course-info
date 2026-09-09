/**
 * Use this function to convert a GBFS station object to a GeoJSON Feature object.
 * This is useful for visualizing station data on a Leaflet map.
 * 
 * @param {GBFSStationObject} gbfsStation
 * @returns GeoJSONFeature
 */
function gbfsStationToFeature(gbfsStation) {
  const lon = gbfsStation.lon;
  const lat = gbfsStation.lat;
  const props = { ...gbfsStation };
  delete props.lon;
  delete props.lat;

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lon, lat]
    },
    properties: props
  };
}

export {
  gbfsStationToFeature,
};


