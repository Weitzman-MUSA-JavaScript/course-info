import { SlideDeck } from './slidedeck.js';

function initMapAndSlides(mapId, sectionId) {
  const map = L.map(mapId, {scrollWheelZoom: false}).setView([0, 0], 0);

  // ## The Base Tile Layer
  const baseTileLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
    maxZoom: 16,
    attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
  });
  baseTileLayer.addTo(map);

  // ## Interface Elements for first map and slides
  const container = document.querySelector(`#${sectionId} .slide-section`);
  const slides = document.querySelectorAll(`#${sectionId} .slide`);

  // ## The SlideDeck objects
  const deck = new SlideDeck(container, slides, map);

  document.addEventListener('scroll', () => deck.calcCurrentSlideIndex());

  deck.preloadFeatureCollections();
  deck.syncMapToCurrentSlide();
}

initMapAndSlides('map-1', 'map-section-1');
initMapAndSlides('map-2', 'map-section-2');
