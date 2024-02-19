// create a function to create the map
function createMap(earthquakes) {
  //create tile layers
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

  //create baseMaps object for streetmap layer
  let baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topo
  };


  // create an overlaymaps object to hold earthquake layer
  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  //create map object with options
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  //create layer control and pass to basemaps and overlaymaps; add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}


// create a function for markers
function createMarkers(features) {

  let location = features.geometry;
  

  // create an array to hold the earthquake markers
  let markers = [];

  // create a function to determine marker size- radius based on magnitude
  function markerRadius(mag) {
    let magnitude = features.properties.mag;
    return magnitude * 3; 
  }

  //create a function to determine color- based on depth
  function markerColor(geo) {
    let depth = location.coordinates[2]
    let color = "";
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
  }

  // loop through the to get data and push to markers
  for (let i=0; i < features.length; i++) {
    markers.push(
      L.circle([location.coordinates[1], location.coordinates[0]], {
        stroke: false,
        fillOpacity: 0.75,
        color: markerColor,
        fillColor: markerColor,
        radius: markerRadius
      })
    ).addTo(myMap);
      //.bindPopup(`<h3>${features.properties.place}</h3><hr><p>${new Date(features.properties.time)}</p>`);
  }

}

// Perform an api call to get earthquake data then call createMarkers
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then(createMap);
createMarkers();
