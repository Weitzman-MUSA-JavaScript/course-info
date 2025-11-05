import { Bikeshare } from '../bikeshare.js';
import { Backend } from '../backend.js';
import * as turf from '@turf/turf';

/**
 * Initialize the suggestion form with context-aware questions
 * @param {EventTarget} events - Event bus for component communication
 * @param {HTMLElement} container - DOM container for the form content
 * @param {Object|null} location - GeoJSON Point feature for the suggestion location
 * @param {Object} options - Additional options like nearby stations
 */
async function initSuggestionForm(events, container, location = null, options = {}) {
  const { nearbyStations = [] } = options;
  
  if (!location) {
    // Show location selection prompt
    container.innerHTML = `
      <div class="info-section">
        <h3>Select a Location</h3>
        <p>To suggest a station, please tap on the map or search for an address to select a location first.</p>
        <button class="btn btn-secondary" id="cancel-suggestion">Cancel</button>
      </div>
    `;
    
    const cancelBtn = container.querySelector('#cancel-suggestion');
    cancelBtn.addEventListener('click', () => {
      events.dispatchEvent(new CustomEvent('close-panel'));
    });
    
    // Listen for location selection
    const locationHandler = (e) => {
      events.removeEventListener('set-location', locationHandler);
      initSuggestionForm(events, container, e.detail.location, options);
    };
    events.addEventListener('set-location', locationHandler);
    
    return;
  }

  // Show loading while we get context about the location
  container.innerHTML = `
    <div class="loading">
      Preparing suggestion form...
    </div>
  `;

  try {
    // Get information about the location
    const [isInServiceArea, cityName, closestStation] = await Promise.all([
      Bikeshare.pointIsInServiceArea(location),
      Bikeshare.findCityForPoint(location),
      Bikeshare.closestStation(location)
    ]);

    renderSuggestionForm(events, container, location, {
      isInServiceArea,
      cityName,
      closestStation,
      nearbyStations
    });

  } catch (error) {
    console.error('Error preparing suggestion form:', error);
    container.innerHTML = `
      <div class="message error">
        Error preparing the form. Please try again.
      </div>
    `;
  }
}

/**
 * Render the suggestion form with context-appropriate questions
 * @param {EventTarget} events - Event bus for form submission events
 * @param {HTMLElement} container - DOM container for the form
 * @param {Object} location - GeoJSON Point feature for the suggestion location
 * @param {Object} context - Location context (service area, city, closest station)
 */
function renderSuggestionForm(events, container, location, context) {
  const { isInServiceArea, cityName, closestStation } = context;
  
  // Calculate distance to closest station
  const distanceToClosest = closestStation ? 
    Math.round(turf.distance(location, closestStation, { units: 'meters' })) : null;
  
  const isNearExisting = distanceToClosest && distanceToClosest < 300;

  let html = `
    <form class="suggestion-form" id="suggestion-form">
      <div class="info-section">
        <h3>Location Details</h3>
        <p><strong>City:</strong> ${cityName}</p>
        <p><strong>Service Area:</strong> ${isInServiceArea ? 'Yes' : 'No'}</p>
        ${closestStation ? `<p><strong>Nearest Station:</strong> ${closestStation.properties.name} (${distanceToClosest}m away)</p>` : ''}
      </div>
  `;

  // Show context-specific questions based on proximity to existing stations
  if (isNearExisting) {
    html += `
      <div class="info-section">
        <p><strong>Note:</strong> There's already a station close to this location (${closestStation.properties.name} is only ${distanceToClosest}m away). Why might a new station or additional capacity be useful here?</p>
      </div>
      
      <div class="form-group">
        <label class="form-label" for="reason-near-existing">Why is this location needed? (optional)</label>
        <select class="form-select" id="reason-near-existing" name="reasonNearExisting">
          <option value="">Select a reason...</option>
          <option value="not-accessible">That station isn't as accessible as it looks</option>
          <option value="often-full-empty">That station is too often full/empty, needs more capacity</option>
          <option value="better-location">This is a better location than the existing one</option>
          <option value="high-demand">This area has high demand for bikes</option>
        </select>
      </div>
    `;
  } else {
    html += `
      <div class="form-group">
        <label class="form-label" for="reason-new">Why would this be a good location for a bikeshare station? (optional)</label>
        <select class="form-select" id="reason-new" name="reasonNew">
          <option value="">Select a reason...</option>
          <option value="transit-connection">Near public transit</option>
          <option value="destination">Popular destination</option>
          <option value="residential">Residential area needs access</option>
          <option value="workplace">Near offices/workplace</option>
          <option value="gap-in-network">Fills gap in station network</option>
          <option value="safe-secure">Safe and secure location</option>
        </select>
      </div>
    `;
  }

  // Optional additional comments
  html += `
    <div class="form-group">
      <label class="form-label" for="comments">Additional comments (optional)</label>
      <textarea class="form-textarea" id="comments" name="comments" 
                placeholder="Any additional details about why this would be a good location..."></textarea>
    </div>

    <div class="info-section">
      <p><strong>Important:</strong> Suggestions are considered in aggregate and help inform planning decisions. Individual suggestions do not guarantee that a station will be installed.</p>
      <p>For direct feedback, contact ${cityName}'s transportation department.</p>
    </div>

    <div style="display: flex; gap: 12px; margin-top: 20px;">
      <button type="submit" class="btn btn-primary">Submit Suggestion</button>
      <button type="button" class="btn btn-secondary" id="cancel-form">Cancel</button>
    </div>
  </form>
  `;

  container.innerHTML = html;

  // Add event listeners
  const form = container.querySelector('#suggestion-form');
  const cancelBtn = container.querySelector('#cancel-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleFormSubmit(events, form, location, context);
  });

  cancelBtn.addEventListener('click', () => {
    events.dispatchEvent(new CustomEvent('close-panel'));
  });
}

/**
 * Handle form submission, validate data, and save suggestion to backend
 * @param {EventTarget} events - Event bus for dispatching save events
 * @param {HTMLFormElement} form - The suggestion form element
 * @param {Object} location - GeoJSON Point feature for the suggestion location
 * @param {Object} context - Location context information
 */
async function handleFormSubmit(events, form, location, context) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Show loading state
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;

  // Dispatch submission start event
  events.dispatchEvent(new CustomEvent('save-suggestion:submit'));

  try {
    // Collect form data
    const formData = new FormData(form);
    const suggestionData = {
      location: location,
      city: context.cityName,
      inServiceArea: context.isInServiceArea,
      reasonNearExisting: formData.get('reasonNearExisting') || null,
      reasonNew: formData.get('reasonNew') || null,
      comments: formData.get('comments') || null,
      timestamp: new Date().toISOString(),
      closestStation: context.closestStation ? {
        id: context.closestStation.id,
        name: context.closestStation.properties.name,
        distance: Math.round(turf.distance(location, context.closestStation, { units: 'meters' }))
      } : null
    };

    // Save the suggestion
    const result = await Backend.saveSuggestion(suggestionData);
    
    // Dispatch success event
    events.dispatchEvent(new CustomEvent('save-suggestion:success', {
      detail: { suggestion: result }
    }));
    
    events.dispatchEvent(new CustomEvent('save-suggestion:complete', {
      detail: { success: true, suggestion: result }
    }));

  } catch (error) {
    console.error('Error submitting suggestion:', error);
    
    // Show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message error';
    errorDiv.textContent = 'Error submitting suggestion. Please try again.';
    form.insertBefore(errorDiv, form.firstChild);
    
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Dispatch error event
    events.dispatchEvent(new CustomEvent('save-suggestion:error', {
      detail: { error }
    }));
    
    events.dispatchEvent(new CustomEvent('save-suggestion:complete', {
      detail: { success: false, error }
    }));
  }
}

export { initSuggestionForm };