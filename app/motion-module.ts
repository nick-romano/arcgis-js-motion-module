import Layer = require("esri/layers/Layer");
import LayerView = require("esri/views/layers/LayerView");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import Graphic = require("esri/Graphic");
import { Point, Polygon, Polyline } from "esri/geometry";
import { subclass, property, declared } from "esri/core/accessorSupport/decorators";


@subclass("esri/layers/MotionLayer")
class MotionLayer extends declared(Layer) {
    @property()
    source: object;

    @property()
    _LayerLines: object;
    _LayerPoints: object;


    constructor(args: object) {
        super()
        this.LayerLines = args["source"];
        this.LayerPoints = args["source"];

        //start initializing layer
        this._initView(args.view)
    }

    get LayerLines(): object {
        return this._LayerLines
    }

    set LayerLines(value: object) {
        try {
            const lineSymbol = new SimpleLineSymbol({
                color: [255, 255, 255],  // RGB color values as an array
                width: 4
            });

            var geom = value["data"].features.map((r: any) => r.geometry);
            geom.paths = geom.map((r: any) => {
                var a = r.coordinates.map((a: any) => a)
                return a
            });

            var LineFeatures = geom.filter((r: any) => r.type === "LineString" ? r : null);
            LineFeatures.map((r: any) => {
                r.geometry = new Polyline();
                r.type = "polyline";
                r.attributes = { a: "b" };
                r.geometry.paths[0] = [];
                r.coordinates.map((t: object) => r.geometry.paths[0].push([t[0], t[1]]));
                r.symbol = lineSymbol;
                r.graphic = new Graphic({ geometry: r.geometry, attributes: r.attributes, symbol: r.symbol });
            });

            this._LayerLines = LineFeatures
        } catch (e) {
            console.error(e);
        }
    }

    get features(): object {
        var geom = this.source["data"].features.map((r: any) => r.geometry);
        geom.paths = geom.map((r: any) => {
            var a = r.coordinates.map((a: any) => a)
            return a
        });
        return geom
    }

    get LayerPoints(): object {
        return this._LayerPoints;
    }

    set LayerPoints(value: object) {
        const geom = value["data"].features.map((r: any) => r.geometry);
        const PointFeatures = geom.filter((r: any) => r.type === "Point" ? r : null);
        const MarkerSymbol = new SimpleMarkerSymbol({
            color: "black",
            size: 16,
        })
        PointFeatures.Points = new Array;
        PointFeatures.map((r: any) => {
            r.geometry = new Point(r.coordinates),
                r.type = "Point",
                // ! set up polyfill for attributes
                r.attributes = { 'blah': 'blah' },
                r.symbol = MarkerSymbol,
                r.graphic = new Graphic({ geometry: r.geometry, attributes: r.attributes, symbol: r.symbol });
        });

        this._LayerPoints = PointFeatures;
    }

    _initView(view: object) {
        try {
            this.mapView = view;
            this._initCustomGraphics(this);
            this._initListeners();
        } catch (error) {
            console.error(error)
        }
    }

    _initListeners() {

    }

    _initCustomGraphics(layer: object) {
        var initCanvas = document.querySelector('.esri-display-object');
        var proto = document.createElement("canvas");
        proto.id = "motionLayer"
        var rootDiv = document.querySelector('g');
        this.ctx = proto.getContext("2d");
        this.ctx.canvas.style.position = 'absolute';
        this.ctx.canvas.style.zIndex = '0';
        initCanvas.insertAdjacentElement('beforebegin', this.ctx.canvas)
        this.ctx.canvas.width = initCanvas.width;
        this.ctx.canvas.height = initCanvas.height;
        // bouncingBall(layer);

        this._addVertexes(this, undefined, undefined);
    }

    _addVertexes(layer: any, event: object, change: object) {
        const g = layer.LayerLines[0].graphic.geometry.paths[0].map((r: any) => {
            return this.mapView.toScreen(new Point(r));
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
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.beginPath();
            this.ctx.moveTo(g[0].x, g[0].y);
            for (var i = 0; i < g.length; i++) {
                this.ctx.lineTo(g[i].x, g[i].y);
            }
            this.ctx.stroke();
        }
        // Don't need to draw right now
        // draw();
        this._animate(g);
    }

    _animate(g: Array<Object>) {
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


        // window.cancelAnimationFrame();
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.lineCap = "round";
        this.ctx.fillStyle = 'red';

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
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'red';
        // calculate incremental points along the path
        var points = calcWaypoints(vertices);
        // extend the line from start to finish with animation
       

        const removeAnim = this.mapView.on('drag', removeAnimation);
        let iter = 0;

        function removeAnimation(event) {
            console.log(iter)
            iter += 1;
            cancelAnimationFrame(anFrame);
            console.log(event)
            if (event.action === "end") {
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


        let animate = () => {
            if (t < points.length - 1) {
                animate = animate.bind(this);
                anFrame = requestAnimationFrame(animate);
            }
            // draw a line segment from the last waypoint
            // to the current waypoint
            this.ctx.beginPath();
            this.ctx.moveTo(points[t - 1].x, points[t - 1].y);
            this.ctx.lineTo(points[t].x, points[t].y);
            this.ctx.stroke();
            // increment "t" to get the next waypoint
            t++;
        } 
        
        animate.bind(this);
        animate();
    }

}

}

export { MotionLayer }