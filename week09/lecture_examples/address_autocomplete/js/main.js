import { initMap } from './map.js';
import { initGeolocation, initAutocomplete } from './location.js';

// Events in event bus:
// - userLocationAcquired: { detail: { lat, lng } }
const events = new EventTarget();

const map = initMap(events);
initGeolocation(events);
initAutocomplete(events);
