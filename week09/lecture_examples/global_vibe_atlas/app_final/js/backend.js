/**
 * Backend Service - Completed Version (app_final/)
 *
 * Persists all vibe observations and endorsements to Google Cloud Firestore!
 *
 * Demonstrates:
 * 1. Initializing Firebase & Firestore (initializeApp, getFirestore)
 * 2. Writing documents to a collection (addDoc, collection)
 * 3. Server-side query filtering (query, where)
 * 4. Real-time push subscriptions (onSnapshot)
 * 5. Atomic document field increments (doc, updateDoc, increment)
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';
import _ from 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm';
import { firebaseConfig } from './config.js';

// Initialize Firebase App & Cloud Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const COLLECTION_NAME = 'vibe_pins';

// Seed sample pins to show on initial empty database
const SEED_PINS = [
  {
    placeName: 'Raohe Street Night Market, Taipei',
    vibeCategory: 'night_market_food',
    energyLevel: 5,
    sensoryNote: 'Sizzling black pepper buns in tandoor-style ovens, herbal medicinal soups, neon temple glow, scooters weaving through alleys.',
    author: 'Mei-Ling',
    location: {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [121.5775, 25.0509] },
    },
    endorsements: 12,
    submittedAt: '2026-10-20T14:30:00.000Z',
  },
  {
    placeName: 'Tom Mboya Street, Nairobi',
    vibeCategory: 'bustling_transit_chaos',
    energyLevel: 5,
    sensoryNote: 'Vibrant graffiti-painted matatus blasting gengetone music, conductors whistling rhythmically, roasted maize smoke in the evening breeze.',
    author: 'Karanja',
    location: {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [36.8258, -1.2841] },
    },
    endorsements: 8,
    submittedAt: '2026-10-20T16:15:00.000Z',
  },
  {
    placeName: 'Parque México, Condesa, Mexico City',
    vibeCategory: 'nature_water_sanctuary',
    energyLevel: 2,
    sensoryNote: 'Towering jacaranda trees dropping purple blossoms, art deco fountains splashing, dogs playing on grassy paths, acoustic guitar echoing.',
    author: 'Mateo',
    location: {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-99.1687, 19.4124] },
    },
    endorsements: 15,
    submittedAt: '2026-10-20T18:00:00.000Z',
  },
  {
    placeName: '46th & Baltimore Ave, West Philadelphia',
    vibeCategory: 'street_music_culture',
    energyLevel: 4,
    sensoryNote: 'Trolley metal wheels squealing on the turn, jazz porchfest brass horns echoing through Victorian porches, Ethiopian coffee beans roasting.',
    author: 'MUSA Explorer',
    location: {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-75.2155, 39.9486] },
    },
    endorsements: 19,
    submittedAt: '2026-10-21T01:00:00.000Z',
  },
];

export const Backend = {
  events: null,
  currentFilter: 'all',
  unsubscribeSnapshot: null,
  pendingDeltas: {}, // Accumulated endorsements per pin before flushing

  /**
   * Initializes the backend service, seeds if needed, and starts real-time subscription.
   */
  async init(events, initialFilter = 'all') {
    Backend.events = events;
    Backend.currentFilter = initialFilter;

    // Listen for pin submissions from vibe-panel.js
    events.addEventListener('save-pin:submit', async (e) => {
      const pinData = e.detail?.pinData;
      if (pinData) {
        await Backend.savePin(pinData);
      }
    });

    // Listen for "+1 Feel This Vibe" endorsements
    events.addEventListener('endorse-pin', (e) => {
      const { pinId, delta } = e.detail;
      Backend.endorsePin(pinId, delta);
    });

    // Listen for filter changes from the dropdown
    events.addEventListener('filter-changed', (e) => {
      const newFilter = e.detail?.filter || 'all';
      Backend.currentFilter = newFilter;
      Backend.subscribeToPins(newFilter);
    });

    // Seed sample pins if the database collection is currently empty
    await Backend._checkAndSeedDatabase();

    // Start real-time onSnapshot listener
    Backend.subscribeToPins(initialFilter);
  },

  /**
   * Writes a new pin to Cloud Firestore using addDoc().
   *
   * @param {Object} pinData Pin properties
   */
  async savePin(pinData) {
    console.log('[backend-final] Writing pin to Cloud Firestore...', pinData);

    try {
      const collRef = collection(db, COLLECTION_NAME);
      const docPayload = {
        ...pinData,
        submittedAt: pinData.submittedAt || serverTimestamp(),
      };

      const docRef = await addDoc(collRef, docPayload);
      console.log('[backend-final] Document successfully written with ID:', docRef.id);

      const savedPin = { id: docRef.id, ...docPayload };

      // Notify UI of success
      Backend.events.dispatchEvent(new CustomEvent('save-pin:success', {
        detail: { pin: savedPin },
      }));

      return savedPin;
    } catch (err) {
      console.error('[backend-final] Error adding document to Firestore:', err);
      alert('Error saving pin to Firestore. Please check console for details.');
      throw err;
    }
  },

  /**
   * Subscribes to real-time updates from Firestore via onSnapshot().
   * Uses query() and where() for server-side filtering when a category is selected.
   *
   * @param {string} filter 'all' or category ID
   */
  subscribeToPins(filter = 'all') {
    // Unsubscribe from any previous onSnapshot listener
    if (typeof Backend.unsubscribeSnapshot === 'function') {
      Backend.unsubscribeSnapshot();
      Backend.unsubscribeSnapshot = null;
    }

    console.log(`[backend-final] Subscribing to Firestore collection '${COLLECTION_NAME}' with filter: '${filter}'`);

    const collRef = collection(db, COLLECTION_NAME);
    let targetQuery;

    if (filter && filter !== 'all') {
      // Server-side filtering in Firestore!
      targetQuery = query(collRef, where('vibeCategory', '==', filter));
    } else {
      targetQuery = collRef;
    }

    // Attach onSnapshot listener ("addEventListener for your database")
    Backend.unsubscribeSnapshot = onSnapshot(
      targetQuery,
      (querySnapshot) => {
        const pins = [];
        querySnapshot.forEach((docSnap) => {
          pins.push({
            id: docSnap.id,
            ...docSnap.data(),
          });
        });

        // Sort in client memory by submittedAt descending (newest first)
        pins.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));

        console.log(`[backend-final] onSnapshot pushed ${pins.length} pins from Firestore.`);

        Backend.events?.dispatchEvent(new CustomEvent('pins-updated', {
          detail: { pins, filter },
        }));
      },
      (error) => {
        console.error('[backend-final] Firestore onSnapshot subscription error:', error);
      }
    );
  },

  /**
   * Endorses a pin using Firestore updateDoc() + increment() with debouncing.
   *
   * @param {string} pinId Document ID
   * @param {number} delta Incremental endorsement count
   */
  endorsePin(pinId, delta = 1) {
    if (!pinId) return;

    // Accumulate deltas
    Backend.pendingDeltas[pinId] = (Backend.pendingDeltas[pinId] || 0) + delta;

    // Flush debounced
    Backend._debouncedFlushEndorsement(pinId);
  },

  /**
   * Debounced worker that sends the accumulated endorsement delta to Firestore.
   */
  _debouncedFlushEndorsement: _.debounce(async (pinId) => {
    const delta = Backend.pendingDeltas[pinId];
    if (!delta) return;

    delete Backend.pendingDeltas[pinId];

    try {
      console.log(`[backend-final] Flushing ${delta} endorsement(s) to Firestore for doc: ${pinId}`);
      const pinRef = doc(db, COLLECTION_NAME, pinId);
      await updateDoc(pinRef, {
        endorsements: increment(delta),
      });
    } catch (err) {
      console.warn(`[backend-final] Could not update endorsement in Firestore for doc ${pinId}:`, err);
    }
  }, 1000),

  /**
   * Internal helper: checks if the collection has any documents; if empty, adds initial seed pins.
   */
  async _checkAndSeedDatabase() {
    try {
      const collRef = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(collRef);

      if (snapshot.empty) {
        console.log('[backend-final] Firestore collection is empty. Seeding initial global pins...');
        for (const pin of SEED_PINS) {
          await addDoc(collRef, pin);
        }
        console.log('[backend-final] Seed pins successfully created in Firestore.');
      }
    } catch (err) {
      console.warn('[backend-final] Note on initial seeding check (may be permission/network related):', err);
    }
  },
};

