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
import Collection = require("esri/core/Collection");

export interface source {
    features: Array<object>
}

export interface ExtendedScreenPoint extends __esri.ScreenPoint {
    attribute: string | undefined;
    vectorColor: string | undefined;

}

export interface IMotionLayer {
    source: source,
    catField: string | undefined,
    sourceType: ESourceType,
    view: MapView,
    speed: number,
    color: string,
    lineWidth: number,
    width: number,
    shadowBlur: boolean,
    labelField: string

}

export enum ESourceType {
    GEOJSON = "GEOJSON"
}


class geoJSONFeature {
    @property()
    geometry: object | undefined;
    properties: object | undefined;
}


@subclass("esri/layers/MotionLayer")
class MotionLayer extends declared(Layer) {
    @property()
    source: source;
    sourceType: ESourceType;
    catField: string | undefined;
    view: MapView;
    LayerLines: GraphicsLayer | undefined;
    LayerPoints: Graphic[] | undefined;
    mapView: MapView;
    ctx: CanvasRenderingContext2D;
    CustomExtent: Extent | undefined;
    categories: { [item: string]: string } | undefined;
    speed: number;
    color: string;
    lineWidth: number;
    state: { segment: number, vertex: number };
    labelField: string;
    shadowBlur: boolean;
    anFrame: number;



    constructor(args: IMotionLayer) {
        super()
        this.source = args["source"]
        this.catField = args["catField"] ? args["catField"] : undefined;
        console.log(args.view);
        this.view = args["view"];
        this.mapView = this.view;
        this.speed = args["speed"] ? args["speed"] : 1;
        this.color = args["color"] ? args["color"] : 'black';
        this.sourceType = args["sourceType"];
        this.LayerLines = this.createLayerLines();
        this.LayerPoints = this.createLayerPoints();
        this.categories = this.createCategories();
        this.state = { segment: 0, vertex: 0 };
        this.lineWidth = args["width"] ? args["width"] : 2;
        this.shadowBlur = args["shadowBlur"] ? args["shadowBlur"] : false;
        this.labelField = args["labelField"];
        this.ctx = this._createCTX();
        this.anFrame = 0;

        // //for dev
        // window.layer = this;
        // window.view = args["view"];
    }

    createLayerLines() {
        if (this.sourceType === ESourceType.GEOJSON) {
            const lineSymbol = new SimpleLineSymbol({
                color: [255, 255, 255],  // RGB color values as an array
                width: 4
            });

            const geom = this.source.features.map((r: any) => {
                let obj: { geometry: object, properties: Array<object> } = {
                    geometry: r.geometry,
                    properties: r.properties
                }
                return obj;
            });
            let LineFeatures: any = geom.filter((r: any) => r.geometry.type === "LineString" ? r : null);
            LineFeatures = LineFeatures.map((r: any) => {
                var graphic: Graphic = new Graphic;
                // graphic.geometry = new Polyline();
                graphic.attributes = r.properties;
                // to update with param field
                const timeDiff: number = (new Date(r.properties["timespan"].end).valueOf() - new Date(r.properties["timespan"].begin).valueOf()) * .001;
                graphic.attributes.timeDiff = timeDiff;
                graphic.attributes.velocity = (r.properties.Distance * 1) / timeDiff;
                const pline = new Polyline();
                pline.paths[0] = [];
                var arr: Array<Array<number>> = [];
                r.geometry.coordinates.forEach((t: [number, number]) => arr.push([t[0], t[1]]));
                pline.paths[0] = arr;
                graphic.geometry = pline;
                graphic.symbol = lineSymbol;
                return graphic
            });

            const _LayerLines = new GraphicsLayer({
                graphics: LineFeatures.map((r: any) => r.clone())
            })
            const len = _LayerLines.graphics.length
            // set extent for map; 
            _LayerLines.graphics.sort((a: Graphic, b: Graphic) => a.geometry.extent.xmax - b.geometry.extent.xmax);
            const xmax = _LayerLines.graphics.getItemAt(0).geometry.extent.xmax * .992;
            _LayerLines.graphics.sort((a: Graphic, b: Graphic) => a.geometry.extent.xmin - b.geometry.extent.xmin)
            const xmin = _LayerLines.graphics.getItemAt(len - 1).geometry.extent.xmin * 1.002;
            _LayerLines.graphics.sort((a: Graphic, b: Graphic) => a.geometry.extent.ymax - b.geometry.extent.ymax)
            const ymax = _LayerLines.graphics.getItemAt(0).geometry.extent.ymax * .998;
            _LayerLines.graphics.sort((a: Graphic, b: Graphic) => a.geometry.extent.ymin - b.geometry.extent.ymin)
            const ymin = _LayerLines.graphics.getItemAt(len - 1).geometry.extent.ymin * 1.002;

            this.CustomExtent = new Extent({ xmax, xmin, ymax, ymin })
            /// this._LayerLines.fullExtent.width = 100000;
            return _LayerLines

        }
    }

    get features(): object {
        var geom = this.source.features.map((r: any) => {
            let obj: geoJSONFeature = new geoJSONFeature();
            obj.geometry = r.geometry;
            obj.properties = r.properties;
            return obj;
        });

        return geom
    }

    createLayerPoints() {
        if (this.sourceType === ESourceType.GEOJSON) {
            const geom = this.source.features.map((r: any) => r.geometry);
            const PointFeatures = geom.filter((r: any) => r.type === "Point" ? r : null);
            const MarkerSymbol = new SimpleMarkerSymbol({
                color: "black",
                size: 16,
            })

            PointFeatures.map((r: any) => {
                r.geometry = new Point(r.coordinates),
                    r.type = "Point",
                    // ! set up polyfill for attributes
                    r.attributes = {},
                    r.symbol = MarkerSymbol,
                    r.graphic = new Graphic({ geometry: r.geometry, attributes: r.attributes, symbol: r.symbol });
            });

            return PointFeatures;
        }
    }

    createCategories() {
        const categories = {};
        if (this.catField) {
            const allValues: any = this.LayerLines!.graphics.map((r) => r.attributes[this.catField!]);
            // console.log(allValues)
            const catFields = allValues.filter((v: any, i: any, a: any) => a.indexOf(v) === i);
            const catColorArray: { [item: string]: string } = {};

            const getColor = () => {
                for (var i = 0; i < 100; i++) {
                    const color = this.randomColor();
                    if (!(color in categories)) {
                        return color;
                    } else {
                        return 'black';
                    };
                };
            }


            catFields.forEach((r: string) => {
                // const FinalColor = getColor();
                catColorArray[r] = this.randomColor();
            });

            if (this.catField !== undefined) {
                return catColorArray;
            } else {
                return undefined;
            }
        }
    }

    private _initView(view: object) {
        try {
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

    private _calcPixelRatio () {
        const PIXEL_RATIO = (function () {
            var ctx = document.createElement("canvas").getContext("2d"),
                dpr = window.devicePixelRatio || 1,
                bsr = 1;

            return dpr / bsr;
        })();
        return PIXEL_RATIO;
    } 

    private _createCTX () {
        const PIXEL_RATIO = this._calcPixelRatio();
        const proto = this._createHiDPICanvas(screen.width, screen.height, PIXEL_RATIO);
        proto.id = this.title;
        var rootDiv = document.querySelector('g');
        const ctx = proto.getContext("2d")!;
        return ctx;
    }

    private _recordChange(e: any) {
        cancelAnimationFrame(this.anFrame);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this._paint();
    }

    private _createHiDPICanvas (w: number, h: number, ratio: number) {

        const PIXEL_RATIO = this._calcPixelRatio();

        if (!ratio) { ratio = PIXEL_RATIO; }
        var can = document.createElement("canvas");
        can.width = w * ratio;
        can.height = h * ratio;
        can.style.width = w + "px";
        can.style.height = h + "px";
        can.getContext("2d")!.setTransform(ratio, 0, 0, ratio, 0, 0);
        return can;
    };

    private _initCustomGraphics(layer: object) {

        const view = this.mapView as any;
        const initCanvas: any = view.surface as unknown;

        this.ctx.canvas.style.position = 'absolute';
        this.ctx.canvas.style.zIndex = '0';
        initCanvas.prepend(this.ctx.canvas);
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

        this.LayerLines!.graphics.sort((a, b) => new Date(a.attributes.timespan.begin).valueOf() - new Date(b.attributes.timespan.begin).valueOf());

        this.loopSegments();
    }

    private async loopSegments() {
        for (let i = 0; i < this.LayerLines!.graphics.length; i++) {
            // this.view.extent = layer.LayerLines.graphics.items[i].geometry.extent;
            if (i > this.state.segment - 1) {

                if (this.categories !== undefined && this.catField) {
                    const category = this.LayerLines!.graphics.getItemAt(i).attributes[this.catField];
                    this.setColor(this.categories[category]);
                }

                if (this.LayerLines!.graphics.getItemAt(i).attributes.velocity) {
                    this.setSpeed(this.LayerLines!.graphics.getItemAt(i).attributes.velocity * .5);
                };

                const geom = this.LayerLines!.graphics.getItemAt(i).geometry as Polyline;
                await this._addVertexes(geom.paths[0], undefined, undefined);
                this.state.segment += 1;
                //console.log('segment +1');
                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
                this._drawExistingState();
            }
        }
    }

    private _drawExistingState() {
        let existingState: Array<ExtendedScreenPoint[]> = [];

        // sort by timespan
        this.LayerLines!.graphics.sort((a, b) => new Date(a.attributes.timespan.begin).valueOf() - new Date(b.attributes.timespan.begin).valueOf());
        // cool effect commented out...
        // for(let i = this.state.segment; i < this.state.segment + 1; i++) {
        for (let i = 0; i < this.state.segment; i++) {
            const tempArray: ExtendedScreenPoint[] = [];
            const graphic = this.LayerLines!.graphics.getItemAt(i);
            const geom = graphic.geometry as Polyline;
            for (var j = 0; j < geom.paths[0].length; j++) {
                if (this.categories !== undefined && this.catField) {
                    const category = this.LayerLines!.graphics.getItemAt(i).attributes[this.catField];
                    this.setColor(this.categories[category]);
                }

                var point = this.view.toScreen(
                    new Point({ x: geom.paths[0][j][0], y: geom.paths[0][j][1] })
                ) as ExtendedScreenPoint;

                // set label based on category
                if(this.labelField) {
                    point.attribute = this.LayerLines!.graphics.getItemAt(i).attributes[this.labelField]
                };
                if(this.categories && this.catField){
                    point.vectorColor = this.categories[this.LayerLines!.graphics.getItemAt(i).attributes[this.catField]]
                };

                tempArray.push(
                    point
                );
            }
            if(typeof (tempArray[0]) === "object") {
                existingState = [tempArray]
            }
            this._draw(existingState);
        }
        // console.log(existingState)

    }

    private _draw(g: any) {

        this.ctx.beginPath();
        var g = this.simplify(g, 4, false);
        for (var i = 0; i < g.length; i++) {
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
        this.categories ? this.ctx.strokeStyle = g[0][0].vectorColor : undefined;
        // this.ctx.lineCap = 'round';
        //this.ctx.lineJoin = 'round';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'white';
        this.ctx.stroke();
        this.ctx.shadowBlur = 2;
        this.ctx.shadowColor = 'white';
        this.labelField ? this.ctx.fillText(g[0][0].attribute, g[0][0].x, g[0][0].y) : undefined;
    }

    private _addVertexes(vertexArray: any, event: any, change: any) {
        return new Promise<string>((resolve, reject) => {
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

    private calcWaypoints (vertices: Array<Point>) {

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

    private _animate(g: Array<Point>) {
        // calc waypoints traveling along vertices

        return new Promise<string>((resolve, reject) => {
            let anFrame: number;
            var lastTime = 0;
            
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
            var points = this.calcWaypoints(vertices);
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
        if(this.CustomExtent) {
            this.view.extent = this.CustomExtent;
        };
    }

    private simplify(points: any, tolerance: number, highestQuality: boolean) {

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

    private simplifyDPStep(points: any, first: number, last: number, sqTolerance: number, simplified: any) {
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

                if (maxSqDist > sqTolerance) {
                    if (index - first > 1) this.simplifyDPStep(points, first, index, sqTolerance, simplified);
                    simplified.push(points[index]);
                    if (last - index > 1) this.simplifyDPStep(points, index, last, sqTolerance, simplified);
                }
            }
        };
    }

    // simplification using Ramer-Douglas-Peucker algorithm
    private simplifyDouglasPeucker(points: any, sqTolerance: number) {
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

    private getSqDist(p1: Point, p2: Point) {
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
    private getSqSegDist(p: Point, p1: Point, p2: Point) {
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

    private simplifyRadialDist(points: any, sqTolerance: number) {
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