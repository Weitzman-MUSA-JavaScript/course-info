/**
 * Initializes the map and sets up event listeners.
 * @param {EventTarget} events The event bus used to communicate between app components.
 * @returns {L.Map} The initialized Leaflet map instance.
 */
function initMap(events) {
  const map = L.map('map').setView([51.505, -0.09], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  events.addEventListener('userLocationAcquired', (event) => {
    const { lat, lng } = event.detail;
    map.setView([lat, lng], 13);
  });

  return map;
}

export { initMap };
