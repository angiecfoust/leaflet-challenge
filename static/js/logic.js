// store our endpoint as a variagle
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// GET request to the query URL
d3.json(url).then(function (data) {
  main(data.features);
});


// create function 'main'
function main(features) {

  //set bindPopup info
  let earthquakes = L.geoJson(features, {
    onEachFeature: (feature, layer) => {
      L.circle(feature.geometry, {
        color: "green",
        fillColor: "green",
        fillOpacity: 0.75,
        radius: 500
      });
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
  });

  //create baseMaps
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topo
  };

  // create overlay maps
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  //create map
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  //add layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}

// notes to self; for both of these it was under the "onEach"
    // to get magnitude: feature.properties.mag
    // to get depth: feature.geometry.coordinates[2]