import * as turf from '@turf/turf';

const stationsUrl = 'https://gbfs.lyft.com/gbfs/1.1/bos/en/station_information.json';
const serviceAreaUrl = `data/bluebikes_service_area.geojson`;

function gbfsToFeatureCollection(info) {
  return {
    type: 'FeatureCollection',
    features: info.data.stations.map(station => ({
      type: 'Feature',
      id: station.station_id,
      properties: {...station}, // Includes `name`
      geometry: {
        type: 'Point',
        coordinates: [station.lon, station.lat]
      }
    }))
  };
}

const Bikeshare = {
  stations: null,
  serviceArea: null,

  _stationsPromise: null,
  _serviceAreaPromise: null,

  fetchStations: async (events, retries = 3) => {
    if (Bikeshare.stations) { return }

    Bikeshare._stationsPromise ||= Bikeshare._fetchStations(events, retries);
    try {
      const stations = await Bikeshare._stationsPromise;
      Bikeshare.stations = stations;
      events.dispatchEvent(new Event('load-stations:success', { detail: { stations } }));
    } catch (error) {
      events.dispatchEvent(new Event('load-stations:error', { detail: { error } }));
    }
  },

  _fetchStations: async (events, retries = 3) => {
    try {
      const response = await fetch(stationsUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const gbfs = await response.json();
      const stations = gbfsToFeatureCollection(gbfs);
      return stations;
    } catch (error) {
      console.error('Error fetching Bikeshare stations:', error);
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        return await Bikeshare._fetchStations(events, retries - 1);
      } else {
        console.error('Failed to fetch Bikeshare stations after multiple attempts.');
        throw error;
      }
    }
  },

  fetchServiceArea: async (events, retries = 3) => {
    if (Bikeshare.serviceArea) { return }

    Bikeshare._serviceAreaPromise ||= Bikeshare._fetchServiceArea(events, retries);
    try {
      const serviceArea = await Bikeshare._serviceAreaPromise;
      Bikeshare.serviceArea = serviceArea;
      events.dispatchEvent(new Event('load-service-area:success', { detail: { serviceArea } }));
    } catch (error) {
      events.dispatchEvent(new Event('load-service-area:error', { detail: { error } }));
    }
  },

  _fetchServiceArea: async (events, retries = 3) => {
    try {
      const response = await fetch(serviceAreaUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const serviceArea = await response.json();
      serviceArea.features = serviceArea.features.map(turf.cleanCoords);
      return serviceArea;
    } catch (error) {
      console.error('Error fetching Bikeshare service area:', error);
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        return await Bikeshare._fetchServiceArea(events, retries - 1);
      } else {
        console.error('Failed to fetch Bikeshare service area after multiple attempts.');
        throw error;
      }
    }
  },

  getStations: async () => {
    await Bikeshare.fetchStations();
    return Bikeshare.stations;
  },

  getServiceArea: async () => {
    await Bikeshare.fetchServiceArea();
    return Bikeshare.serviceArea;
  },

  pointIsInServiceArea: async (point) => {
    const serviceArea = await Bikeshare.getServiceArea();

    // Get the Combined_Service_Area feature
    const serviceAreaFeature = serviceArea.features.find(feature => feature.properties.boundary_name === 'Combined_Service_Area');
    if (!serviceAreaFeature) {
      throw new Error('Combined_Service_Area feature not found.');
    }

    // Check if the point is within the service area polygon
    return turf.booleanPointInPolygon(point, serviceAreaFeature);
  },

  findCityForPoint: async (point) => {
    const serviceArea = await Bikeshare.getServiceArea();
      
    // Check whether there's a city boundary that contains the point
    for (const feature of serviceArea.features) {
      if (feature.properties.boundary_name !== 'Combined_Service_Area' && turf.booleanPointInPolygon(point, feature)) {
        return feature.properties.boundary_name;
      }
    }

    // If not, return the closest city boundary
    const cityDistances = serviceArea.features
      .filter(feature => feature.properties.boundary_name !== 'Combined_Service_Area')
      .map(feature => {
        const distance = turf.pointToPolygonDistance(point, feature, { units: 'meters' });
        return { feature, distance };
      });

    const closestCity = cityDistances.reduce((min, current) => {
      return current.distance < min.distance ? current : min;
    });

    return closestCity.feature.properties.boundary_name;
  },

  closestStationCache: {},
  closestStation: async (point) => {
    const stations = await Bikeshare.getStations();

    const coordsStr = point.geometry.coordinates.map(coord => coord.toFixed(6)).join(',');
    if (Bikeshare.closestStationCache[coordsStr]) {
      return Bikeshare.closestStationCache[coordsStr];
    }

    const stationDistances = stations.features.map(station => {
      const stationPoint = turf.point(station.geometry.coordinates);
      const distance = turf.distance(point, stationPoint, { units: 'meters' });
      return { station, distance };
    });

    const closest = stationDistances.reduce((min, current) => {
      return current.distance < min.distance ? current : min;
    });

    closestStationCache[coordsStr] = closest.station;

    return closest.station;
  }
};

export { Bikeshare };
