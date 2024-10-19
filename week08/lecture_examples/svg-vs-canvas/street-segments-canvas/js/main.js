const map = L.map('map', { preferCanvas: true }).setView([39.95, -75.16], 15);

L.tileLayer('https://api.mapbox.com/styles/v1/mjumbe-test/cl0r2nu2q000s14q9vfkkdsfr/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWp1bWJlLXRlc3QiLCJhIjoiY2wwb3BudmZ3MWdyMjNkbzM1c2NrMGQwbSJ9.2ATDPobUwpa7Ou5jsJOGYA', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

fetch('https://opendata.arcgis.com/datasets/c36d828494cd44b5bd8b038be696c839_0.geojson')
  .then(resp => resp.json())
  .then(data => {
    L.geoJSON(data)
      .bindTooltip(layer => {
        const blockLow = Math.min(layer.feature.properties['L_F_ADD'], layer.feature.properties['R_F_ADD']);
        const blockHigh = Math.max(layer.feature.properties['L_T_ADD'], layer.feature.properties['R_T_ADD']);
        const street = layer.feature.properties['STNAME'];
        return `${blockLow}-${blockHigh} block of ${street}`;
      })
      .addTo(map);
    console.log(`Added ${data.features.length} features to the map.`);
  });
