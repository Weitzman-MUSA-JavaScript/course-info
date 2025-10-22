import _ from 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm';

const geolocateBtn = document.querySelector('#geolocate');
const autocompleteInput = document.querySelector('#address-input');
const autocompleteList = document.querySelector('#suggestions');

/**
 * Initializes geolocation features.
 * @param {EventTarget} events The event bus used to communicate between app components.
 */
function initGeolocation(events) {
  geolocateBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);

        const evt = new CustomEvent('userLocationAcquired', {
          detail: { lat, lng },
        });
        events.dispatchEvent(evt);
      },
      (error) => {
        console.error('Error obtaining location:', error);
        alert('Unable to retrieve your location. Did you allow location access?');
      }
    );
  });
}

/**
 * Initializes address autocomplete features.
 * @param {EventTarget} events The event bus used to communicate between app components.
 */
function initAutocomplete(events) {
  const apiUrlBase = 'https://geocoding.geo.census.gov/geocoder/locations/address?city=Philadelphia&state=PA&benchmark=4&format=json&street=';
  autocompleteInput.addEventListener('input', _.debounce(async () => {
    console.log('Input changed:', autocompleteInput.value);
    const response = await fetch('https://corsproxy.io/?url=' + apiUrlBase + encodeURIComponent(autocompleteInput.value));
    const data = await response.json();
    console.log('Autocomplete suggestions:', data);
  }, 500));
}

export { initGeolocation, initAutocomplete };