
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", //container ID
  //choose from Mapbox's core styles, or make your own style with mapbox Studio
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [77.209, 28.6139], //starting position [lng,lat]
  zoom: 9 // starting zoom
});