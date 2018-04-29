// import * as d3 from "https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min.js";
import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Motion = require("./motion-module.js");
import data = require("./data.js");
import { Point, Polygon, Polyline } from "esri/geometry";
import lang = require("dojo/_base/lang");

const map = new EsriMap({
    basemap: "topo"
});

const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-76.93, 38.9897],
    zoom: 10
});


const initCustomGraphics = (layer: object) => {
    var initCanvas = document.querySelector('.esri-display-object');
    var proto = document.createElement("canvas");
    proto.id = "motionLayer"
    var rootDiv = document.querySelector('g');
    var ctx = proto.getContext("2d");
    ctx.canvas.style.position = 'absolute';
    ctx.canvas.style.zIndex = '0';
    initCanvas.insertAdjacentElement('beforebegin', ctx.canvas)
    ctx.canvas.width = initCanvas.width;
    ctx.canvas.height = initCanvas.height;
    // bouncingBall(layer);
    addVertexes(layer);
}
function animate(g: Array<Object>) {
    let anFrame;
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        },
            timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };


    var canvas = document.getElementById("motionLayer");
    var ctx = canvas.getContext("2d");
    // window.cancelAnimationFrame();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineCap = "round";
    ctx.fillStyle = '#007ac2';

    // variable to hold how many frames have elapsed in the animation
    var t = 1;

    // define the path to plot
    var vertices = g.map(
        (r) => {
            return {
                x: r.x,
                y: r.y
            }
        });



    // set some style
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#007ac2';
    // calculate incremental points along the path
    var points = calcWaypoints(vertices);
    // extend the line from start to finish with animation
    animate();

    const removeAnim = view.on('drag', removeAnimation);
    let iter = 0;
    
    function removeAnimation(event) {
        console.log(iter)
        iter += 1;
        cancelAnimationFrame(anFrame);
        console.log(event)
        if(event.action === "end") {
            removeAnim.remove();
        }
    }

    // calc waypoints traveling along vertices
    function calcWaypoints(vertices: Array<object>) {

        var waypoints = [];
        for (var i = 1; i < vertices.length; i++) {
            var pt0 = vertices[i - 1];
            var pt1 = vertices[i];
            var dx = pt1.x - pt0.x;
            var dy = pt1.y - pt0.y;
            // review this use of distance, but seems to smooth out transistion, 
            // previously distance was replaced with the value 100
            var distance = Math.sqrt(Math.pow(pt1.x - pt0.x, 2) + Math.pow(pt1.y - pt0.y, 2));
            for (var j = 0; j < distance; j++) {
                var x = pt0.x + dx * j / distance;
                var y = pt0.y + dy * j / distance;
                waypoints.push({
                    x: x,
                    y: y
                });
            }
        }
        return (waypoints);
    }


    function animate() {
        if (t < points.length - 1) {
            anFrame = requestAnimationFrame(animate);
        }
        // draw a line segment from the last waypoint
        // to the current waypoint
        ctx.beginPath();
        ctx.moveTo(points[t - 1].x, points[t - 1].y);
        ctx.lineTo(points[t].x, points[t].y);
        ctx.stroke();
        // increment "t" to get the next waypoint
        t++;
    }
}

const addVertexes = (layer: any, event: object, change: object) => {
    var ctx = document.getElementById("motionLayer").getContext('2d');
    ctx.restore();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    // ctx.translate(200,2)
    if(change) {
        // ctx.translate(change.x, change.y)
    }

    const g = layer.LayerLines[0].graphic.geometry.paths[0].map((r: any) => {
        return view.toScreen(new Point(r));
    });

    var length = 0;
    for (var i = 0; i < g.length; i++) {
        if (i < g.length - 1) {
            var distance = Math.sqrt(Math.pow(g[i + 1].x - g[i].x, 2) + Math.pow(g[i + 1].y - g[i].y, 2));
            length += distance;
        }
    };
    // draw just draw the line statically on the page
    function draw() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        ctx.moveTo(g[0].x, g[0].y);
        for (var i = 0; i < g.length; i++) {
            ctx.lineTo(g[i].x, g[i].y);
        }
        ctx.stroke();
    }
    // Don't need to draw right now
    // draw();
    animate(g);
}





view.when(function () {
    console.log('here')
    const layer = new Motion.MotionLayer({ title: "My Day", source: data, view: view });
    console.log(layer)
    view.graphics.add(layer.LayerLines[1].graphic);

    console.log(view)
    // initCustomGraphics(layer);
    let start, end, change;

    view.on("drag", function (event) {
        if(event.action === "start") {
            start = {x: event.x, y: event.y};
        }else if(event.action === "end") {
            end = { x: event.x, y: event.y };
            change = {x: end.x - start.x, y: end.y - start.y }
        }

        if(change) {
        addVertexes(layer, event, change);
        }
    })

    view.on("pointer-down", function (event) {
        // addVertexes(layer);
        // console.log(layer.mapView.updating)
    })

    view.on("resize", function (event) {
        console.log('resize')
        console.log(event);
        addVertexes(layer, event, undefined)
    })

    // view.on("immediate-click", function (event) {
    //     bouncingBall(layer);
    //     addVertexes(layer);
    // })

    // view.on("layerview-create", function (event) {
    //     bouncingBall(layer);
    //     addVertexes(layer);
    // })

});
