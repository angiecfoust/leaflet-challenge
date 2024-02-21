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
  //let overlayMaps = {
    //Earthquakes: earthquakes
  //};

  //create map
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
  });

// store our endpoint as a variable
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// GET request to the query URL
d3.json(url).then(function (data) {
  main(data.features);
});


// create function 'main'
function main(features) {

  // set up color conditional based on depth
  for (let i = 0; i < features.length; i++) {
    let color = "";
    let depth = features[1].geometry.coordinates[2];
    if (depth > 65) {
      color = "#880E4F";
    }
    else if (depth > 50) {
      color = "#C2185B";
    }
    else if (depth > 35) {
      color = "#E91E63";
    }
    else if (depth > 20) {
      color = "#F06292";
    }
    else if (depth > 5) {
      color = "#F8BBD0";
    }
    // set up radius based on magnitude
    let radius = features[i].properties.mag * 5;

    //create circle markers
    L.circle(features.geometry, {
      color: color,
      fillColor: color,
      fillOpacity: 0.75,
      radius: radius
    }).bindPopup(`<h3>"Location: "${feature[i].properties.place}</h3><hr><p>"Date: "${new Date(feature[i].properties.time)}</br>
    "Magnitude: "${feature[i].properties.mag}</p>`).addTo(myMap);
  }


  //set bindPopup info
  //let earthquakes = L.geoJson(features, {
    //onEachFeature: (feature, layer) => {
      //layer.bindPopup(`<p>"Location: "${feature.properties.place}<br>"Date: "${new Date(feature.properties.time)}<br>
      //"Magnitude: "<br></p>`);
    //}
  //});


}