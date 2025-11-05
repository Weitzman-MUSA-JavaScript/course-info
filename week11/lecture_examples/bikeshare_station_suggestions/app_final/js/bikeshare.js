import * as turf from '@turf/turf';

const stationsUrl = 'https://gbfs.lyft.com/gbfs/1.1/bos/en/station_information.json';
const serviceAreaUrl = `data/bluebikes_service_area.geojson`;

/**
 * Convert GBFS station information to GeoJSON FeatureCollection
 * @param {Object} info - GBFS station information response
 * @returns {Object} GeoJSON FeatureCollection of station features
 */
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

/**
 * Bikeshare data service for managing station and service area information
 */
const Bikeshare = {
  stations: null,
  serviceArea: null,

  _stationsPromise: null,
  _serviceAreaPromise: null,

  /**
   * Fetch bikeshare station data from GBFS API with event dispatching
   * @param {EventTarget} events - Event bus for dispatching load events
   * @param {number} retries - Number of retry attempts (default: 3)
   */
  fetchStations: async (events, retries = 3) => {
    if (Bikeshare.stations) { return }

    events?.dispatchEvent(new CustomEvent('load-stations'));
    Bikeshare._stationsPromise ||= Bikeshare._fetchStationsHelper(retries);
    try {
      const stations = await Bikeshare._stationsPromise;
      Bikeshare.stations = stations;
      events?.dispatchEvent(new CustomEvent('load-stations:success', { detail: { stations } }));
    } catch (error) {
      events?.dispatchEvent(new CustomEvent('load-stations:error', { detail: { error } }));
    }
  },

  /**
   * Internal method to fetch station data with retry logic
   * @param {number} retries - Number of retry attempts
   * @returns {Promise<Object>} GeoJSON FeatureCollection of stations
   */
  _fetchStationsHelper: async (retries) => {
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
        return await Bikeshare._fetchStationsHelper(retries - 1);
      } else {
        console.error('Failed to fetch Bikeshare stations after multiple attempts.');
        throw error;
      }
    }
  },

  /**
   * Fetch bikeshare service area data with event dispatching
   * @param {EventTarget} events - Event bus for dispatching load events
   * @param {number} retries - Number of retry attempts (default: 3)
   */
  fetchServiceArea: async (events, retries = 3) => {
    if (Bikeshare.serviceArea) { return }

    events?.dispatchEvent(new CustomEvent('load-service-area'));
    Bikeshare._serviceAreaPromise ||= Bikeshare._fetchServiceArea(retries);
    try {
      const serviceArea = await Bikeshare._serviceAreaPromise;
      Bikeshare.serviceArea = serviceArea;
      events?.dispatchEvent(new CustomEvent('load-service-area:success', { detail: { serviceArea } }));
    } catch (error) {
      events?.dispatchEvent(new CustomEvent('load-service-area:error', { detail: { error } }));
    }
  },

  /**
   * Internal method to fetch service area data with retry logic
   * @param {number} retries - Number of retry attempts
   * @returns {Promise<Object>} GeoJSON FeatureCollection of service area polygons
   */
  _fetchServiceArea: async (retries) => {
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
        return await Bikeshare._fetchServiceArea(retries - 1);
      } else {
        console.error('Failed to fetch Bikeshare service area after multiple attempts.');
        throw error;
      }
    }
  },

  /**
   * Get cached or fetch bikeshare stations
   * @returns {Promise<Object>} GeoJSON FeatureCollection of stations
   */
  getStations: async () => {
    await Bikeshare.fetchStations();
    return Bikeshare.stations;
  },

  /**
   * Get cached or fetch service area data
   * @returns {Promise<Object>} GeoJSON FeatureCollection of service area polygons
   */
  getServiceArea: async () => {
    await Bikeshare.fetchServiceArea();
    return Bikeshare.serviceArea;
  },

  /**
   * Check if a point is within the bikeshare service area
   * @param {Object} point - GeoJSON Point feature
   * @returns {Promise<boolean>} True if point is in service area
   */
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

  /**
   * Find the city jurisdiction for a given point
   * @param {Object} point - GeoJSON Point feature
   * @returns {Promise<string>} City name (boundary_name from service area data)
   */
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
  
  /**
   * Find the closest bikeshare station to a given point (with caching)
   * @param {Object} point - GeoJSON Point feature
   * @returns {Promise<Object>} Closest station feature
   */
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

    Bikeshare.closestStationCache[coordsStr] = closest.station;

    return closest.station;
  }
};

export { Bikeshare };
