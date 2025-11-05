// Set up Firestore connection
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxGc-5vViXRVYX6AhUcoiPfdpilRKGROo",
  authDomain: "bikeshare-station-suggestions.firebaseapp.com",
  projectId: "bikeshare-station-suggestions",
  storageBucket: "bikeshare-station-suggestions.firebasestorage.app",
  messagingSenderId: "43424665335",
  appId: "1:43424665335:web:aa8b7904e61a3f36d54df2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initalize Firestore connection
const db = getFirestore(app);
  
// Mock backend service for demonstration
// In a real application, this would connect to a backend API like Firebase, Supabase, etc.

/**
 * Mock backend service for managing bikeshare station suggestions
 * Uses localStorage for data persistence in this demo
 */
const Backend = {
  suggestions: [],

  /**
   * Save a new bikeshare station suggestion
   * @param {Object} suggestionData - The suggestion data to save
   * @param {Object} suggestionData.location - GeoJSON Point feature
   * @param {string} suggestionData.city - City name
   * @param {boolean} suggestionData.inServiceArea - Whether location is in service area
   * @param {string|null} suggestionData.reasonNearExisting - Reason for suggestion near existing station
   * @param {string|null} suggestionData.reasonNew - Reason for new station location
   * @param {string|null} suggestionData.comments - Additional comments
   * @param {string} suggestionData.timestamp - ISO timestamp
   * @param {Object|null} suggestionData.closestStation - Closest station info
   * @returns {Promise<Object>} The saved suggestion with generated ID
   * @throws {Error} Network error simulation
   */
  async saveSuggestion(suggestionData) {
    // Create suggestion record
    const suggestion = {
      id: `suggestion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...suggestionData,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    // // Save to localStorage (simulating database)
    // const suggestions = JSON.parse(localStorage.getItem('bikeshare-suggestions') || '[]');
    // suggestions.push(suggestion);
    // localStorage.setItem('bikeshare-suggestions', JSON.stringify(suggestions));

    try {
      const coll = collection(db, "suggestions");
      const docRef = await addDoc(coll, suggestion);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    // Also keep in-memory copy for this session
    Backend.suggestions.push(suggestion);

    console.log('Suggestion saved:', suggestion);
    return suggestion;
  },

  _loadSuggestionsPromise: null,

  /**
   * Internal helper to load all suggestions
   * @returns {Promise<Array>} Array of all suggestion objects
   */
  async _loadSuggestionsHelper() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // const suggestions = JSON.parse(localStorage.getItem('bikeshare-suggestions') || '[]');
    const coll = collection(db, "suggestions");
    const querySnapshot = await getDocs(coll);
    const suggestions = querySnapshot.docs.map(doc => doc.data());

    // querySnapshot.forEach((doc) => {
    //   suggestions.push(doc.data());
    // });

    console.log('Suggestions loaded:', suggestions);
    return suggestions;
  },

  async loadSuggestions(events) {
    if (Backend.suggestions.length > 0) { return }

    events.dispatchEvent(new CustomEvent('load-suggestions'));
    Backend._loadSuggestionsPromise ||= Backend._loadSuggestionsHelper();
    try {
      const suggestions = await Backend._loadSuggestionsPromise;
      Backend.suggestions = suggestions;
      events.dispatchEvent(new CustomEvent('load-suggestions:success', { detail: { suggestions } }));
    } catch (error) {
      console.error('Error loading suggestions:', error);
      events.dispatchEvent(new CustomEvent('load-suggestions:error', { detail: { error } }));
    }
  },

  /**
   * Get all stored suggestions
   * @returns {Promise<Array>} Array of all suggestion objects
   */
  async getSuggestions() {
    await Backend.loadSuggestions();
    return Backend.suggestions;
  },

  /**
   * Get suggestions within a geographic bounding box
   * @param {Object} bounds - Bounding box coordinates
   * @param {number} bounds.west - Western longitude
   * @param {number} bounds.east - Eastern longitude
   * @param {number} bounds.south - Southern latitude
   * @param {number} bounds.north - Northern latitude
   * @returns {Promise<Array>} Array of suggestions within bounds
   */
  async getSuggestionsByArea(bounds) {
    // Filter suggestions within bounds (simple bbox check)
    const suggestions = await Backend.getSuggestions();
    return suggestions.filter(suggestion => {
      const [lng, lat] = suggestion.location.geometry.coordinates;
      return lng >= bounds.west && lng <= bounds.east && 
             lat >= bounds.south && lat <= bounds.north;
    });
  },

  /**
   * Update the status of a suggestion (admin function)
   * @param {string} id - Suggestion ID
   * @param {string} status - New status value
   * @returns {Promise<Object>} Updated suggestion object
   * @throws {Error} If suggestion not found
   */
  async updateSuggestionStatus(id, status) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const suggestion = Backend.suggestions.find(s => s.id === id);
    if (suggestion) {
      suggestion.status = status;
      suggestion.updatedAt = new Date().toISOString();
      localStorage.setItem('bikeshare-suggestions', JSON.stringify(Backend.suggestions));
      return suggestion;
    }
    throw new Error('Suggestion not found');
  },

  /**
   * Delete a suggestion (admin function)
   * @param {string} id - Suggestion ID to delete
   * @returns {Promise<Object>} Deleted suggestion object
   * @throws {Error} If suggestion not found
   */
  async deleteSuggestion(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = Backend.suggestions.findIndex(s => s.id === id);
    if (index !== -1) {
      const deleted = Backend.suggestions.splice(index, 1)[0];
      localStorage.setItem('bikeshare-suggestions', JSON.stringify(Backend.suggestions));
      return deleted;
    }
    throw new Error('Suggestion not found');
  },

  /**
   * Clear all suggestion data (utility function for demo)
   */
  clearAllSuggestions() {
    Backend.suggestions = [];
    localStorage.removeItem('bikeshare-suggestions');
    console.log('All suggestions cleared');
  },

  /**
   * Get summary statistics about stored suggestions
   * @returns {Object} Statistics object with total, byCity, byStatus, and recentCount
   */
  getStats() {
    const total = Backend.suggestions.length;
    const byCity = {};
    const byStatus = {};
    
    Backend.suggestions.forEach(suggestion => {
      const city = suggestion.city || 'Unknown';
      const status = suggestion.status || 'unknown';
      
      byCity[city] = (byCity[city] || 0) + 1;
      byStatus[status] = (byStatus[status] || 0) + 1;
    });

    return {
      total,
      byCity,
      byStatus,
      recentCount: Backend.suggestions.filter(s => {
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);
        return new Date(s.submittedAt) > dayAgo;
      }).length
    };
  }
};

// Add some demo data if none exists
if (JSON.parse(localStorage.getItem('bikeshare-suggestions') || '[]').length === 0) {
  // Add a few sample suggestions for demo purposes
  const sampleSuggestions = [
    {
      id: 'demo_1',
      location: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-71.0589, 42.3601]
        }
      },
      city: 'Boston',
      inServiceArea: true,
      reasonNew: 'transit-connection',
      comments: 'Near the Common - lots of foot traffic',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: 'submitted',
      submittedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'demo_2', 
      location: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-71.0942, 42.3398]
        }
      },
      city: 'Cambridge',
      inServiceArea: true,
      reasonNearExisting: 'often-full-empty',
      comments: 'Harvard Square station is always full during rush hour',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      status: 'submitted',
      submittedAt: new Date(Date.now() - 172800000).toISOString(),
      closestStation: {
        id: '67',
        name: 'Harvard Square at Mass Ave/ Dunster',
        distance: 150
      }
    }
  ];
  
  localStorage.setItem('bikeshare-suggestions', JSON.stringify(sampleSuggestions));
}

export { Backend };