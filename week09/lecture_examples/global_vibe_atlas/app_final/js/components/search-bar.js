/**
 * Debounced Global Place Search & Geolocation Component
 *
 * Implements the Week 7/8 pattern:
 * <input> + <ul class="suggestions"> + _.debounce
 *
 * Uses Mapbox Geocoding v6 when a token is available,
 * or gracefully falls back to OpenStreetMap Nominatim search.
 */

import _ from 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm';
import { UserStorage } from '../storage.js';

/**
 * Initializes place search autocomplete and geolocation.
 *
 * @param {EventTarget} events Application event bus
 * @param {Object} instanceSettings Student instance configuration
 */
export function initSearchBar(events, instanceSettings) {
  const searchInput = document.querySelector('#place-search-input');
  const suggestionsList = document.querySelector('#place-suggestions');
  const geolocateBtn = document.querySelector('#geolocate-btn');

  if (!searchInput || !suggestionsList) {
    console.error('[search-bar] Search elements not found in DOM.');
    return;
  }

  // Input change handler with debounce (400ms)
  const inputHandler = async () => {
    const query = searchInput.value.trim();
    if (query.length < 2) {
      suggestionsList.innerHTML = '';
      suggestionsList.classList.add('hidden');
      return;
    }

    const token = UserStorage.getMapboxToken(instanceSettings.mapboxToken);

    try {
      let results = [];
      if (token && token.startsWith('pk.')) {
        results = await searchMapboxGeocoding(query, token);
      } else {
        results = await searchNominatim(query);
      }

      displaySuggestions(events, results, searchInput, suggestionsList);
    } catch (err) {
      console.warn('[search-bar] Place search error:', err);
    }
  };

  const debouncedInputHandler = _.debounce(inputHandler, 400);
  searchInput.addEventListener('input', debouncedInputHandler);

  // Close suggestions on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#search-container')) {
      suggestionsList.classList.add('hidden');
    }
  });

  // Re-open suggestions if input focused and has items
  searchInput.addEventListener('focus', () => {
    if (suggestionsList.children.length > 0) {
      suggestionsList.classList.remove('hidden');
    }
  });

  // Geolocation button
  geolocateBtn?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    geolocateBtn.disabled = true;
    geolocateBtn.textContent = '⏳';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        geolocateBtn.disabled = false;
        geolocateBtn.textContent = '📍';
        const { latitude: lat, longitude: lng } = position.coords;
        searchInput.value = 'My Current Location';
        suggestionsList.classList.add('hidden');

        events.dispatchEvent(new CustomEvent('set-location', {
          detail: {
            lng,
            lat,
            placeName: 'My Current Location',
            zoom: 15,
            source: 'geolocation',
          },
        }));
      },
      (err) => {
        geolocateBtn.disabled = false;
        geolocateBtn.textContent = '📍';
        console.warn('[search-bar] Geolocation error:', err);
        alert('Could not determine your location. Please check browser permissions or search by place name.');
      },
      { timeout: 8000 }
    );
  });
}

/**
 * Searches locations using Mapbox Geocoding v6 API.
 */
async function searchMapboxGeocoding(query, token) {
  const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&limit=5&access_token=${token}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Mapbox search returned status ${response.status}`);
  }
  const data = await response.json();
  return (data.features || []).map((feat) => {
    const [lng, lat] = feat.geometry?.coordinates || [0, 0];
    const placeName = feat.properties?.full_address || feat.properties?.name || query;
    return { placeName, lng, lat };
  });
}

/**
 * Searches locations using OpenStreetMap Nominatim API (zero-config fallback).
 */
async function searchNominatim(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Nominatim search returned status ${response.status}`);
  }
  const data = await response.json();
  return data.map((item) => ({
    placeName: item.display_name,
    lng: parseFloat(item.lon),
    lat: parseFloat(item.lat),
  }));
}

/**
 * Renders autocomplete suggestions list.
 */
function displaySuggestions(events, results, searchInput, suggestionsList) {
  suggestionsList.innerHTML = '';

  if (!results || results.length === 0) {
    const li = document.createElement('li');
    li.className = 'suggestion-item';
    li.innerHTML = '<button type="button" disabled style="opacity: 0.6;">No locations found.</button>';
    suggestionsList.appendChild(li);
    suggestionsList.classList.remove('hidden');
    return;
  }

  results.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'suggestion-item';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = item.placeName;

    btn.addEventListener('click', () => {
      searchInput.value = item.placeName;
      suggestionsList.classList.add('hidden');

      events.dispatchEvent(new CustomEvent('set-location', {
        detail: {
          lng: item.lng,
          lat: item.lat,
          placeName: item.placeName,
          zoom: 14,
          source: 'search-autocomplete',
        },
      }));
    });

    li.appendChild(btn);
    suggestionsList.appendChild(li);
  });

  suggestionsList.classList.remove('hidden');
}
