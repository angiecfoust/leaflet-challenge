//create map  ////// THIS MAY NEED TO GO IN THE DRAW MAP FUNCTION
//let myMap = L.map("map", {
  //center: [
    //37.09, -95.71
  //],
  //zoom: 3,
  //layers: [streetmap, earthquakes]
//});

// store our endpoint as a variable
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// GET request to the query URL
d3.json(url).then(function (data) {
  createFeatures(data.features);
});

//create map function
function drawMap(earthquakes) {
    //create tile layers
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    
    //create basemap layer
    let baseMaps = {
      "Street Map": streetmap,
      "Topographic Map": topo
    };

    //create overlay
    let overlayMaps = {
      Earthquakes: earthquakes
      };

    //create map
    let myMap = L.map("map", {
      center: [
        17.96, -67.08
      ],
      zoom: 3,
      layers: [streetmap, earthquakes]
    });

    // add control layer
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // make a legend
    //set colors for legend labels (match colors to marker colors)
    function getColor(d) {
      return d > 45 ? "#4A235A" :
             d > 35 ? "#6C3483" :
             d > 25 ? "#8E44AD" :
             d > 15 ? "#BB8FCE" :
             d > 5 ? "#E8DAEF" :
                     "#F4ECF7";   
   } 

   let legend = L.control({position: 'bottomright'});
   legend.onAdd = function (myMap) {
    let div = L.DomUtil.create('div', 'info legend'),
    grades = [45, 35, 25, 15, 5, -5],
    labels = [];

    //loop through intervals to generate labels
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i>' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
   };

   legend.addTo(myMap);

}


// set up color function/conditional based on depth for the markers
function setColor(depth) {
  let color = "";
  
  if (depth > 45) 
    color = "#4A235A";
  else if (depth > 35) 
    color = "#6C3483";
  else if (depth > 25) 
    color = "#8E44AD";
  else if (depth > 15) 
    color = "#BB8FCE";
  else if (depth > 5) 
    color = "#E8DAEF";
  else if (depth > -5)
    color = "#F4ECF7"
  return color;
} 


// create features function (note to me- see 'oneach' in activity 3.10)
function createFeatures(features) {
  // create the 'oneach' and make a bindPopup
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</br>
    Magnitude: ${feature.properties.mag}</br>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  //create circle markers function- radius based on magnitude
  function createMarkers(feature, location) {
    let depth = feature.geometry.coordinates[2]; 
    let mag = feature.properties.mag;
    return L.circleMarker (location, {
      color: setColor(depth),
      fillColor: setColor(depth),
      fillOpacity: 0.75,
      weight: 1,
      radius: mag * 4
    })

  }

  //create geoJson layer
  let earthquakes = L.geoJson(features, {
    onEachFeature: onEachFeature,
    pointToLayer: createMarkers
  });

  //call the map function!
  drawMap(earthquakes);

}


