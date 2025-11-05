import { initMap } from './components/map.js';
import { initContentPanel } from './components/content-panel.js';

const events = new EventTarget();

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.querySelector('#map');
  if (!mapElement) { console.error('Map element not found') }
  initMap(events, mapElement);

  const contentPanelElement = document.querySelector('#content-panel');
  if (!contentPanelElement) { console.error('Content panel element not found') }
  initContentPanel(events, contentPanelElement);
});