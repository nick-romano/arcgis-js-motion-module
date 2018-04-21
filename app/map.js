define(["require", "exports", "esri/Map", "esri/views/MapView", "./motion-module.js", "./data.js"], function (require, exports, EsriMap, MapView, Motion, data) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new EsriMap({
        basemap: "topo"
    });
    var view = new MapView({
        map: map,
        container: "viewDiv",
        center: [-76.93, 38.9897],
        zoom: 12
    });
    var insertCanvas = function (r) {
        setTimeout(function () {
            console.log('1');
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
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ball.draw();
                ball.x += ball.vx;
                ball.y += ball.vy;
                if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
                    ball.vy = -ball.vy;
                }
                if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
                    ball.vx = -ball.vx;
                }
                raf = window.requestAnimationFrame(draw);
                ctx.restore();
            }
            view.on('pointer-enter', function (e) {
                console.log('mouseover');
                raf = window.requestAnimationFrame(draw);
            });
            view.on('pointer-leave', function (e) {
                window.cancelAnimationFrame(raf);
            });
        });
    };
    var customCanvas = function (r) {
        setTimeout(function () {
            var initCanvas = document.querySelector('.esri-display-object');
            var proto = document.createElement("canvas");
            var rootDiv = document.querySelector('g');
            var ctx = proto.getContext("2d");
            ctx.canvas.style.position = 'absolute';
            ctx.canvas.style.zIndex = '100';
            initCanvas.insertAdjacentElement('beforebegin', ctx.canvas);
            // document.body.insertAdjacentElement(ctx.canvas, initCanvas)
            ctx.canvas.width = initCanvas.width;
            ctx.canvas.height = initCanvas.height;
            var raf;
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
                if (ball.y + ball.vy > ctx.canvas.height || ball.y + ball.vy < 0) {
                    ball.vy = -ball.vy;
                }
                if (ball.x + ball.vx > ctx.canvas.width || ball.x + ball.vx < 0) {
                    ball.vx = -ball.vx;
                }
                raf = window.requestAnimationFrame(draw);
            }
            view.on('pointer-enter', function (e) {
                console.log('mouseover');
                raf = window.requestAnimationFrame(draw);
            });
            view.on('pointer-leave', function (e) {
                window.cancelAnimationFrame(raf);
            });
        }, 400);
    };
    view.when(function () {
        console.log('here');
        var layer = new Motion.MotionLayer({ title: "My Day", source: data });
        view.graphics.add(layer.LayerLines[0].graphic);
        console.log(view);
        customCanvas();
        view.on("mouseover", function (event) {
            var screenPoint = {
                x: event.x,
                y: event.y
            };
            console.log(screenPoint);
        });
    });
});
// view.on("drag", (r) => {
//     customCanvas(r);
// });
//# sourceMappingURL=map.js.map