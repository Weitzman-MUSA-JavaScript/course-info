/**
 * Mapbox Style Processor for MapLibre GL JS 3D Globe
 *
 * Adapted from https://gist.github.com/mjumbewu/9d21093452a8763ee20c0620a37422a3
 * Allows MapLibre GL JS to directly consume Mapbox vector styles by converting
 * mapbox:// internal protocols into standard HTTP vector tile, glyph, and sprite URLs.
 */

/**
 * Public open fallback style used when no Mapbox token is provided.
 * Liberty vector style from OpenFreeMap works with MapLibre GL globe projection!
 */
export const OPEN_FALLBACK_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

/**
 * Replace the mapbox:// URL in a Mapbox source object with its corresponding vector tiles API URL.
 *
 * @param {Object} source A Mapbox source object to be processed.
 * @param {string} accessToken The Mapbox access token to use for fetching tiles.
 * @returns {Object} The Mapbox source object with the mapbox:// URL replaced by vector tiles API URLs.
 */
export function processMapboxSource(source, accessToken) {
  if (!source) return source;
  const { url, ...newSource } = source;
  if (url) {
    if (url.startsWith('mapbox://')) {
      const tilesetIDs = url.replace('mapbox://', '');
      newSource.tiles = [
        `https://api.mapbox.com/v4/${tilesetIDs}/{z}/{x}/{y}.mvt?access_token=${accessToken}`,
      ];
    } else {
      newSource.url = url;
    }
  }
  return newSource;
}

/**
 * Replace all mapbox:// URLs in an object of Mapbox source objects with their corresponding vector tile URLs.
 *
 * @param {Object} sources An object mapping source IDs to Mapbox source objects.
 * @param {string} accessToken The Mapbox access token.
 * @returns {Object} An object mapping source IDs to processed Mapbox source objects.
 */
export function processMapboxSources(sources, accessToken) {
  if (!sources || typeof sources !== 'object') return sources;
  return Object.fromEntries(
    Object.entries(sources).map(([key, source]) => [
      key,
      processMapboxSource(source, accessToken),
    ])
  );
}

/**
 * Replace all mapbox:// URLs in a Mapbox style object with their corresponding
 * vector tiles, fonts, and styles API URLs, and configure globe projection for MapLibre GL JS.
 *
 * @param {Object} style A Mapbox style JSON object.
 * @param {string} accessToken The Mapbox access token.
 * @returns {Object} Processed style object ready for maplibregl.Map({ style: ... }).
 */
export function processMapboxStyle(style, accessToken) {
  if (!style) return style;

  const processed = {
    ...style,
    sources: processMapboxSources(style.sources, accessToken),
    projection: { type: 'globe' }, // Ensure MapLibre v5 renders in 3D globe mode
  };

  // Process glyphs font URL if present
  if (typeof style.glyphs === 'string' && style.glyphs.startsWith('mapbox://fonts/')) {
    processed.glyphs = style.glyphs.replace(
      'mapbox://fonts/',
      'https://api.mapbox.com/fonts/v1/'
    ) + `?access_token=${accessToken}`;
  }

  // Process sprite icons URL if present
  if (typeof style.sprite === 'string') {
    if (style.sprite.startsWith('mapbox://sprites/')) {
      processed.sprite = style.sprite.replace(
        'mapbox://sprites/',
        'https://api.mapbox.com/styles/v1/'
      ) + `/sprite?access_token=${accessToken}`;
    } else if (!style.sprite.includes('access_token')) {
      processed.sprite = `${style.sprite}?access_token=${accessToken}`;
    }
  }

  return processed;
}

/**
 * Helper to load and prepare a style for the 3D globe.
 * If a valid Mapbox token is given, fetches and transforms the Mapbox style.
 * Otherwise, falls back to the open vector tile style.
 *
 * @param {string} styleId The Mapbox style identifier (e.g. 'mapbox/dark-v11').
 * @param {string} accessToken Mapbox access token (pk.*).
 * @returns {Promise<Object|string>} Processed style JSON or fallback style URL.
 */
export async function loadGlobeStyle(styleId, accessToken) {
  const token = (accessToken || '').trim();

  if (token && token.startsWith('pk.')) {
    try {
      console.log(`[process_mapbox] Fetching Mapbox style: ${styleId}`);
      const cleanStyleId = styleId.replace(/^mapbox:\/\//, '');
      const response = await fetch(
        `https://api.mapbox.com/styles/v1/${cleanStyleId}?access_token=${token}`
      );
      if (!response.ok) {
        throw new Error(`Mapbox style API returned status ${response.status}: ${response.statusText}`);
      }
      const mapboxStyleJson = await response.json();
      const processed = processMapboxStyle(mapboxStyleJson, token);
      console.log('[process_mapbox] Successfully processed Mapbox style for MapLibre globe.');
      return processed;
    } catch (err) {
      console.warn('[process_mapbox] Failed to load Mapbox style, falling back to open vector tiles:', err);
    }
  } else {
    console.log('[process_mapbox] No Mapbox access token configured. Using open vector tile globe fallback.');
  }

  // Fallback open vector style
  return OPEN_FALLBACK_STYLE_URL;
}
