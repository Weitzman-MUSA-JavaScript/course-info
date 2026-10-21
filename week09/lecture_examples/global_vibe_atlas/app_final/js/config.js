/**
 * Global Street Vibe Atlas - Configuration
 *
 * Each student can customize `instanceSettings` to make their app instance
 * uniquely theirs (camera focus, favorite Mapbox style, curated default filter),
 * while connecting to the shared Firebase backend!
 */

export const instanceSettings = {
  // Title shown in the header / browser
  instanceTitle: 'Global Street Vibe Atlas',

  // Mapbox Public Access Token (pk.*)
  // Leave empty here so keys are not committed to git!
  // Students can paste their token in the UI Settings dialog (saved to localStorage)
  // or set it locally right here during class.
  mapboxToken: '',

  // Preferred Mapbox Vector Style (converted via process_mapbox.js)
  // Popular styles:
  // - 'mapbox/dark-v11' (dramatic nighttime vibe)
  // - 'mapbox/satellite-streets-v12'
  // - 'mapbox/streets-v12'
  // - 'mapbox/light-v11'
  mapboxStyleId: 'mapbox/dark-v11',

  // Starting 3D Globe Camera
  // Philadelphia / Penn: [-75.1932, 39.9522]
  // Or pick your hometown / favorite global city!
  initialCenter: [-75.1932, 39.9522],
  initialZoom: 2.2,

  // Default Curated Lens / Filter
  // 'all' | 'night_market_food' | 'street_music_culture' | 'nature_water_sanctuary' |
  // 'bustling_transit_chaos' | 'cafe_third_place'
  defaultVibeFilter: 'all',
};

/**
 * Metadata for the sensory vibe categories
 */
export const VIBE_CATEGORIES = {
  night_market_food: {
    id: 'night_market_food',
    label: 'Night Market & Street Food',
    icon: '🍜',
    color: '#e65100',
    description: 'Sizzling woks, spices, food carts, neon signs, and aroma',
  },
  street_music_culture: {
    id: 'street_music_culture',
    label: 'Street Music & Culture',
    icon: '🎺',
    color: '#8e24aa',
    description: 'Busker melodies, drum beats, outdoor theater, gallery walls',
  },
  nature_water_sanctuary: {
    id: 'nature_water_sanctuary',
    label: 'Quiet Sanctuary & Nature',
    icon: '🌿',
    color: '#2e7d32',
    description: 'Rustling leaves, fountain babble, birds, peaceful courtyard',
  },
  bustling_transit_chaos: {
    id: 'bustling_transit_chaos',
    label: 'Bustling Transit Energy',
    icon: '⚡',
    color: '#c62828',
    description: 'Rattling trains, honking horns, crowd movement, city pulse',
  },
  cafe_third_place: {
    id: 'cafe_third_place',
    label: 'Cafe & Third Place',
    icon: '☕',
    color: '#0277bd',
    description: 'Espresso hiss, book pages turning, murmur of conversation',
  },
};

/**
 * Shared Cloud Firestore configuration
 * Points to the MUSA 6110 collaborative classroom backend:
 * project: 'global-vibes-collab-2026'
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyDWPfC2CzZGFKTELlp3gUFvbGcSdoGkYi8',
  authDomain: 'global-vibes-collab-2026.firebaseapp.com',
  projectId: 'global-vibes-collab-2026',
  storageBucket: 'global-vibes-collab-2026.firebasestorage.app',
  messagingSenderId: '1053812110565',
  appId: '1:1053812110565:web:76c52fb671474b528bd00c',
  measurementId: 'G-P66P3B16ZD',
};
