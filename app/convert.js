// Read Synchrously
var fs = require("fs");
var features = fs.readFileSync("AAL2248.geojson");

var features = JSON.parse(features);
var newJSON = {
    "type": "FeatureCollection",
    "features": []
}

features.features[2].geometry.coordinates.map((r, i) => {
    if(i < features.features[2].geometry.coordinates.length) {
        newJSON.features.push({
            "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        features.features[2].geometry.coordinates[i],
                        features.features[2].geometry.coordinates[i+1]
                    ]
                },
            "properties": {
                "timespan": {
                    "begin" : features.features[2].properties.coordTimes[i],
                    "end" : features.features[2].properties.coordTimes[i+1]
                }
            }
        })
    }
})

console.log(newJSON.features.length)

fs.writeFile('data4.geojson', JSON.stringify(newJSON, null, 4));