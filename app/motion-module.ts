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
import { RGBColor } from "../node_modules/@types/d3/index";
import { GeoJsonObject } from "../node_modules/@types/geojson/index";

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
    color: RGBColor;
    lineWidth: number;
    state: {segment: number, vertex: number};
    catField: string;
    labelField: string;



    constructor(args: object) {
        super()
        this.source = args["source"]? args["source"] : console.error('Source data is required');
        this.catField = args["catField"] ? args["catField"] : undefined;
        this.view = args["view"] ? args["view"] : console.error('please pass your view as parameter');
        this.speed = args["speed"] ? args["speed"] : 1;
        this.color = args["color"] ? args["color"] : 'black';
        this.sourceType = args["sourceType"];
        this.LayerLines = args["source"];
        this.LayerPoints = args["source"];
        this.Categories = args["catField"] ? args["catField"] : undefined;
        this.state = {segment:0, vertex: 0};
        this.lineWidth = args["width"] ? args["width"] : 2;
        this.shadowBlur = args["shadowBlur"];
        this.labelField = args["labelField"];

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

                const geom = this.source.features.map((r: any) => {
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
        var geom = this.source.features.map((r: any) => {
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
        const geom = value.features.map((r: any) => r.geometry);
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

    get Categories(): Array {
        return this._categories;
    }

    set Categories(Field: string) {
        const allValues = this.LayerLines.graphics.items.map((r) => r.attributes[Field]);
        // console.log(allValues)
        const catFields = allValues.filter((v, i, a) => a.indexOf(v) === i); 
        const catColorArray = {};

        function getColor() {
            for(var i = 0; i < 100; i ++) {
                const color = this.randomColor();
                if(!Object.values(this.Categories).includes(color)) {
                    return color;
                } else {
                    // do nothing
                }
            }
            return color;
        }


        catFields.map((r) => {
            // const FinalColor = getColor();
            catColorArray[r] = this.randomColor(); 
        });

        if(this.catField !== undefined) {
            this._categories = catColorArray;
        }
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
        this.view.watch('rotation', (e) => {
            this._recordChange(e);
        });

        this.view.watch('zoom', (e) => {
            this._recordChange(e);
        })

        this.view.watch('extent', (e) => {
            this._recordChange(e);
        })
        
    }

    private _recordChange(e: any) {
        cancelAnimationFrame(this.anFrame);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this._paint();
    }

    private _initCustomGraphics(layer: object) {

        var PIXEL_RATIO = (function () {
            var ctx = document.createElement("canvas").getContext("2d"),
                dpr = window.devicePixelRatio || 1,
                bsr = ctx.webkitBackingStorePixelRatio ||
                      ctx.mozBackingStorePixelRatio ||
                      ctx.msBackingStorePixelRatio ||
                      ctx.oBackingStorePixelRatio ||
                      ctx.backingStorePixelRatio || 1;
        
            return dpr / bsr;
        })();
        
        
        var createHiDPICanvas = function(w, h, ratio) {
            if (!ratio) { ratio = PIXEL_RATIO; }
            var can = document.createElement("canvas");
            can.width = w * ratio;
            can.height = h * ratio;
            can.style.width = w + "px";
            can.style.height = h + "px";
            can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
            return can;
        };
        
        var initCanvas = document.querySelector('.esri-display-object');
        var proto = createHiDPICanvas(screen.width, screen.height, PIXEL_RATIO);
        proto.id = this.title;
        var rootDiv = document.querySelector('g');
        this.ctx = proto.getContext("2d");
        this.ctx.canvas.style.position = 'absolute';
        this.ctx.canvas.style.zIndex = '0';
        initCanvas.insertAdjacentElement('afterend', this.ctx.canvas)
        this.ctx.canvas.width = screen.width;
        this.ctx.canvas.height = screen.height;
        this.ctx.strokeStyle = this.color;
        this.ctx.font = '12px Avenir Next W00';
        this.ctx.lineCap = "round";
        // this.ctx.shadowColor = this.shadowBlur ? "rgba(0,0,0,1)" : undefined;
        // this.ctx.shadowBlur = this.shadowBlur ? 2 : undefined;
        this.ctx.lineJoin = 'round';
        this.ctx.fillStyle = 'rgba(0, 0, 0, .8)';
        // this.view.zoom = this.view.zoom + 1;
        // bouncingBall(layer);
        // vertexes for line segment


        this._paint();
    }

    private _paint() {
        this._drawExistingState();
        this.LayerLines.graphics.items.sort((a, b) => new Date(a.attributes.timespan.begin) - new Date(b.attributes.timespan.begin));
        async function asyncFunc() {
            for (let i = 0; i < this.LayerLines.graphics.items.length; i++) {
                // this.view.extent = layer.LayerLines.graphics.items[i].geometry.extent;
                if (i > this.state.segment - 1) {

                    if(this.Categories !== undefined) {
                        const category = this.LayerLines.graphics.items[i].attributes[this.catField];
                        this.setColor(this.Categories[category]);
                    }

                    if(this.LayerLines.graphics.items[i].attributes.velocity) {
                        this.setSpeed(this.LayerLines.graphics.items[i].attributes.velocity *.5);
                    };

                    await this._addVertexes(this.LayerLines.graphics.items[i].geometry.paths[0], undefined, undefined);
                    this.state.segment += 1;
                    //console.log('segment +1');
                    this.ctx.clearRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height)
                    this._drawExistingState();
                }
            }
        }


        const loopSegments = asyncFunc.bind(this)
        loopSegments().then((r: string) => { /* console.log('complete'); */ })
    }

    private _drawExistingState() {
        const existingState = [];
        
        // sort by timespan
        this.LayerLines.graphics.items.sort((a, b) => new Date(a.attributes.timespan.begin) - new Date(b.attributes.timespan.begin));
        // cool effect commented out...
        // for(let i = this.state.segment; i < this.state.segment + 1; i++) {
        for(let i = 0; i < this.state.segment; i++) {
            const tempArray = [];
            for(var j = 0; j < this.LayerLines.graphics.items[i].geometry.paths[0].length; j++) {
                if(this.Categories !== undefined) {
                    const category = this.LayerLines.graphics.items[i].attributes[this.catField];
                    this.setColor(this.Categories[category]);
                }
                
                var point = this.view.toScreen(
                        new Point(this.LayerLines.graphics.items[i].geometry.paths[0][j])
                    )

                    // set label based on category
                    this.labelField ? point.attribute = this.LayerLines.graphics.items[i].attributes[this.labelField] : undefined;
                    this.Categories ? point.vectorColor = this.Categories[this.LayerLines.graphics.items[i].attributes[this.catField]] : undefined;

                tempArray.push(
                    point
                );
            }
            typeof(tempArray[0]) === "object" ? existingState = [tempArray] : undefined;
            this._draw(existingState);
        }
        // console.log(existingState)
        
    }
    
    private _draw(g: any) {
        
        this.ctx.beginPath();
        var g = this.simplify(g, 4, false);
        for (var i = 0; i < g.length; i ++) {
            this.ctx.moveTo(g[i][0].x, g[i][0].y);
            // for (var j = 0; j < g[i].length - 1; j++) {
            //     this.ctx.quadraticCurveTo(g[i][j].x, g[i][j].y, g[i][j+1].x, g[i][j+1].y);
            //     if (j === 0) {
            //         // this.ctx.fillText(g[i][j].attribute, g[i][j].x, g[i][j].y)
            //     } 
            // }

            for (var j = 0; j < g[i].length; j++) {
                this.ctx.lineTo(g[i][j].x, g[i][j].y);
                if (j === 0) {
    
                } 
            }
        }
        // console.log(g)
        this.Categories ? this.ctx.strokeStyle = g[0][0].vectorColor : undefined;
        // this.ctx.lineCap = 'round';
        //this.ctx.lineJoin = 'round';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'white';
        this.ctx.stroke();
        this.ctx.shadowBlur = 2;
        this.ctx.shadowColor = 'white';
        this.labelField ? this.ctx.fillText(g[0][0].attribute, g[0][0].x, g[0][0].y) : undefined;
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
            // vertices = simplify(vertices, 4, true);
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


            // variable to hold how many frames have elapsed in the animation
            var t = 1;
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
            var points = calcWaypoints(vertices);
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
            }

            animate.bind(this);
            animate();
        })
    }

    private randomColor() {
        var color = ["#ffc107", "#e91e63", "#673ab7", "#2196f3", "#4caf50", "#ffeb3b"]
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

    public addToMap() {
        // start initializing layer
        this._initView(this.view);
    }

    public zoomTo() {
        this.view.extent = this.CustomExtent;
    }

    private simplify(points, tolerance, highestQuality) {

        /*
        (c) 2017, Vladimir Agafonkin
        Simplify.js, a high-performance JS polyline simplification library
        mourner.github.io/simplify-js
        */

        if (points.length <= 2) return points;
    
        var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;
    
        points = highestQuality ? points : this.simplifyRadialDist(points, sqTolerance);
        points = this.simplifyDouglasPeucker(points, sqTolerance);
    
        return points;
    }

    private simplifyDPStep(points, first, last, sqTolerance, simplified) {
        /*
        (c) 2017, Vladimir Agafonkin
        Simplify.js, a high-performance JS polyline simplification library
        mourner.github.io/simplify-js
        */
        var maxSqDist = sqTolerance,
            index;
    
        for (var i = first + 1; i < last; i++) {
            var sqDist = this.getSqSegDist(points[i], points[first], points[last]);
    
            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }
    
        if (maxSqDist > sqTolerance) {
            if (index - first > 1) this.simplifyDPStep(points, first, index, sqTolerance, simplified);
            simplified.push(points[index]);
            if (last - index > 1) this.simplifyDPStep(points, index, last, sqTolerance, simplified);
        }
    }
    
    // simplification using Ramer-Douglas-Peucker algorithm
    private simplifyDouglasPeucker(points, sqTolerance) {
        /*
        (c) 2017, Vladimir Agafonkin
        Simplify.js, a high-performance JS polyline simplification library
        mourner.github.io/simplify-js
        */
        var last = points.length - 1;
    
        var simplified = [points[0]];
        this.simplifyDPStep(points, 0, last, sqTolerance, simplified);
        simplified.push(points[last]);
    
        return simplified;
    }

    private getSqDist(p1, p2) {
        /*
        (c) 2017, Vladimir Agafonkin
        Simplify.js, a high-performance JS polyline simplification library
        mourner.github.io/simplify-js
        */

        var dx = p1.x - p2.x,
            dy = p1.y - p2.y;
    
        return dx * dx + dy * dy;
    }
    
    // square distance from a point to a segment
    private getSqSegDist(p, p1, p2) {
        /*
        (c) 2017, Vladimir Agafonkin
        Simplify.js, a high-performance JS polyline simplification library
        mourner.github.io/simplify-js
        */
    
        var x = p1.x,
            y = p1.y,
            dx = p2.x - x,
            dy = p2.y - y;
    
        if (dx !== 0 || dy !== 0) {
    
            var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
    
            if (t > 1) {
                x = p2.x;
                y = p2.y;
    
            } else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }
    
        dx = p.x - x;
        dy = p.y - y;
    
        return dx * dx + dy * dy;
    }

    private simplifyRadialDist(points, sqTolerance) {
        /*
        (c) 2017, Vladimir Agafonkin
        Simplify.js, a high-performance JS polyline simplification library
        mourner.github.io/simplify-js
        */
    
        var prevPoint = points[0],
            newPoints = [prevPoint],
            point;
    
        for (var i = 1, len = points.length; i < len; i++) {
            point = points[i];
    
            if (this.getSqDist(point, prevPoint) > sqTolerance) {
                newPoints.push(point);
                prevPoint = point;
            }
        }
    
        if (prevPoint !== point) newPoints.push(point);
    
        return newPoints;
    }

}


export { MotionLayer }