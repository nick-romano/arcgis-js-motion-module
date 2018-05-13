import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Motion = require("./../../motion-module.js");
import { Point, Polygon, Polyline } from "esri/geometry";
import lang = require("dojo/_base/lang");

import TY7 = require("../../data/flights/TY7.js");
import DLH414 = require("../../data/flights/DLH414.js");
import UAL925 = require("../../data/flights/UAL925.js");
import UAL1140 = require("../../data/flights/UAL1140.js");
import UAL808 = require("../../data/flights/UAL808.js");
import UAL933 = require("../../data/flights/UAL933.js");
import UAL1133 = require("../../data/flights/UAL1133.js");
import UAL3872 = require("../../data/flights/UAL3872.js");
import UAL1669 = require("../../data/flights/UAL1669.js");


const map = new EsriMap({
    basemap: "gray-vector"
});
window.map = map;

const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-76.93, 38.9897],
    zoom: 2
});

view.when(function () {

    var FullData = {
        TY7: TY7.TY7,
        DLH414: DLH414.DLH414,
        UAL925: UAL925.UAL925,
        UAL1140: UAL1140.UAL1140,
        UAL933: UAL933.UAL933,
        UAL1133: UAL1133.UAL1133,
        UAL3872: UAL3872.UAL3872,
        UAL1669: UAL1669.UAL1669
    }

    var date = new Date("5-12-2018 0:00");
    console.log(FullData)

    var times = Object.keys(FullData).map((r, i) => new Date(FullData[r].features[0].properties.timespan.begin));
    console.log(FullData);
    function iterateTime() {
        // date = date.setMinutes(date.getMinutes() + 30);
        date.setSeconds(date.getSeconds() + 60);
        times.map((r, i) => {
            //console.log(r)
            if( date > r ) {
                const blah = new Motion.MotionLayer({ 
                    title: "8_21", 
                    source: FullData[Object.keys(FullData)[i]], 
                    sourceType: "GEOJSON",
                    view: view, 
                    speed: 4, 
                    color: randomColor(),
                    // catField: 'Category',
                });
                blah.addToMap();
                times[i] = undefined;
            }

        })
        // console.log(date);
        clockCTX.clearRect(0, 0, 10000, 10000);
        clockCTX.fillText(date.toLocaleString(), 100, 100);
        if(date > new Date("5-13-2018")) {
            clearInterval(interval);
        }
    };


    function randomColor() {
        var color = ["#ffc107", "#e91e63", "#673ab7", "#2196f3", "#4caf50", "#ffeb3b"]
        return color[Math.floor(Math.random() * 6)];
    }
    var interval = setInterval(iterateTime, 10);

    var initCanvas = document.querySelector('.esri-display-object');
    var proto = document.createElement("canvas");
    proto.id = "clock"
    proto.width = window.innerWidth;
    proto.height = window.innerHeight;
    var clockCTX = proto.getContext('2d');
    clockCTX.canvas.style.position = 'absolute';
    clockCTX.canvas.style.zIndex = '2';
    initCanvas.insertAdjacentElement('beforebegin', clockCTX.canvas)
    clockCTX.fillStyle = 'black';
    clockCTX.font="30px Arial";
    clockCTX.fillText(date.toLocaleString(), 100, 100)
    
});
