import { Bikeshare } from '../bikeshare.js';
import { Backend } from '../backend.js';

let map;
let stationsLayer;
let serviceAreaLayer;
let suggestionsLayer;
let selectedLocationMarker;

/**
 * Initialize the Leaflet map with base layers and controls
 * @param {EventTarget} events - Event bus for component communication
 * @param {HTMLElement} mapElement - DOM element to attach the map to
 */
function initMap(events, mapElement) {
  // Initialize the Leaflet map
  map = L.map(mapElement, {
    center: [42.3601, -71.0589], // Boston coordinates
    zoom: 13,
    zoomControl: false // We'll add custom controls
  });

  // Add zoom control to bottom right
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map);

  // Add base tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Initialize empty layers
  stationsLayer = L.layerGroup().addTo(map);
  serviceAreaLayer = L.layerGroup().addTo(map);
  suggestionsLayer = L.layerGroup().addTo(map);

  // Add map controls
  addMapControls(events, mapElement);

  // Load initial data
  loadMapData(events);

  // Set up map event listeners
  setupMapEvents(events);

  // Set up event bus listeners
  setupEventListeners(events);
}

/**
 * Add search box, location button, and suggest button to the map
 * @param {EventTarget} events - Event bus for dispatching user actions
 * @param {HTMLElement} mapElement - Map container element for appending controls
 */
function addMapControls(events, mapElement) {
  // Create controls container
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'map-controls';
  
  // Search box
  const searchBox = document.createElement('input');
  searchBox.type = 'text';
  searchBox.className = 'search-box';
  searchBox.placeholder = 'Search for an address or location...';
  
  // Location button
  const locationBtn = document.createElement('button');
  locationBtn.className = 'location-btn';
  locationBtn.innerHTML = '📍';
  locationBtn.title = 'Go to my location';
  
  controlsContainer.appendChild(searchBox);
  controlsContainer.appendChild(locationBtn);
  mapElement.appendChild(controlsContainer);

  // Suggest button
  const suggestBtn = document.createElement('button');
  suggestBtn.className = 'suggest-btn';
  suggestBtn.textContent = 'Suggest a Station';
  mapElement.appendChild(suggestBtn);

  // Event listeners
  locationBtn.addEventListener('click', () => {
    getCurrentLocation(events);
  });

  suggestBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    events.dispatchEvent(new CustomEvent('show-suggestion-form'));
  });

  searchBox.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  searchBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchLocation(events, searchBox.value);
    }
  });
}

/**
 * Set up event listeners for map interactions (clicks, etc.)
 * @param {EventTarget} events - Event bus for dispatching location selection events
 */
function setupMapEvents(events) {
  map.on('click', (e) => {
    const point = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [e.latlng.lng, e.latlng.lat]
      }
    };
    
    events.dispatchEvent(new CustomEvent('set-location', {
      detail: { location: point }
    }));
  });
}

/**
 * Set up event bus listeners for data loading and location changes
 * @param {EventTarget} events - Event bus to listen for application events
 */
function setupEventListeners(events) {
  // Listen for station data loaded
  events.addEventListener('load-stations:success', (e) => {
    displayStations(e.detail.stations);
  });

  // Listen for service area data loaded
  events.addEventListener('load-service-area:success', (e) => {
    displayServiceArea(e.detail.serviceArea);
  });

  // Listen for suggestions data loaded
  events.addEventListener('load-suggestions:success', (e) => {
    displaySuggestions(e.detail.suggestions);
  });

  // Listen for location changes
  events.addEventListener('set-location', (e) => {
    setSelectedLocation(e.detail.location);
  });

  events.addEventListener('unset-location', () => {
    clearSelectedLocation();
  });

  // Listen for new suggestions
  events.addEventListener('save-suggestion:success', (e) => {
    if (e.detail.suggestion) {
      addSuggestionToMap(e.detail.suggestion);
    }
  });
}

/**
 * Load bikeshare stations and service area data
 * @param {EventTarget} events - Event bus for data loading events
 */
async function loadMapData(events) {
  try {
    // Load stations and service area in parallel
    await Promise.all([
      Bikeshare.fetchStations(events),
      Bikeshare.fetchServiceArea(events),
      Backend.loadSuggestions(events)
    ]);
  } catch (error) {
    console.error('Error loading map data:', error);
  }
}

/**
 * Display bikeshare stations as circle markers on the map
 * @param {Object} stations - GeoJSON FeatureCollection of bikeshare stations
 */
function displayStations(stations) {
  stationsLayer.clearLayers();
  
  stations.features.forEach(station => {
    const marker = L.circleMarker([
      station.geometry.coordinates[1], // lat
      station.geometry.coordinates[0]  // lng
    ], {
      radius: 6,
      fillColor: '#0066cc',
      color: 'white',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    });

    marker.bindTooltip(station.properties.name, {
      permanent: false,
      direction: 'top'
    });

    stationsLayer.addLayer(marker);
  });
}

/**
 * Display the bikeshare service area boundaries on the map
 * @param {Object} serviceArea - GeoJSON FeatureCollection of service area polygons
 */
function displayServiceArea(serviceArea) {
  serviceAreaLayer.clearLayers();
  
  serviceArea.features.forEach(feature => {
    if (feature.properties.boundary_name === 'Combined_Service_Area') {
      // Main service area - lighter fill
      const layer = L.geoJSON(feature, {
        style: {
          fillColor: '#0066cc',
          fillOpacity: 0.1,
          color: '#0066cc',
          weight: 2,
          opacity: 0.5
        }
      });
      serviceAreaLayer.addLayer(layer);
    }
  });
}

function displaySuggestions(suggestions) {
  suggestionsLayer.clearLayers();
  
  suggestions.forEach(suggestion => {
    addSuggestionToMap(suggestion);
  });
}

/**
 * Set and display the selected location on the map with a dotted circle marker
 * @param {Object} location - GeoJSON Point feature representing the selected location
 */
function setSelectedLocation(location) {
  clearSelectedLocation();
  
  const latlng = [
    location.geometry.coordinates[1], // lat
    location.geometry.coordinates[0]  // lng
  ];

  // Create a marker with a dotted circle as described in the design
  selectedLocationMarker = L.circle(latlng, {
    radius: 50, // 50 meter radius
    fillColor: '#ff6b35',
    color: '#ff6b35',
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.2,
    dashArray: '5, 5' // Dotted line
  }).addTo(map);

  // Center the map on the location
  map.setView(latlng, Math.max(map.getZoom(), 16));
}

/**
 * Remove the selected location marker from the map
 */
function clearSelectedLocation() {
  if (selectedLocationMarker) {
    map.removeLayer(selectedLocationMarker);
    selectedLocationMarker = null;
  }
}

/**
 * Add a new suggestion marker to the map
 * @param {Object} suggestion - Suggestion object with location geometry
 */
function addSuggestionToMap(suggestion) {
  const latlng = [
    suggestion.location.geometry.coordinates[1], // lat
    suggestion.location.geometry.coordinates[0]  // lng
  ];

  const marker = L.circle(latlng, {
    keyboard: false,
    radius: 50,
    stroke: false,
    fillColor: '#28a745',
    fillOpacity: 0.5
  });

  suggestionsLayer.addLayer(marker);
}

/**
 * Get the user's current location using the Geolocation API
 * @param {EventTarget} events - Event bus for dispatching location events
 */
function getCurrentLocation(events) {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by this browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [position.coords.longitude, position.coords.latitude]
        }
      };
      
      events.dispatchEvent(new CustomEvent('set-location', {
        detail: { location: point }
      }));
    },
    (error) => {
      console.error('Error getting location:', error);
      alert('Unable to get your location. Please try searching for an address instead.');
    }
  );
}

/**
 * Search for a location using geocoding service (Nominatim)
 * @param {EventTarget} events - Event bus for dispatching location events
 * @param {string} query - Search query (address, place name, etc.)
 */
function searchLocation(events, query) {
  if (!query.trim()) return;

  // Simple geocoding using Nominatim (OpenStreetMap)
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&bounded=1&viewbox=-71.2,42.2,-70.9,42.5`;
  
  fetch(url)
    .then(response => response.json())
    .then(results => {
      if (results.length > 0) {
        const result = results[0];
        const point = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(result.lon), parseFloat(result.lat)]
          }
        };
        
        events.dispatchEvent(new CustomEvent('set-location', {
          detail: { location: point }
        }));
      } else {
        alert('Location not found. Please try a different search term.');
      }
    })
    .catch(error => {
      console.error('Error searching location:', error);
      alert('Error searching for location. Please try again.');
    });
}

export { initMap };