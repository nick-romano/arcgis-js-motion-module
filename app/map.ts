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

const insertCanvas = (r: any) => {
    setTimeout(() => {
        console.log('1')
        var canvas = document.querySelector('canvas');
        var ctx = canvas.getContext('2d');
        var raf;
        var ball = {
            x: 20,
            y: 20,
            vx: 5,
            vy: 2,
            radius: 25,
            color: 'blue',
            draw: function () {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        };

        function draw() {
            ctx.save();
            //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ball.draw();
            ball.x += ball.vx;
            ball.y += ball.vy;
            raf = window.requestAnimationFrame(draw);
            ctx.restore();
        }
        view.on('pointer-enter', function (e) {
            console.log('mouseover')
            raf = window.requestAnimationFrame(draw);
        });

        view.on('pointer-leave', function (e) {
            window.cancelAnimationFrame(raf);
        });
    })
}


const customCanvas = (r: any) => {
    setTimeout(() => {
        var proto = document.createElement("canvas");
        var rootDiv = document.querySelector('g');
        var ctx = proto.getContext("2d");
        ctx.canvas.style.position = 'absolute';
        ctx.canvas.style.zIndex = '100';
        document.body.insertBefore(ctx.canvas, viewDiv)
        ctx.canvas.width = 600;
        ctx.canvas.height = 300;
        var raf;

        for(let elem of document.querySelectorAll('*')) {
            elem.addEventListener("click", e => console.log(e), true);
          }

        var ball = {
            x: 100,
            y: 100,
            vx: 5,
            vy: 2,
            radius: 25,
            color: 'blue',
            draw: function () {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        };

        function draw() {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ball.draw();
            ball.x += ball.vx;
            ball.y += ball.vy;
            raf = window.requestAnimationFrame(draw);
        }
        ctx.canvas.addEventListener('mouseover', function (e) {
            raf = window.requestAnimationFrame(draw);
        });

        ctx.canvas.addEventListener('mouseout', function (e) {
            window.cancelAnimationFrame(raf);
        });

    }, 400);
}

view.when(function () {
    console.log('here')
    const layer = new Motion.MotionLayer({ title: "My Day", source: data });
    view.graphics.add(layer.LayerLines[0].graphic);

    console.log(view)
    insertCanvas();

    view.on("mouseover", function (event) {
        var screenPoint = {
          x: event.x,
          y: event.y
        };
        console.log(screenPoint)
    }


});


// view.on("drag", (r) => {
//     customCanvas(r);
// });