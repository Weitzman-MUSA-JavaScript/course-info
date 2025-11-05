import { initMap } from './components/map.js';
import { initContentPanel } from './components/content-panel.js';

const events = new EventTarget();

// Event bus events
// ================
//
// load-stations
// Dispatched when station data loading starts
//
// load-stations:success { detail: { stations } }
// Dispatched when station data loading succeeds
// 
// load-stations:error { detail: { error } }
// Dispatched when station data loading fails
//
// load-service-area
// Dispatched when service area data loading starts
//
// load-service-area:success { detail: { serviceArea } }
// Dispatched when service area data loading succeeds
//
// load-service-area:error { detail: { error } }
// Dispatched when service area data loading fails
//
// load-suggestions
// Dispatched when suggestions data loading starts
// 
// load-suggestions:success { detail: { suggestions } }
// Dispatched when suggestions data loading succeeds
//
// load-suggestions:error { detail: { error } }
// Dispatched when suggestions data loading fails
//
// set-location { detail: { location } }
// Dispatched when the user sets the current location via map click, search, or geolocation
//
// unset-location
// Dispatched when the user clears the current location by closing the content panel
//
// show-suggestion-form { detail: { location?, nearbyStations? } }
// Dispatched when the user wants to show the suggestion form
//
// close-panel
// Dispatched when the user wants to close the content panel
//
// save-suggestion:submit
// Dispatched when the user submits a new suggestion
//
// save-suggestion:success { detail: { suggestion } }
// Dispatched when the suggestion is successfully saved to the backend
//
// save-suggestion:error { detail: { error } }
// Dispatched when there is an error saving the suggestion to the backend
//
// save-suggestion:complete { detail: { success, suggestion?, error? } }
// Dispatched when the suggestion save process is complete (either success or error)

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.querySelector('#map');
  if (!mapElement) { console.error('Map element not found') }
  initMap(events, mapElement);

  const contentPanelElement = document.querySelector('#content-panel');
  if (!contentPanelElement) { console.error('Content panel element not found') }
  initContentPanel(events, contentPanelElement);
});