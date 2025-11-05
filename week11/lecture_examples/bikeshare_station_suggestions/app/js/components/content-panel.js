import { initLocationInfo } from './location-info.js';
import { initSuggestionForm } from './suggestion-form.js';

let currentView = null; // 'location-info', 'suggestion-form', null
let contentPanelElement;

/**
 * Initialize the sliding content panel component
 * @param {EventTarget} events - Event bus for component communication
 * @param {HTMLElement} element - DOM element for the content panel
 */
function initContentPanel(events, element) {
  contentPanelElement = element;
  
  // Set initial state
  element.classList.add('hidden');
  
  // Set up event listeners
  setupEventListeners(events);
}

/**
 * Set up event listeners for panel show/hide and user interactions
 * @param {EventTarget} events - Event bus for listening to application events
 */
function setupEventListeners(events) {
  // Listen for location selection
  events.addEventListener('set-location', (e) => {
    showLocationInfo(events, e.detail.location);
  });

  // Listen for suggestion form request
  events.addEventListener('show-suggestion-form', (e) => {
    const location = e.detail?.location || null;
    const options = e.detail || {};
    showSuggestionForm(events, location, options);
  });

  // Listen for panel close requests
  events.addEventListener('close-panel', () => {
    hidePanel(events);
  });

  // Listen for suggestion save completion
  events.addEventListener('save-suggestion:complete', (e) => {
    if (e.detail.success) {
      showThankYouMessage(events, e.detail.suggestion);
    }
  });

  // Add escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentView) {
      hidePanel(events);
    }
  });
}

/**
 * Show the content panel with slide-in animation
 */
function showPanel() {
  contentPanelElement.classList.remove('hidden');
  contentPanelElement.classList.add('open');
}

/**
 * Hide the content panel with slide-out animation and clear selected location
 * @param {EventTarget} events - Event bus for dispatching unset-location event
 */
function hidePanel(events) {
  contentPanelElement.classList.remove('open');
  contentPanelElement.classList.add('hidden');
  currentView = null;
  
  // Clear selected location when closing panel
  events.dispatchEvent(new CustomEvent('unset-location'));
}

/**
 * Show location information panel for the selected location
 * @param {EventTarget} events - Event bus for component communication
 * @param {Object} location - GeoJSON Point feature for the selected location
 */
function showLocationInfo(events, location) {
  currentView = 'location-info';
  
  contentPanelElement.innerHTML = `
    <div class="panel-header">
      <div class="panel-handle"></div>
      <h2 class="panel-title">Location Information</h2>
    </div>
    <div class="panel-content">
      <div id="location-info-container"></div>
    </div>
  `;

  const locationInfoContainer = contentPanelElement.querySelector('#location-info-container');
  initLocationInfo(events, locationInfoContainer, location);
  
  showPanel();
}

/**
 * Show the suggestion form panel
 * @param {EventTarget} events - Event bus for component communication
 * @param {Object|null} location - GeoJSON Point feature for the suggestion location
 * @param {Object} options - Additional options like nearby stations
 */
function showSuggestionForm(events, location = null, options = {}) {
  currentView = 'suggestion-form';
  
  contentPanelElement.innerHTML = `
    <div class="panel-header">
      <div class="panel-handle"></div>
      <h2 class="panel-title">Suggest a Station</h2>
    </div>
    <div class="panel-content">
      <div id="suggestion-form-container"></div>
    </div>
  `;

  const suggestionFormContainer = contentPanelElement.querySelector('#suggestion-form-container');
  initSuggestionForm(events, suggestionFormContainer, location, options);
  
  showPanel();
}

/**
 * Show thank you message after successful suggestion submission
 * @param {EventTarget} events - Event bus for component communication
 * @param {Object} suggestion - The submitted suggestion object
 */
function showThankYouMessage(events, suggestion) {
  currentView = null;
  
  contentPanelElement.innerHTML = `
    <div class="panel-header">
      <div class="panel-handle"></div>
      <h2 class="panel-title">Thank You!</h2>
    </div>
    <div class="panel-content">
      <div class="message success">
        <p>Your suggestion has been submitted successfully!</p>
      </div>
      <div class="info-section">
        <h3>What happens next?</h3>
        <p>Your suggestion will be considered along with others in the area. The city reviews suggestions regularly and uses them to help plan future bikeshare expansion.</p>
        <p>For direct feedback on bikeshare planning, contact your city's transportation department.</p>
      </div>
      <button class="btn btn-primary" id="close-thank-you">Close</button>
    </div>
  `;

  const closeBtn = contentPanelElement.querySelector('#close-thank-you');
  closeBtn.addEventListener('click', () => {
    hidePanel(events);
  });
  
  showPanel();
  
  // Auto-close after 5 seconds
  setTimeout(() => {
    if (currentView === null) {
      hidePanel(events);
    }
  }, 5000);
}

export { initContentPanel };