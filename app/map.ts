import * as d3 from "https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min.js";
import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Motion = require("./motion-module.js");
import data = require("./data.js");

const map = new EsriMap({
    basemap: "topo"
});

const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-76.93, 38.9897],
    zoom: 12
});


const customCanvas = (r) => {
    setTimeout(() => {
        console.log(r);
        var canvas = document.querySelector('canvas');
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            
            for (var i = 0; i < 20; i++) {
                for (var j = 0; j < 20; j++) {
                    ctx.fillStyle = 'rgb(' + Math.floor(255 - 42.5 * i) + ', ' +
                        Math.floor(255 - 42.5 * j) + ', 0)';
                    ctx.fillRect(j * 25, i * 25, 25, 25);
                    ctx.globalAlpha = 0.2;
                }
            }
        }
    }, 400)
}

view.when(function () {
    console.log('here')
    const layer = new Motion.MotionLayer({ title: "My Day", source: data });
    view.graphics.add(layer.LayerLines[0].graphic);


    customCanvas();



});


view.on("drag", (r) => {
    customCanvas(r);
});