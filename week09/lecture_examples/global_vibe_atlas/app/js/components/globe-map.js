/**
 * MapLibre GL JS 3D Globe Component
 *
 * Renders an interactive 3D globe using MapLibre GL JS v5,
 * loads custom Mapbox styles via `process_mapbox.js` (or open vector tiles fallback),
 * displays crowdsourced vibe markers, and flies the camera to selected cities.
 */

import { loadGlobeStyle } from '../process_mapbox.js';
import { VIBE_CATEGORIES } from '../config.js';
import { UserStorage } from '../storage.js';

let mapInstance = null;
let currentMarkers = [];
let selectionMarker = null;

/**
 * Initializes the MapLibre GL JS 3D globe.
 *
 * @param {EventTarget} events Application event bus
 * @param {HTMLElement} mapElement DOM element for the map container
 * @param {Object} instanceSettings Student instance configuration
 * @returns {Promise<Object>} The initialized MapLibre Map instance
 */
export async function initGlobeMap(events, mapElement, instanceSettings) {
  const token = UserStorage.getMapboxToken(instanceSettings.mapboxToken);
  const styleId = UserStorage.getStyleId(instanceSettings.mapboxStyleId);

  // Load either the processed Mapbox style or the open vector tile fallback
  const initialStyle = await loadGlobeStyle(styleId, token);

  mapInstance = new maplibregl.Map({
    container: mapElement,
    style: initialStyle,
    center: instanceSettings.initialCenter || [-75.1932, 39.9522],
    zoom: instanceSettings.initialZoom || 2.2,
    pitch: 0,
    maxPitch: 75,
  });

  // Ensure globe projection is enabled on style load
  mapInstance.on('style.load', () => {
    try {
      mapInstance.setProjection({ type: 'globe' });
      console.log('[globe-map] MapLibre 3D globe projection active.');
    } catch (err) {
      console.warn('[globe-map] Could not set globe projection:', err);
    }
  });

  // Add zoom and rotation controls
  mapInstance.addControl(new maplibregl.NavigationControl({
    visualizePitch: true,
    showZoom: true,
    showCompass: true,
  }), 'bottom-right');

  // Wire up map click event to select a location
  mapInstance.on('click', (e) => {
    // Avoid re-selecting when clicking an existing marker element
    if (e.originalEvent.target.closest('.vibe-marker-element')) {
      return;
    }

    const { lng, lat } = e.lngLat;
    events.dispatchEvent(new CustomEvent('set-location', {
      detail: {
        lng,
        lat,
        placeName: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        source: 'map-click',
      },
    }));
  });

  // Setup event bus listeners
  setupMapEventListeners(events, instanceSettings);

  return mapInstance;
}

/**
 * Setup listeners on the shared event bus.
 */
function setupMapEventListeners(events, instanceSettings) {
  // Fly to selected location and display selection indicator
  events.addEventListener('set-location', (e) => {
    const { lng, lat, zoom = 14 } = e.detail;
    if (typeof lng === 'number' && typeof lat === 'number') {
      flyToLocation([lng, lat], zoom);
      updateSelectionMarker([lng, lat]);
    }
  });

  // Clear selection indicator when panel closes
  events.addEventListener('unset-location', () => {
    clearSelectionMarker();
  });

  // Update rendered vibe markers when backend data arrives
  events.addEventListener('pins-updated', (e) => {
    const pins = e.detail?.pins || [];
    renderVibePins(events, pins);
  });

  // Reload map style if student changes token or style in Settings dialog
  events.addEventListener('map-style-changed', async (e) => {
    const { token, styleId } = e.detail;
    console.log('[globe-map] Reloading globe style with new settings...');
    const newStyle = await loadGlobeStyle(styleId, token);
    if (mapInstance) {
      mapInstance.setStyle(newStyle);
    }
  });
}

/**
 * Smoothly flies the 3D globe camera to a given coordinate.
 */
export function flyToLocation(coordinates, targetZoom = 14) {
  if (!mapInstance) return;
  mapInstance.flyTo({
    center: coordinates,
    zoom: targetZoom,
    duration: 2200,
    essential: true,
  });
}

/**
 * Returns current center point of the 3D globe.
 */
export function getMapCenter() {
  if (!mapInstance) return { lng: 0, lat: 0 };
  const center = mapInstance.getCenter();
  return { lng: center.lng, lat: center.lat };
}

/**
 * Updates the dotted selection marker on the map.
 */
function updateSelectionMarker(coordinates) {
  clearSelectionMarker();
  if (!mapInstance) return;

  const el = document.createElement('div');
  el.className = 'selected-point-marker';
  el.style.width = '30px';
  el.style.height = '30px';
  el.style.borderRadius = '50%';
  el.style.border = '2.5px dashed #990000';
  el.style.backgroundColor = 'rgba(153, 0, 0, 0.2)';
  el.style.pointerEvents = 'none';

  selectionMarker = new maplibregl.Marker({ element: el })
    .setLngLat(coordinates)
    .addTo(mapInstance);
}

/**
 * Clears the selection marker.
 */
function clearSelectionMarker() {
  if (selectionMarker) {
    selectionMarker.remove();
    selectionMarker = null;
  }
}

/**
 * Renders all vibe pins as custom color-coded HTML markers on the 3D globe.
 */
export function renderVibePins(events, pins = []) {
  if (!mapInstance) return;

  // Clear existing markers
  currentMarkers.forEach(m => m.remove());
  currentMarkers = [];

  // Single popup used for all markers
  const popup = new maplibregl.Popup({
    offset: 16,
    closeButton: true,
    closeOnClick: false,
  });

    pins.forEach((pin) => {
    const coords = pin.location?.geometry?.coordinates;
    if (!Array.isArray(coords) || coords.length < 2) return;

    const [lng, lat] = coords;
    const categoryInfo = VIBE_CATEGORIES[pin.vibeCategory] || {
      icon: '📍',
      color: '#011f5b',
      label: 'Street Vibe',
    };

    // Create custom DOM element for marker
    const el = document.createElement('div');
    el.className = 'vibe-marker-element';
    el.setAttribute('data-id', pin.id);
    el.setAttribute('data-category', pin.vibeCategory || 'other');
    el.style.backgroundColor = categoryInfo.color;
    el.innerHTML = categoryInfo.icon;
    el.title = `${pin.placeName || 'Street Vibe'}: ${categoryInfo.label}`;

    // Create MUSA-styled popup
    const popupContent = `
      <div class="vibe-popup-content">
        <strong style="color: ${categoryInfo.color}; font-size: 0.85rem; display: block; margin-bottom: 2px;">
          ${categoryInfo.icon} ${categoryInfo.label}
        </strong>
        <h4 style="font-size: 0.95rem; margin-bottom: 4px; color: #011f5b;">
          ${pin.placeName || 'Vibe Pin'}
        </h4>
        <p style="font-size: 0.85rem; margin-bottom: 6px; font-style: italic;">
          "${pin.sensoryNote || ''}"
        </p>
        <div style="font-size: 0.75rem; color: #666; display: flex; justify-content: space-between; align-items: center;">
          <span>Energy: ${'⚡'.repeat(pin.energyLevel || 3)}</span>
          <span>✨ ${pin.endorsements || 1}</span>
        </div>
      </div>
    `;

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([lng, lat])
      .addTo(mapInstance);

    // Also dispatch pin-selected event when marker is clicked so the panel opens
    el.addEventListener('click', () => {
      popup
        .setLngLat([lng, lat])
        .setHTML(popupContent)
        .addTo(mapInstance);
      events.dispatchEvent(new CustomEvent('pin-selected', {
        detail: { pin },
      }));
    });

    currentMarkers.push(marker);
  });

  console.log(`[globe-map] Rendered ${currentMarkers.length} vibe pins on globe.`);
}

