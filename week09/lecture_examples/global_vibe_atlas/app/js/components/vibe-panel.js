/**
 * Vibe Content Panel Component (Bottom Sheet on Mobile, Side Panel on Desktop)
 *
 * Displays:
 * 1. Selected Vibe Pin Details & "Feel This Vibe (+1)" Endorsement Button
 * 2. New Vibe Pin Submission Form
 */

import { VIBE_CATEGORIES } from '../config.js';
import { UserStorage } from '../storage.js';
import { getMapCenter } from './globe-map.js';

let panelElement = null;
let panelTitleElement = null;
let panelBodyElement = null;
let closeBtn = null;
let dropPinBtn = null;
let currentLocation = null;

/**
 * Initializes the sliding vibe panel and its interaction triggers.
 *
 * @param {EventTarget} events Application event bus
 * @param {HTMLElement} element The #content-panel DOM element
 */
export function initVibePanel(events, element) {
  panelElement = element;
  panelTitleElement = element.querySelector('#panel-title');
  panelBodyElement = element.querySelector('#panel-body');
  closeBtn = element.querySelector('#close-panel-btn');
  dropPinBtn = document.querySelector('#drop-pin-btn');

  // Close panel trigger
  closeBtn?.addEventListener('click', () => {
    hidePanel(events);
  });

  // "Drop a Vibe Pin Here" button trigger (uses map center if no point selected)
  dropPinBtn?.addEventListener('click', () => {
    const targetLoc = currentLocation || {
      ...getMapCenter(),
      placeName: 'Selected Map Location',
    };
    showNewPinForm(events, targetLoc);
  });

  // Event bus listeners
  setupPanelEventListeners(events);
}

/**
 * Setup listeners on the shared event bus.
 */
function setupPanelEventListeners(events) {
  // When user selects a location via map click, search, or geolocation
  events.addEventListener('set-location', (e) => {
    currentLocation = e.detail;
    showNewPinForm(events, currentLocation);
  });

  // When user clicks an existing marker pin on the map
  events.addEventListener('pin-selected', (e) => {
    const pin = e.detail?.pin;
    if (pin) {
      showPinDetails(events, pin);
    }
  });

  // When a pin is successfully saved
  events.addEventListener('save-pin:success', (e) => {
    const savedPin = e.detail?.pin;
    showThankYouView(events, savedPin);
  });
}

/**
 * Opens the sliding panel.
 */
export function showPanel() {
  if (!panelElement) return;
  panelElement.classList.remove('hidden');
}

/**
 * Closes the sliding panel.
 */
export function hidePanel(events) {
  if (!panelElement) return;
  panelElement.classList.add('hidden');
  events.dispatchEvent(new CustomEvent('unset-location'));
}

/**
 * Displays details for an existing pin, including the live endorsement button.
 */
export function showPinDetails(events, pin) {
  const categoryInfo = VIBE_CATEGORIES[pin.vibeCategory] || {
    icon: '📍',
    color: '#011f5b',
    label: 'Street Vibe',
  };

  panelTitleElement.textContent = pin.placeName || 'Street Vibe Details';

  const energyLevel = pin.energyLevel || 3;
  const energyMeter = '⚡'.repeat(energyLevel) + '⚪'.repeat(5 - energyLevel);
  const formattedDate = pin.submittedAt ? new Date(pin.submittedAt).toLocaleDateString() : 'Recent';

  panelBodyElement.innerHTML = `
    <div class="vibe-detail-card">
      <div class="vibe-badge" data-category="${pin.vibeCategory || 'other'}" style="background-color: ${categoryInfo.color};">
        <span>${categoryInfo.icon}</span>
        <span>${categoryInfo.label}</span>
      </div>

      <div class="energy-meter">
        <strong>Energy Level:</strong>
        <span class="energy-dots" title="${energyLevel} out of 5">${energyMeter}</span>
        <span>(${energyLevel}/5)</span>
      </div>

      <blockquote class="sensory-note-quote">
        "${pin.sensoryNote || 'No sensory notes provided.'}"
      </blockquote>

      <div class="pin-meta">
        <p><strong>Contributed by:</strong> ${pin.author || 'Anonymous Explorer'}</p>
        <p><strong>Logged on:</strong> ${formattedDate}</p>
        <p><strong>Coordinates:</strong> [${pin.location?.geometry?.coordinates?.[0]?.toFixed(4)}, ${pin.location?.geometry?.coordinates?.[1]?.toFixed(4)}]</p>
      </div>

      <div class="card-actions" style="margin-top: 0.5rem;">
        <button id="endorse-pin-btn" class="btn btn-primary" style="width: 100%;">
          <span>✨ Feel This Vibe</span>
          <span id="endorsement-counter">(+${pin.endorsements || 1})</span>
        </button>
      </div>
    </div>
  `;

  // Wire up endorsement (+1) button
  const endorseBtn = panelBodyElement.querySelector('#endorse-pin-btn');
  const counterSpan = panelBodyElement.querySelector('#endorsement-counter');

  endorseBtn?.addEventListener('click', () => {
    const newCount = (pin.endorsements || 1) + 1;
    pin.endorsements = newCount;
    counterSpan.textContent = `(+${newCount})`;
    endorseBtn.classList.add('pulse');

    events.dispatchEvent(new CustomEvent('endorse-pin', {
      detail: { pinId: pin.id, delta: 1 },
    }));
  });

  showPanel();
}

/**
 * Displays the form to submit a new sensory vibe pin.
 */
export function showNewPinForm(events, location) {
  panelTitleElement.textContent = 'Log a Street Vibe';

  const defaultAuthor = UserStorage.getAuthor('Anonymous Explorer');
  const initialPlaceName = location.placeName || 'Selected Location';
  const coords = [location.lng || 0, location.lat || 0];

  const categoryOptions = Object.values(VIBE_CATEGORIES).map(cat => `
    <option value="${cat.id}">
      ${cat.icon} ${cat.label}
    </option>
  `).join('');

  panelBodyElement.innerHTML = `
    <form id="new-vibe-form" class="vibe-form">
      <div class="form-group">
        <label for="form-place-name">Place / Street Name:</label>
        <input type="text" id="form-place-name" value="${initialPlaceName}" required>
      </div>

      <div class="form-group">
        <label for="form-vibe-category">Dominant Sensory Vibe:</label>
        <select id="form-vibe-category" required>
          ${categoryOptions}
        </select>
      </div>

      <div class="form-group">
        <label for="form-energy-level">Energy Level (1 = Zen / Quiet, 5 = Electric / Chaotic):</label>
        <div class="form-range-wrapper">
          <input type="range" id="form-energy-level" min="1" max="5" value="3" step="1">
          <span id="range-indicator" style="font-family: var(--font-mono); font-weight: bold;">⚡ 3/5</span>
        </div>
      </div>

      <div class="form-group">
        <label for="form-sensory-note">Sensory Memory / What do you hear, smell, and see?:</label>
        <textarea id="form-sensory-note" rows="3" placeholder="e.g., Sizzling woks, scooters humming, neon reflection on wet pavement..." required></textarea>
        <small class="form-help">Capture the unique atmosphere of this corner for other explorers.</small>
      </div>

      <div class="form-group">
        <label for="form-author-name">Contributor Name:</label>
        <input type="text" id="form-author-name" value="${defaultAuthor}" required>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" id="submit-pin-btn" style="flex: 1;">
          <span>🌐</span>
          <span>Share to Global Atlas</span>
        </button>
        <button type="button" class="btn btn-secondary" id="cancel-form-btn">
          Cancel
        </button>
      </div>
    </form>
  `;

  // Range slider visual feedback
  const rangeInput = panelBodyElement.querySelector('#form-energy-level');
  const rangeIndicator = panelBodyElement.querySelector('#range-indicator');
  rangeInput?.addEventListener('input', () => {
    rangeIndicator.textContent = `⚡ ${rangeInput.value}/5`;
  });

  // Cancel button
  panelBodyElement.querySelector('#cancel-form-btn')?.addEventListener('click', () => {
    hidePanel(events);
  });

  // Form submit handler
  const form = panelBodyElement.querySelector('#new-vibe-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const placeName = panelBodyElement.querySelector('#form-place-name').value.trim();
    const vibeCategory = panelBodyElement.querySelector('#form-vibe-category').value;
    const energyLevel = parseInt(panelBodyElement.querySelector('#form-energy-level').value, 10);
    const sensoryNote = panelBodyElement.querySelector('#form-sensory-note').value.trim();
    const author = panelBodyElement.querySelector('#form-author-name').value.trim() || 'Anonymous Explorer';

    // Save author to localStorage so the student doesn't have to retype it
    UserStorage.setAuthor(author);
    document.querySelector('#current-user-handle').textContent = author;

    const pinData = {
      placeName,
      vibeCategory,
      energyLevel,
      sensoryNote,
      author,
      location: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coords,
        },
      },
      endorsements: 1,
      submittedAt: new Date().toISOString(),
    };

    const submitBtn = panelBodyElement.querySelector('#submit-pin-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving to Atlas...';

    events.dispatchEvent(new CustomEvent('save-pin:submit', {
      detail: { pinData },
    }));
  });

  showPanel();
}

/**
 * Displays thank you confirmation after saving.
 */
function showThankYouView(events, pin) {
  panelTitleElement.textContent = 'Vibe Logged!';

  panelBodyElement.innerHTML = `
    <div class="thank-you-view" style="text-align: center; padding: 1rem 0;">
      <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎉</div>
      <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">Added to the Global Atlas!</h3>
      <p style="font-size: 0.9rem; color: #444; margin-bottom: 1rem;">
        Your observation for <strong>${pin?.placeName || 'this location'}</strong> is now visible to everyone exploring the atlas.
      </p>
      <button id="close-thank-you-btn" class="btn btn-primary" style="margin: auto;">
        Explore the Globe
      </button>
    </div>
  `;

  panelBodyElement.querySelector('#close-thank-you-btn')?.addEventListener('click', () => {
    hidePanel(events);
  });
}

