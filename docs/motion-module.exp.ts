import Layer = require("esri/layers/Layer");
import LayerView = require("esri/views/layers/LayerView");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import GraphicsLayer = require("esri/layers/GraphicsLayer")
import Graphic = require("esri/Graphic");
import Extent = require("esri/geometry/Extent");
import MapView = require("esri/views/MapView")
import { Point, Polygon, Polyline } from "esri/geometry";
import { subclass, property, declared } from "esri/core/accessorSupport/decorators";
import watchUtils = require("esri/core/watchUtils");

@subclass("esri/layers/MotionLayer")
class MotionLayer extends declared(Layer) {
    @property()
    source: Object;
    sourceType: String;
    _LayerLines: Layer;
    _LayerPoints: Layer;
    view: MapView;
    mapView: MapView;
    ctx: CanvasRenderingContext2D;
    CustomExtent: Extent;
    speed: number;
    color: Color;
    lineWidth: number;
    state: {segment: number, vertex: number};


    constructor(args: object) {
        super()
        this.view = args["view"];
        this.speed = args["speed"];
        this.color = args["color"];
        this.sourceType = args["sourceType"];
        this.LayerLines = args["source"];
        this.LayerPoints = args["source"];
        this.state = {segment:0, vertex:55};
        this.lineWidth = 2;

        // start initializing layer
        this._initView(args["view"])

        //for dev
        window.layer = this;
        window.view = args["view"];
    }

    get LayerLines(): object {
        return this._LayerLines
    }

    set LayerLines(value: object) {
        if(this.sourceType !== "GEOJSON" && this.sourceType !== "FeatureLayer") {
            console.error("sourceType is not valid");
        }
        else if (this.sourceType === "GEOJSON") {
            try {
                const lineSymbol = new SimpleLineSymbol({
                    color: [255, 255, 255],  // RGB color values as an array
                    width: 4
                });

                const geom = value["data"].features.map((r: any) => {
                    let obj = {};
                    obj.geometry = r.geometry;
                    obj.properties = r.properties;
                    return obj;
                });
                const LineFeatures = geom.filter((r: any) => r.geometry.type === "LineString" ? r : null);
                LineFeatures = LineFeatures.map((r: any) => {
                    var graphic = new Graphic;
                    graphic.geometry = new Polyline();
                    graphic.attributes = r.properties;
                    // to update with param field
                    const timeDiff: number = (new Date(r.properties["timespan"].end).valueOf() - new Date(r.properties["timespan"].begin).valueOf()) * .001;
                    graphic.attributes.timeDiff = timeDiff;
                    graphic.attributes.velocity = (r.properties.Distance * 1) / timeDiff;
                    graphic.geometry.paths[0] = [];
                    var arr: Array<Array<number>> = [];
                    r.geometry.coordinates.map((t: object) => arr.push([t[0], t[1]]));
                    graphic.geometry.paths[0] = arr;
                    graphic.symbol = lineSymbol;
                    return graphic
                });

                this._LayerLines = new GraphicsLayer({
                    graphics: LineFeatures.map((r: any) => r.clone())
                })
                const len = this._LayerLines.graphics.items.length
                // set extent for map; 
                const xmax = this._LayerLines.graphics.items.sort((a: Graphic, b: Graphic) => a.geometry.extent.xmax - b.geometry.extent.xmax)[0].geometry.extent.xmax * .992;
                const xmin = this._LayerLines.graphics.items.sort((a: Graphic, b: Graphic) => a.geometry.extent.xmin - b.geometry.extent.xmin)[len - 1].geometry.extent.xmin * 1.002;
                const ymax = this._LayerLines.graphics.items.sort((a: Graphic, b: Graphic) => a.geometry.extent.ymax - b.geometry.extent.ymax)[0].geometry.extent.ymax * .998;
                const ymin = this._LayerLines.graphics.items.sort((a: Graphic, b: Graphic) => a.geometry.extent.ymin - b.geometry.extent.ymin)[len - 1].geometry.extent.ymin * 1.002;

                this.CustomExtent = new Extent({ xmax, xmin, ymax, ymin })
                /// this._LayerLines.fullExtent.width = 100000;

            } catch (e) {
                console.error(e);
            }
        }
    }

    get features(): object {
        var geom = this.source["data"].features.map((r: any) => {
            let obj = {};
            obj.geometry = r.geometry;
            obj.properties = r.properties;
            return obj;
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

    private _initView(view: object) {
        try {
            this.mapView = view;
            this._initCustomGraphics(this);
            this._initListeners();
        } catch (error) {
            console.error(error)
        }
    }

    private _initListeners() {
        this.view.on("drag", () => {
            cancelAnimationFrame(this.anFrame);
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this._paint();
        });

        this.view.on("pointer-down", () => {
            cancelAnimationFrame(this.anFrame);
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this._paint();
        });

        this.view.on("hold", () => {
            cancelAnimationFrame(this.anFrame);
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this._paint();
        });

        // setTimeout(function(){
        //     watchUtils.whenTrue(this.view, "stationary", this._recordChange);
        // }.bind(this), 1000)
    }

    private _recordChange(e: any) {
        cancelAnimationFrame(this.anFrame);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this._paint();
    }

    private _initCustomGraphics(layer: object) {
        var initCanvas = document.querySelector('.esri-display-object');
        var proto = document.createElement("canvas");
        proto.id = "motionLayer"
        var rootDiv = document.querySelector('g');
        this.ctx = proto.getContext("2d");
        this.ctx.canvas.style.position = 'absolute';
        this.ctx.canvas.style.zIndex = '0';
        initCanvas.insertAdjacentElement('beforebegin', this.ctx.canvas)
        this.ctx.canvas.width = screen.width;
        this.ctx.canvas.height = screen.height;
        this.view.extent = layer.CustomExtent;
        // this.view.zoom = this.view.zoom + 1;
        // bouncingBall(layer);
        // vertexes for line segment
        this._paint();
    }

    private _paint() {
        // this._drawExistingState();

        async function asyncFunc() {
            for (let i = 0; i < this.LayerLines.graphics.items.length; i++) {
                // this.view.extent = layer.LayerLines.graphics.items[i].geometry.extent;
                if (i > this.state.segment - 1) {
                    if(i === this.state.segment) {
                        const vertexes = this.LayerLines.graphics.items[i].geometry.paths[0];
                        await this._addVertexes(vertexes, undefined, undefined);
                        this.state.segment += 1;
                        this.state.vertex = 1;
                        console.log('segment +1');
                    }
                }
            }
        }
        const loopSegments = asyncFunc.bind(this)
        loopSegments().then((r: string) => { console.log(r) })
    }

    private _drawExistingState() {
        const existingState = [];
        for(let i = 0; i <= this.state.segment; i++) {
            const tempArray = [];
            for(var j = 0; j < this.LayerLines.graphics.items[i].geometry.paths[0].length; j++) {
                if(this.state.segment === i) {
                    console.log('match');

                    if(j < this.state.vertex) {
                        tempArray.push(
                            this.view.toScreen(
                                new Point(this.LayerLines.graphics.items[i].geometry.paths[0][j])
                            )
                        );
                    }
                } else {
                    tempArray.push(
                        this.view.toScreen(
                            new Point(this.LayerLines.graphics.items[i].geometry.paths[0][j])
                        )
                    );
                }
            }
            typeof(tempArray[0]) === "object" ? existingState.push(tempArray) : undefined;
        }
        // console.log(existingState)
        this._draw(existingState);
    }

    // draw just draw the line statically on the page
    private _draw(g: any) {
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        for (var i = 0; i < g.length; i ++) {
            this.ctx.moveTo(g[i][0].x, g[i][0].y);
            for (var j = 0; j < g[i].length; j++) {
                this.ctx.lineTo(g[i][j].x, g[i][j].y);
            }
        }
        this.ctx.stroke();
    }

    private _addVertexes(vertexArray: any, event: object, change: object) {
        return new Promise<string>((resolve: string, reject: PromiseRejectionEvent) => {
            const g = vertexArray.map((r: any) => {
                return this.mapView.toScreen(new Point(r));
            });

            var length = 0;
            for (var i = 0; i < g.length; i++) {
                if (i < g.length - 1) {
                    var distance = Math.sqrt(Math.pow(g[i + 1].x - g[i].x, 2) + Math.pow(g[i + 1].y - g[i].y, 2));
                    length += distance;
                }
            };
            this._animate(g).then((r: any) => resolve(r));
        })
    }

    private _animate(g: Array<Object>) {
        // calc waypoints traveling along vertices
        let calcWaypoints = function (vertices: Array<Point>) {

            var waypoints = [];
            for (var i = 1; i < vertices.length; i++) {
                var pt0 = vertices[i - 1];
                var pt1 = vertices[i];
                var dx = pt1.x - pt0.x;
                var dy = pt1.y - pt0.y;
                // review this use of distance, but seems to smooth out transistion, 
                // previously distance was replaced with the value 100
                var distance = Math.sqrt(Math.pow(pt1.x - pt0.x, 2) + Math.pow(pt1.y - pt0.y, 2));
                for (var j = 0; j < (distance / this.speed); j++) {
                    var x = pt0.x + dx * j / (distance / this.speed);
                    var y = pt0.y + dy * j / (distance / this.speed);
                    waypoints.push({
                        x: x,
                        y: y
                    });
                }
            }
            return (waypoints);
        };

        calcWaypoints = calcWaypoints.bind(this);

        return new Promise<string>((resolve: any, reject: PromiseRejectionEvent) => {
            let anFrame: number;
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
            }

            if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback: Function, element: HTMLElement) {
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
            // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.lineCap = "round";
            this.ctx.fillStyle = 'rgb(255,255,255)';

            // variable to hold how many frames have elapsed in the animation
            var t = this.state.vertex;
            // t = 1;

            // define the path to plot
            var vertices = g.map(
                (r: Point) => {
                    return new Point({
                        x: r.x,
                        y: r.y
                    });
                });



            // set some style
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.strokeStyle = this.color;
            // calculate incremental points along the path
            var points = calcWaypoints(vertices).filter((a,b) => {
                return b > this.state.vertex;
            });
            this.currentPointArray = points;
            // extend the line from start to finish with animation



            let animate = () => {
                if (t < points.length - 1) {
                    // this.ctx.strokeStyle = this.randomColor();
                    animate = animate.bind(this);
                    this.anFrame = requestAnimationFrame(animate);
                } else {
                    resolve('done')
                }
                // draw a line segment from the last waypoint
                // to the current waypoint
                this.ctx.beginPath();
                this.ctx.moveTo(points[t - 1].x, points[t - 1].y);
                this.ctx.lineTo(points[t].x, points[t].y);
                this.ctx.stroke();
                // increment "t" to get the next waypoint
                t += 1;

                this.state.vertex = t;
                // console.log(this.state.vertex);
            }

            animate.bind(this);
            animate();
        })
    }

    private randomColor() {
        var color = ["red", "green", "cyan", "yellow", "purple", "orange"]
        return color[Math.floor(Math.random() * 6)];
    }

    public setSpeed(speed: number) {
        this.speed = speed;
    }

    public getSpeed() {
        return this.speed;
    }

    public setColor(color: any) {
        if (color === "random") {
            this.color = color;
        } else {
            this.color = this.randomColor();
        }
    }

    public getColor() {
        return this.color;
    }

}


export { MotionLayer }