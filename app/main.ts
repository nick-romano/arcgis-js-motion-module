import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer")

const map = new EsriMap({
    basemap: "streets"
});

const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-76.93, 38.9897],
    zoom: 12
});


view.when(function(){
    const layer = new FeatureLayer({ url: "http://maps.umd.edu/arcgis/rest/services/Layers/Transportation/MapServer/4" })
    console.log(layer)
})