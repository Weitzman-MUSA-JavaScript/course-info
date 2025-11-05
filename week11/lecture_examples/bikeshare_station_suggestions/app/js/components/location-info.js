import { Bikeshare } from '../bikeshare.js';
import * as turf from '@turf/turf';

/**
 * Initialize and display location information for the selected point
 * @param {EventTarget} events - Event bus for component communication
 * @param {HTMLElement} container - DOM container for the location info content
 * @param {Object} location - GeoJSON Point feature for the selected location
 */
async function initLocationInfo(events, container, location) {
  container.innerHTML = `
    <div class="loading">
      Loading location information...
    </div>
  `;

  try {
    // Get nearby stations and other info
    const [stations, isInServiceArea, cityName] = await Promise.all([
      getNearbyStations(location),
      Bikeshare.pointIsInServiceArea(location),
      Bikeshare.findCityForPoint(location)
    ]);

    renderLocationInfo(events, container, location, {
      stations,
      isInServiceArea,
      cityName
    });

  } catch (error) {
    console.error('Error loading location info:', error);
    container.innerHTML = `
      <div class="message error">
        Error loading location information. Please try again.
      </div>
    `;
  }
}

/**
 * Get nearby bikeshare stations within a specified distance
 * @param {Object} location - GeoJSON Point feature
 * @param {number} maxDistance - Maximum distance in meters (default: 500)
 * @returns {Promise<Array>} Array of objects with station and distance properties
 */
async function getNearbyStations(location, maxDistance = 500) {
  const allStations = await Bikeshare.getStations();
  
  const nearbyStations = allStations.features
    .map(station => {
      const distance = turf.distance(location, station, { units: 'meters' });
      return { station, distance };
    })
    .filter(item => item.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5); // Limit to 5 nearest stations

  return nearbyStations;
}

/**
 * Render the location information UI with nearby stations and suggestion options
 * @param {EventTarget} events - Event bus for dispatching suggestion form events
 * @param {HTMLElement} container - DOM container for the content
 * @param {Object} location - GeoJSON Point feature for the selected location
 * @param {Object} info - Location context info (stations, service area status, city name)
 */
function renderLocationInfo(events, container, location, info) {
  const { stations, isInServiceArea, cityName } = info;
  
  let html = `<div class="location-info">`;

  // Service area status
  html += `
    <div class="info-section">
      <h3>Service Area</h3>
      <p>${isInServiceArea ? 
        `This location is within the ${cityName} bikeshare service area.` :
        `This location is outside the current service area but is closest to ${cityName}.`
      }</p>
    </div>
  `;

  // Nearby stations
  if (stations.length > 0) {
    html += `
      <div class="info-section">
        <h3>Nearby Stations</h3>
    `;
    
    stations.forEach(({ station, distance }) => {
      html += `
        <div class="station-item">
          <span class="station-name">${station.properties.name}</span>
          <span class="station-distance">${Math.round(distance)}m</span>
        </div>
      `;
    });
    
    html += `</div>`;
  } else {
    html += `
      <div class="info-section">
        <h3>Nearby Stations</h3>
        <p>No stations found within 500 meters of this location.</p>
      </div>
    `;
  }

  // Suggestion prompt
  const closestStation = stations.length > 0 ? stations[0] : null;
  const isNearExistingStation = closestStation && closestStation.distance < 100;
  
  html += `
    <div class="info-section">
      <h3>Suggest a Station</h3>
      <p>${isNearExistingStation ? 
        'There\'s already a station very close to this location. You can still suggest improvements or additional capacity.' :
        'This looks like it could be a good location for a new bikeshare station.'
      }</p>
      <button class="btn btn-primary" id="suggest-here-btn">
        ${isNearExistingStation ? 'Suggest Improvements' : 'Suggest Station Here'}
      </button>
    </div>
  `;

  html += `</div>`;
  
  container.innerHTML = html;

  // Add event listener for suggestion button
  const suggestBtn = container.querySelector('#suggest-here-btn');
  suggestBtn.addEventListener('click', () => {
    events.dispatchEvent(new CustomEvent('show-suggestion-form', {
      detail: { location, nearbyStations: stations }
    }));
  });
}

export { initLocationInfo };