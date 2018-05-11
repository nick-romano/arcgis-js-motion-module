import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Motion = require("./motion-module.js");
import data = require("./data.js");
import data2 = require("./data2.js");
import data3 = require("./data3.js");
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
        title: "8_20", 
        source: data.data, 
        sourceType: "GEOJSON",
        view: view, 
        speed: 2, 
        color: '#ffc107',
        // catField: 'Category',

    });

    // const layer2 = new Motion.MotionLayer({ 
    //     title: "8_21", 
    //     source: data2.data2, 
    //     sourceType: "GEOJSON",
    //     view: view, 
    //     speed: 2, 
    //     color: '#8BC34A'
    // });

    // const layer3 = new Motion.MotionLayer({ 
    //     title: "8_19", 
    //     source: data3.data3, 
    //     sourceType: "GEOJSON",
    //     view: view, 
    //     speed: 2, 
    //     color: '#2196f3'
    // });

    // const layer2 = new Motion.MotionLayer({ 
    //     title: "8_21", 
    //     source: data2, 
    //     sourceType: "GEOJSON",
    //     view: view, 
    //     speed: .5, 
    //     color: 'black'
    // });
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
