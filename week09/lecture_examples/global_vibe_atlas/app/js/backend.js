/**
 * Backend Service - Starter Version (app/)
 *
 * Currently stores pins in your browser's localStorage!
 *
 * In class today, we will follow the TODO comments below to replace localStorage
 * with Google Cloud Firestore, turning this into a live, collaborative multiplayer app!
 *
 * =========================================================================
 * TODAY'S CODE-ALONG ROADMAP:
 * - Act 2: Connecting Firebase & writing pins with addDoc()
 * - Act 3: Reading pins & subscribing to live updates with onSnapshot()
 * - Act 4: Server-side filtering with query() and where()
 * =========================================================================
 */

// TODO (Act 2): Import Firebase modules from Google CDN
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
// import {
//   getFirestore,
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   where,
//   onSnapshot,
//   doc,
//   updateDoc,
//   increment,
// } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';
// import { firebaseConfig } from './config.js';

// TODO (Act 2): Initialize Firebase and Firestore database
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

const STORAGE_KEY = 'global-vibe-atlas-pins';

// Initial sample seed pins so students see global points on the globe immediately
const SAMPLE_PINS = [
  {
    id: 'sample_taipei',
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
    id: 'sample_nairobi',
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
    id: 'sample_mexico_city',
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
    id: 'sample_philly',
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

  /**
   * Initializes the backend service and loads initial pins.
   */
  async init(events, initialFilter = 'all') {
    Backend.events = events;
    Backend.currentFilter = initialFilter;

    // Listen for form submissions from vibe-panel.js
    events.addEventListener('save-pin:submit', async (e) => {
      const pinData = e.detail?.pinData;
      if (pinData) {
        await Backend.savePin(pinData);
      }
    });

    // Listen for "+1 Feel This Vibe" endorsements
    events.addEventListener('endorse-pin', async (e) => {
      const { pinId, delta } = e.detail;
      await Backend.endorsePin(pinId, delta);
    });

    // Listen for filter changes from the dropdown
    events.addEventListener('filter-changed', async (e) => {
      Backend.currentFilter = e.detail?.filter || 'all';
      await Backend.loadPins();
    });

    // Initial load
    await Backend.loadPins();
  },

  /**
   * Saves a new pin.
   *
   * Starter implementation: saves to browser localStorage.
   * TODO (Act 2): Replace this with Firestore `addDoc(collection(db, 'vibe_pins'), pinData)`.
   */
  async savePin(pinData) {
    console.log('[backend-starter] Saving pin to localStorage:', pinData);

    // Create a client-side record with an ID
    const newPin = {
      id: `pin_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ...pinData,
    };

    const pins = Backend._getLocalPins();
    pins.unshift(newPin);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));

    // Dispatch success to close the form and show confirmation
    Backend.events.dispatchEvent(new CustomEvent('save-pin:success', {
      detail: { pin: newPin },
    }));

    // Refresh rendered pins
    await Backend.loadPins();
    return newPin;
  },

  /**
   * Adds an endorsement (+1) to a pin.
   *
   * Starter implementation: updates localStorage.
   * TODO (Act 3 stretch): Use Firestore `updateDoc` with `increment(delta)`.
   */
  async endorsePin(pinId, delta = 1) {
    console.log(`[backend-starter] Endorsing pin ${pinId} (+${delta})`);
    const pins = Backend._getLocalPins();
    const pin = pins.find(p => p.id === pinId);
    if (pin) {
      pin.endorsements = (pin.endorsements || 1) + delta;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
      await Backend.loadPins();
    }
  },

  /**
   * Loads pins and dispatches `pins-updated` on the event bus.
   *
   * Starter implementation: reads localStorage.
   * TODO (Act 3): Replace with real-time `onSnapshot(queryRef, (snapshot) => ...)`
   * TODO (Act 4): Add server-side `where('vibeCategory', '==', filter)`
   */
  async loadPins() {
    let pins = Backend._getLocalPins();

    // Client-side filtering in starter version
    if (Backend.currentFilter && Backend.currentFilter !== 'all') {
      pins = pins.filter(p => p.vibeCategory === Backend.currentFilter);
    }

    Backend.events?.dispatchEvent(new CustomEvent('pins-updated', {
      detail: { pins },
    }));
  },

  /**
   * Internal helper: retrieves pins array from localStorage (or seeds initial sample pins).
   */
  _getLocalPins() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PINS));
      return [...SAMPLE_PINS];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...SAMPLE_PINS];
    }
  },
};

