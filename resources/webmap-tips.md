## Mapbox Raster Tiles in Leaflet Maps

You do not have to use MapboxGL.js in order to use raster tiles from Mapbox. You can also use them in Leaflet maps. Here is an example of how to do that:

```js
const map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://apps.mapbox.com/feedback/" target="_blank">Improve this map</a></strong>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(map);
```

A few things to note in the above code:
- The URL template is slightly different than the one used in MapboxGL.js; "mapbox://styles/..." becomes "https://api.mapbox.com/styles/v1/...".
- Mapbox requires that you include an attribution on your tile layer, and they provide a [standard attribution](https://docs.mapbox.com/help/dive-deeper/attribution/#other-mapping-frameworks) string that you can use.
- You need to specify an `id` for the style you want to use (see [Mapbox Styles](https://docs.mapbox.com/api/maps/styles/)). This is going to correspond to the style you want to use, for example, `mapbox/streets-v11` or `mapbox/satellite-v9` (same as it might be in MapboxGL.js).
- You should specify `tileSize: 512` and `zoomOffset: -1` in order to use the 512px tiles that Mapbox serves. By default, Leaflet assumes 256px tiles, but Mapbox serves 512px tiles for its styles. Using 512px tiles is useful to reduce the number of tile requests made to Mapbox, which can help to ensure that you'll never exceed the maximum number of tile requests allowed on a free Mapbox account.
- You need to specify your Mapbox access token.