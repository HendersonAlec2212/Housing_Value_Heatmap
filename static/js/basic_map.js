// empty lists to load blank map with no errors
var local_marker_list = [];

var data = [];

for (var i = 0; i < data.length; i++) {
    var marker_info = data[i];

    if (marker_info) {
      // marker_list.push([marker_info.lat, marker_info.lng, marker_info.count]);
      local_marker_list.push(
          L.marker([marker_info.lat, marker_info.lng]).bindPopup(`
          <body style="color: red;">
          <h3>address</h3>
          <hr>
          <h4>price/sqft</h4>
          <p>text</p>
          <h4>market value</h4>
          <p>text</p>
          <h4>info3</h4>
          <p>link to midland CAD</p>
          </body>
          `)
          );

    }
    
};

let local_layer = L.layerGroup(local_marker_list);
// var db_layer = L.layerGroup(db_marker_list);

let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});



// Only one base layer can be shown at a time.
let baseMaps = {
    "Street": street,
    "Topography": topo
};

let overlayMaps = {
    // "LOCAL LAYER": local_layer
};

let myMap = L.map('map', {
    center: [32.776665, -96.796989],
    zoom:2,
    layers: [street,local_layer,]
});



L.control.layers(baseMaps, overlayMaps).addTo(myMap);
// ---------------- Leave this code alone. it is needed to load an empty map. ---------------- //


// event handler to prevent full page reload when subit button is clicked //
var form = document.getElementById("myForm");

function handleForm(event) { event.preventDefault(); } 

form.addEventListener('submit', handleForm);
// ------------------------------- END FORM EVENT HANDLER ------------------------------- //


// this function calls to DB, retireves information
// logs the bits to see that info is loading in proper format
// sets up needed llists and dictionaries for map creation
// removes existing myMap object/instance
// creates new map with heat map layer using all address lat and lng
// creates markers from marker data pulled from DB
function d3_marker_map(url) {
    var userText = document.getElementById("userInput").value;
    var url= `/${userText}`;
    console.log(`d3_marker_map_url is...`);
    console.log(url);
    d3.json(url).then(function(mongo_data){
        console.log(`-----------------------------------`);
        console.log(`this is the list return from mongoDB`);
        console.log(mongo_data);
        console.log(`END MONGO_DB RETURN`);
        console.log(`-----------------------------------`);
        console.log(`this is attempt to log mongo_data[0] in mongo return`);
        console.log(mongo_data[0]);
        console.log(`end mongo[0] log attempt`);
        console.log(`-----------------------------------`);
        console.log(`mongo_data[0].lat`);
        console.log(mongo_data[0].lat);
        console.log(`END mongo_data[0].lat`);
        console.log(`-----------------------------------`);

        var heat_markers_list = [];
        var markers_list = [];
        for (var i = 0; i < mongo_data.length; i++) {
            var heat_marker_info = mongo_data[i];
        
            if (heat_marker_info) {
              // marker_list.push([marker_info.lat, marker_info.lng, marker_info.count]);
              heat_markers_dict = {};
              heat_markers_dict['lat'] = heat_marker_info.lat,
              heat_markers_dict['lng'] = heat_marker_info.lng,
              heat_markers_dict['intensity'] = heat_marker_info.intensity,

              heat_markers_list.push(heat_markers_dict); // end push on heat_markers_list
                  markers_list.push(
                    L.marker([heat_marker_info.lat, heat_marker_info.lng])
                    .bindPopup(`
                    <body style="color: red;">
                    <h3>address</h3>
                    <hr>
                    <h4>price/sqft</h4>
                    <p>text</p>
                    <h4>market value</h4>
                    <p>text</p>
                    <h4>info3</h4>
                    <p>link to midland CAD</p>
                    </body>
                    `) // end bindPopup
                    ); // end push on regular marker_list
        
            }// end if statement that pushes markers to list(s) if data is true
            
        }//end for loop
        console.log(`data passed to make heat map`);
        console.log(heat_markers_list);
        console.log(`markers_list`);
        console.log(markers_list);

        myMap.remove();
        heatMap_and_regular_markers(markers_list,heat_markers_list)
    }// end d3 call function
)//end d3 promise

};// end function calling to DB and making map from DB info



// this function forms the heatmap and markers based on DB information

function heatMap_and_regular_markers(markers_list,heat_markers_list) {
    

    var marker_layer = L.layerGroup(markers_list);

    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var config = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        // if scaleRadius is false it will be the constant radius used in pixels
        "radius": 2,
        "maxOpacity": .8,
        // scales the radius based on map zoom
        "scaleRadius": true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": true,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'intensity'
    };
    var heatmapLayer = new HeatmapOverlay(config);

    // Only one base layer can be shown at a time.
    var baseMaps = {
        "Street": street,
        "Topography": topo
    };

    // toggle layers
    var overlayMaps = {
        "regular markers": marker_layer,
        "heatmap layer":heatmapLayer
    };
    
    var myMap = L.map('map', {
        center: [32.776665, -96.796989],
        zoom:2,
        // default layers shown on load
        layers: [street,heatmapLayer]
    });

heatmapLayer.addData(heat_markers_list);


    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}

function blankMap() {

    let local_layer = L.layerGroup(local_marker_list);
    // var db_layer = L.layerGroup(db_marker_list);

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });



    // Only one base layer can be shown at a time.
    let baseMaps = {
        "Street": street,
        "Topography": topo
    };

    let overlayMaps = {
        // "LOCAL LAYER": local_layer
    };
    
    let myMap = L.map('map', {
        center: [32.776665, -96.796989],
        zoom:2,
        layers: [street,local_layer,]
    });



    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}




// function init() {
//     blankMap();
// }

// init();