mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/isalpikachu/ckolsnhwm1tky17pbizef5t29",
  center: campground.geometry.coordinates,
  zoom: 9,
});

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({
      offset: 25,
    }).setHTML(`<h5>${campground.title}</h3><p>${campground.location}</p>`)
  )
  .addTo(map);
