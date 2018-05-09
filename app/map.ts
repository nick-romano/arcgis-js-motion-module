import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Motion = require("./motion-module.js");
import data = require("./data.js");
import { Point, Polygon, Polyline } from "esri/geometry";
import lang = require("dojo/_base/lang");

const map = new EsriMap({
    basemap: "gray-vector"
});
window.map = map;

const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-76.93, 38.9897],
    zoom: 9
});

view.when(function () {
    console.log('here')
    const layer = new Motion.MotionLayer({ 
        title: "My Day", 
        source: data, 
        sourceType: "GEOJSON",
        view: view, 
        speed: 4, 
        color: '#ffc107'
    });
    console.log(layer)
    // view.graphics.add(layer.LayerLines[1].graphic);

    console.log(view)
    // initCustomGraphics(layer);
    let start, end, change;

    // view.on("drag", function (event) {
    //     if(event.action === "start") {
    //         start = {x: event.x, y: event.y};
    //     }else if(event.action === "end") {
    //         end = { x: event.x, y: event.y };
    //         change = {x: end.x - start.x, y: end.y - start.y }
    //     }

    //     if(change) {
    //     addVertexes(layer, event, change);
    //     }
    // })

    // view.on("pointer-down", function (event) {
    // })

    // view.on("resize", function (event) {
    // })

    // view.on("immediate-click", function (event) {
    // })

    // view.on("layerview-create", function (event) {
    // })

});
