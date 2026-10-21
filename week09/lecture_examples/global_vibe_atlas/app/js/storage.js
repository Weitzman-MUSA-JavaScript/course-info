/**
 * Client-Side Persistence with localStorage (Week 8 Review)
 *
 * Persists user-specific settings so that reloading the browser retains:
 * 1. The contributor's name/handle
 * 2. The active vibe filter
 * 3. The optional Mapbox access token and preferred style ID
 */

const STORAGE_KEYS = {
  AUTHOR: 'vibe-atlas-author',
  FILTER: 'vibe-atlas-filter',
  MAPBOX_TOKEN: 'vibe-atlas-mapbox-token',
  MAPBOX_STYLE: 'vibe-atlas-style-id',
};

export const UserStorage = {
  getAuthor(defaultHandle = 'Anonymous Explorer') {
    return localStorage.getItem(STORAGE_KEYS.AUTHOR) || defaultHandle;
  },

  setAuthor(name) {
    if (name && name.trim()) {
      localStorage.setItem(STORAGE_KEYS.AUTHOR, name.trim());
    }
  },

  getFilter(defaultFilter = 'all') {
    return localStorage.getItem(STORAGE_KEYS.FILTER) || defaultFilter;
  },

  setFilter(filter) {
    if (filter) {
      localStorage.setItem(STORAGE_KEYS.FILTER, filter);
    }
  },

  getMapboxToken(fallbackToken = '') {
    return (localStorage.getItem(STORAGE_KEYS.MAPBOX_TOKEN) || fallbackToken || '').trim();
  },

  setMapboxToken(token) {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.MAPBOX_TOKEN, token.trim());
    } else {
      localStorage.removeItem(STORAGE_KEYS.MAPBOX_TOKEN);
    }
  },

  getStyleId(defaultStyle = 'mapbox/dark-v11') {
    return localStorage.getItem(STORAGE_KEYS.MAPBOX_STYLE) || defaultStyle;
  },

  setStyleId(styleId) {
    if (styleId) {
      localStorage.setItem(STORAGE_KEYS.MAPBOX_STYLE, styleId.trim());
    }
  },
};

/**
 * Initializes settings dialog and wires up header badge and localStorage.
 *
 * @param {EventTarget} events Shared application event bus
 * @param {Object} instanceSettings Default settings from config.js
 */
export function initSettingsUI(events, instanceSettings) {
  const userHandleBadge = document.querySelector('#current-user-handle');
  const openSettingsBtn = document.querySelector('#open-settings-btn');
  const settingsDialog = document.querySelector('#settings-dialog');
  const closeDialogBtn = document.querySelector('#close-settings-dialog-btn');
  const cancelDialogBtn = document.querySelector('#cancel-settings-btn');
  const settingsForm = document.querySelector('#settings-form');
  const authorInput = document.querySelector('#setting-author-input');
  const tokenInput = document.querySelector('#setting-token-input');
  const styleSelect = document.querySelector('#setting-style-select');

  // Load initial values from localStorage (or instanceSettings defaults)
  const currentAuthor = UserStorage.getAuthor('Anonymous Explorer');
  const currentToken = UserStorage.getMapboxToken(instanceSettings.mapboxToken);
  const currentStyle = UserStorage.getStyleId(instanceSettings.mapboxStyleId);

  if (userHandleBadge) {
    userHandleBadge.textContent = currentAuthor;
  }

  // Open settings dialog
  const openDialog = () => {
    authorInput.value = UserStorage.getAuthor('Anonymous Explorer');
    tokenInput.value = UserStorage.getMapboxToken(instanceSettings.mapboxToken);
    styleSelect.value = UserStorage.getStyleId(instanceSettings.mapboxStyleId);
    settingsDialog.showModal();
  };

  openSettingsBtn?.addEventListener('click', openDialog);
  document.querySelector('#user-handle-badge')?.addEventListener('click', openDialog);

  closeDialogBtn?.addEventListener('click', () => settingsDialog.close());
  cancelDialogBtn?.addEventListener('click', () => settingsDialog.close());

  // Save settings
  settingsForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const newAuthor = authorInput.value.trim() || 'Anonymous Explorer';
    const newToken = tokenInput.value.trim();
    const newStyle = styleSelect.value;

    const oldToken = UserStorage.getMapboxToken(instanceSettings.mapboxToken);
    const oldStyle = UserStorage.getStyleId(instanceSettings.mapboxStyleId);

    UserStorage.setAuthor(newAuthor);
    UserStorage.setMapboxToken(newToken);
    UserStorage.setStyleId(newStyle);

    if (userHandleBadge) {
      userHandleBadge.textContent = newAuthor;
    }

    settingsDialog.close();

    events.dispatchEvent(new CustomEvent('user-settings-updated', {
      detail: { author: newAuthor, token: newToken, styleId: newStyle },
    }));

    // If map style or token changed, notify map to reload
    if (newToken !== oldToken || newStyle !== oldStyle) {
      events.dispatchEvent(new CustomEvent('map-style-changed', {
        detail: { token: newToken, styleId: newStyle },
      }));
    }
  });
}

