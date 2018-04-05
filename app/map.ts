import * as d3 from "https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min.js";
import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Motion = require("./motion-module.js");
import data = require("./data.js");

console.log(data);

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
    const layer = new Motion.MotionLayer({title: "My Day", source: data});
    view.graphics.add(layer.LayerLines[0]);
    console.log(layer);
});
