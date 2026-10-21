/**
 * Main Application Entry Point
 *
 * Coordinates components via the shared EventTarget bus:
 * - 3D Globe Map
 * - Debounced Place Search
 * - Vibe Panel (Inspector & Submission Form)
 * - User Settings & LocalStorage
 * - Backend Service (localStorage in starter / Firestore in final)
 */

import { instanceSettings } from './config.js';
import { UserStorage, initSettingsUI } from './storage.js';
import { initGlobeMap } from './components/globe-map.js';
import { initSearchBar } from './components/search-bar.js';
import { initVibePanel } from './components/vibe-panel.js';
import { Backend } from './backend.js';

const events = new EventTarget();

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[main] Initializing Global Street Vibe Atlas...');

  // 1. Initialize user settings & localStorage
  initSettingsUI(events, instanceSettings);

  // 2. Initialize MapLibre 3D Globe Map
  const mapElement = document.querySelector('#map');
  await initGlobeMap(events, mapElement, instanceSettings);

  // 3. Initialize Debounced Place Search
  initSearchBar(events, instanceSettings);

  // 4. Initialize Sliding Content Panel
  const panelElement = document.querySelector('#content-panel');
  initVibePanel(events, panelElement);

  // 5. Initialize Vibe Lens Filter
  const filterSelect = document.querySelector('#vibe-filter-select');
  const initialFilter = UserStorage.getFilter(instanceSettings.defaultVibeFilter || 'all');
  if (filterSelect) {
    filterSelect.value = initialFilter;
    filterSelect.addEventListener('change', (e) => {
      const selectedCategory = e.target.value;
      UserStorage.setFilter(selectedCategory);
      events.dispatchEvent(new CustomEvent('filter-changed', {
        detail: { filter: selectedCategory },
      }));
    });
  }

  // 6. Connect Backend Persistence Service (localStorage in app / Firestore in app_final)
  await Backend.init(events, initialFilter);

  console.log('[main] Global Street Vibe Atlas ready.');
});
