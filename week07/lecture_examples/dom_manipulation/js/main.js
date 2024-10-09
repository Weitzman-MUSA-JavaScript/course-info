import { initHoodsSelect } from './hoods_select.js';

const response = await fetch('data/philadelphia-neighborhoods.geojson');
const hoodsCollection = await response.json();
const hoods = hoodsCollection.features;

const hoodListEl = document.querySelector('#neighborhoods-list');

initHoodsSelect(hoodListEl, hoods);
