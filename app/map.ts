import * as d3 from "https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min.js";
import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");


const map = new EsriMap({
    basemap: "topo"
});

const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-76.93, 38.9897],
    zoom: 12
});


view.when(function () {
    const layer = new FeatureLayer({ url: "http://maps.umd.edu/arcgis/rest/services/Layers/Transportation/MapServer/4" });
});