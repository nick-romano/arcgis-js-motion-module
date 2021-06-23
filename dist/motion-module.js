var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "esri/layers/Layer", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/geometry/Extent", "esri/geometry", "esri/core/accessorSupport/decorators"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MotionLayer = exports.ESourceType = void 0;
    var Layer = require("esri/layers/Layer");
    var SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
    var SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
    var GraphicsLayer = require("esri/layers/GraphicsLayer");
    var Graphic = require("esri/Graphic");
    var Extent = require("esri/geometry/Extent");
    var geometry_1 = require("esri/geometry");
    var decorators_1 = require("esri/core/accessorSupport/decorators");
    var ESourceType;
    (function (ESourceType) {
        ESourceType["GEOJSON"] = "GEOJSON";
    })(ESourceType = exports.ESourceType || (exports.ESourceType = {}));
    var geoJSONFeature = /** @class */ (function () {
        function geoJSONFeature() {
        }
        __decorate([
            decorators_1.property()
        ], geoJSONFeature.prototype, "geometry", void 0);
        return geoJSONFeature;
    }());
    var MotionLayer = /** @class */ (function (_super) {
        __extends(MotionLayer, _super);
        function MotionLayer(args) {
            var _this = _super.call(this) || this;
            _this.colorPalette = ["#8A4850", "#89516A"]; // "#7C6082", "#647091", "#447F95", "#2C8C8D", "#36967B", "#589C63", "#809F4E", "#A99E42", "#D29A48", "#F49361"];
            _this.source = args["source"];
            _this.catField = args["catField"] ? args["catField"] : undefined;
            _this.view = args["view"];
            _this.mapView = _this.view;
            _this.speed = args["speed"] ? args["speed"] : 1;
            _this.color = args["color"] ? args["color"] : 'black';
            _this.sourceType = args["sourceType"];
            _this.LayerLines = _this.createLayerLines();
            _this.LayerPoints = _this.createLayerPoints();
            _this.categories = _this.createCategories();
            _this.state = { segment: 0, vertex: 0 };
            _this.lineWidth = args["width"] ? args["width"] : 2;
            _this.shadowBlur = args["shadowBlur"] ? args["shadowBlur"] : false;
            _this.labelField = args["labelField"];
            _this.ctx = _this._createCTX();
            _this.anFrame = 0;
            return _this;
            // //for dev
            // window.layer = this;
            // window.view = args["view"];
        }
        MotionLayer.prototype.createLayerLines = function () {
            if (this.sourceType === ESourceType.GEOJSON) {
                var lineSymbol_1 = new SimpleLineSymbol({
                    color: [255, 255, 255],
                    width: 4
                });
                var geom = this.source.features.map(function (r) {
                    var obj = {
                        geometry: r.geometry,
                        properties: r.properties
                    };
                    return obj;
                });
                var LineFeatures = geom.filter(function (r) { return r.geometry.type === "LineString" ? r : null; });
                LineFeatures = LineFeatures.map(function (r) {
                    var graphic = new Graphic;
                    // graphic.geometry = new Polyline();
                    graphic.attributes = r.properties;
                    // to update with param field
                    var timeDiff = (new Date(r.properties["timespan"].end).valueOf() - new Date(r.properties["timespan"].begin).valueOf()) * .001;
                    graphic.attributes.timeDiff = timeDiff;
                    graphic.attributes.velocity = (r.properties.Distance * 1) / timeDiff;
                    var pline = new geometry_1.Polyline();
                    pline.paths[0] = [];
                    var arr = [];
                    r.geometry.coordinates.forEach(function (t) { return arr.push([t[0], t[1]]); });
                    pline.paths[0] = arr;
                    graphic.geometry = pline;
                    graphic.symbol = lineSymbol_1;
                    return graphic;
                });
                var _LayerLines = new GraphicsLayer({
                    graphics: LineFeatures.map(function (r) { return r.clone(); })
                });
                var len = _LayerLines.graphics.length;
                // set extent for map; 
                _LayerLines.graphics.sort(function (a, b) { return a.geometry.extent.xmax - b.geometry.extent.xmax; });
                var xmax = _LayerLines.graphics.getItemAt(0).geometry.extent.xmax * .992;
                _LayerLines.graphics.sort(function (a, b) { return a.geometry.extent.xmin - b.geometry.extent.xmin; });
                var xmin = _LayerLines.graphics.getItemAt(len - 1).geometry.extent.xmin * 1.002;
                _LayerLines.graphics.sort(function (a, b) { return a.geometry.extent.ymax - b.geometry.extent.ymax; });
                var ymax = _LayerLines.graphics.getItemAt(0).geometry.extent.ymax * .998;
                _LayerLines.graphics.sort(function (a, b) { return a.geometry.extent.ymin - b.geometry.extent.ymin; });
                var ymin = _LayerLines.graphics.getItemAt(len - 1).geometry.extent.ymin * 1.002;
                this.CustomExtent = new Extent({ xmax: xmax, xmin: xmin, ymax: ymax, ymin: ymin });
                /// this._LayerLines.fullExtent.width = 100000;
                return _LayerLines;
            }
        };
        Object.defineProperty(MotionLayer.prototype, "features", {
            get: function () {
                var geom = this.source.features.map(function (r) {
                    var obj = new geoJSONFeature();
                    obj.geometry = r.geometry;
                    obj.properties = r.properties;
                    return obj;
                });
                return geom;
            },
            enumerable: false,
            configurable: true
        });
        MotionLayer.prototype.createLayerPoints = function () {
            if (this.sourceType === ESourceType.GEOJSON) {
                var geom = this.source.features.map(function (r) { return r.geometry; });
                var PointFeatures = geom.filter(function (r) { return r.type === "Point" ? r : null; });
                var MarkerSymbol_1 = new SimpleMarkerSymbol({
                    color: "black",
                    size: 16,
                });
                PointFeatures.forEach(function (r) {
                    r.geometry = new geometry_1.Point(r.coordinates),
                        r.type = "Point",
                        // ! set up polyfill for attributes
                        r.attributes = {},
                        r.symbol = MarkerSymbol_1,
                        r.graphic = new Graphic({ geometry: r.geometry, attributes: r.attributes, symbol: r.symbol });
                });
                return PointFeatures;
            }
        };
        MotionLayer.prototype.createCategories = function () {
            var _this = this;
            var categories = {};
            if (this.catField) {
                var allValues = this.LayerLines.graphics.map(function (r) { return r.attributes[_this.catField]; });
                // console.log(allValues)
                var catFields = allValues.filter(function (v, i, a) { return a.indexOf(v) === i; });
                var catColorArray_1 = {};
                var uniqueColorsAssigned_1 = [];
                var getColor_1 = function (tries) {
                    if (tries === void 0) { tries = 0; }
                    var color = _this.randomColor();
                    if (uniqueColorsAssigned_1.indexOf(color) === -1) {
                        uniqueColorsAssigned_1.push(color);
                        return color;
                    }
                    else {
                        if (tries < _this.colorPalette.length) {
                            // will try to get unique colors;
                            return getColor_1(tries + 1);
                        }
                        else {
                            // but if theres too many colors needed, we re-use existing colors;
                            console.log('reusing');
                            return _this.randomColor();
                        }
                    }
                };
                catFields.forEach(function (r) {
                    // const FinalColor = getColor();
                    catColorArray_1[r] = getColor_1();
                });
                if (this.catField !== undefined) {
                    return catColorArray_1;
                }
                else {
                    return undefined;
                }
            }
        };
        MotionLayer.prototype._initView = function (view) {
            try {
                this._initCustomGraphics(this);
                this._initListeners();
            }
            catch (error) {
                console.error(error);
            }
        };
        MotionLayer.prototype._initListeners = function () {
            var _this = this;
            this.view.watch('rotation', function (e) {
                _this._recordChange(e);
            });
            this.view.watch('zoom', function (e) {
                _this._recordChange(e);
            });
            this.view.watch('extent', function (e) {
                _this._recordChange(e);
            });
        };
        MotionLayer.prototype._calcPixelRatio = function () {
            var PIXEL_RATIO = (function () {
                var ctx = document.createElement("canvas").getContext("2d"), dpr = window.devicePixelRatio || 1, bsr = 1;
                return dpr / bsr;
            })();
            return PIXEL_RATIO;
        };
        MotionLayer.prototype._createCTX = function () {
            var PIXEL_RATIO = this._calcPixelRatio();
            var proto = this._createHiDPICanvas(screen.width, screen.height, PIXEL_RATIO);
            proto.id = this.title;
            var rootDiv = document.querySelector('g');
            var ctx = proto.getContext("2d");
            return ctx;
        };
        MotionLayer.prototype._recordChange = function (e) {
            cancelAnimationFrame(this.anFrame);
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this._paint();
        };
        MotionLayer.prototype._createHiDPICanvas = function (w, h, ratio) {
            var PIXEL_RATIO = this._calcPixelRatio();
            if (!ratio) {
                ratio = PIXEL_RATIO;
            }
            var can = document.createElement("canvas");
            can.width = w * ratio;
            can.height = h * ratio;
            can.style.width = w + "px";
            can.style.height = h + "px";
            can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
            return can;
        };
        ;
        MotionLayer.prototype._initCustomGraphics = function (layer) {
            var view = this.mapView;
            var initCanvas = view.surface;
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
        };
        MotionLayer.prototype._paint = function () {
            this._drawExistingState();
            this.LayerLines.graphics.sort(function (a, b) { return new Date(a.attributes.timespan.begin).valueOf() - new Date(b.attributes.timespan.begin).valueOf(); });
            this.loopSegments();
        };
        MotionLayer.prototype.loopSegments = function () {
            return __awaiter(this, void 0, void 0, function () {
                var i, graphic, category, geom, color, category;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < this.LayerLines.graphics.length)) return [3 /*break*/, 4];
                            if (!(i > this.state.segment - 1)) return [3 /*break*/, 3];
                            graphic = this.LayerLines.graphics.getItemAt(i);
                            if (this.categories !== undefined && this.catField) {
                                category = graphic.attributes[this.catField];
                                this.setColor(this.categories[category]);
                            }
                            if (graphic.attributes.velocity) {
                                // this.setSpeed(this.LayerLines!.graphics.getItemAt(i).attributes.velocity * .5);
                            }
                            ;
                            geom = graphic.geometry;
                            color = this.color;
                            if (this.catField) {
                                category = graphic.attributes[this.catField];
                                color = category ? this.categories[category] : this.color;
                            }
                            return [4 /*yield*/, this._addVertexes(geom.paths[0], graphic, undefined, color)];
                        case 2:
                            _a.sent();
                            this.state.segment += 1;
                            //console.log('segment +1');
                            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                            this._drawExistingState();
                            _a.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        MotionLayer.prototype._drawExistingState = function () {
            var existingState = [];
            // sort by timespan
            this.LayerLines.graphics.sort(function (a, b) { return new Date(a.attributes.timespan.begin).valueOf() - new Date(b.attributes.timespan.begin).valueOf(); });
            // cool effect commented out...
            // for(let i = this.state.segment; i < this.state.segment + 1; i++) {
            for (var i = 0; i < this.state.segment; i++) {
                var tempArray = [];
                var graphic = this.LayerLines.graphics.getItemAt(i);
                var geom = graphic.geometry;
                for (var j = 0; j < geom.paths[0].length; j++) {
                    if (this.categories !== undefined && this.catField) {
                        var category = this.LayerLines.graphics.getItemAt(i).attributes[this.catField];
                        this.setColor(this.categories[category]);
                    }
                    var point = this.view.toScreen(new geometry_1.Point({ x: geom.paths[0][j][0], y: geom.paths[0][j][1] }));
                    // set label based on category
                    if (this.labelField) {
                        point.attribute = this.LayerLines.graphics.getItemAt(i).attributes[this.labelField];
                    }
                    ;
                    if (this.categories && this.catField) {
                        point.vectorColor = this.categories[this.LayerLines.graphics.getItemAt(i).attributes[this.catField]];
                    }
                    ;
                    tempArray.push(point);
                }
                if (typeof (tempArray[0]) === "object") {
                    existingState = [tempArray];
                }
                this._draw(existingState);
            }
            // console.log(existingState)
        };
        MotionLayer.prototype._draw = function (g) {
            this.ctx.beginPath();
            var g = this.simplify(g, 4, false);
            for (var i = 0; i < g.length; i++) {
                this.ctx.moveTo(g[i][0].x, g[i][0].y);
                for (var j = 0; j < g[i].length; j++) {
                    this.ctx.lineTo(g[i][j].x, g[i][j].y);
                }
            }
            this.categories ? this.ctx.strokeStyle = g[0][0].vectorColor : undefined;
            // this.ctx.lineCap = 'round';
            //this.ctx.lineJoin = 'round';
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = 'white';
            this.ctx.stroke();
            this.ctx.shadowBlur = 2;
            this.ctx.shadowColor = 'white';
            this.labelField && this.ctx.fillText(g[0][0].attribute, g[0][0].x, g[0][0].y);
        };
        MotionLayer.prototype._addVertexes = function (vertexArray, graphic, change, color) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var g = vertexArray.map(function (r) {
                    return _this.mapView.toScreen(new geometry_1.Point(r));
                });
                _this.labelField && _this.ctx.fillText(graphic.attributes[_this.labelField], g[0].x, g[0].y);
                var length = 0;
                for (var i = 0; i < g.length; i++) {
                    if (i < g.length - 1) {
                        var distance = Math.sqrt(Math.pow(g[i + 1].x - g[i].x, 2) + Math.pow(g[i + 1].y - g[i].y, 2));
                        length += distance;
                    }
                }
                ;
                _this._animate(g, color).then(function (r) { return resolve(r); });
            });
        };
        MotionLayer.prototype.calcWaypoints = function (vertices) {
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
        ;
        MotionLayer.prototype._animate = function (g, color) {
            // calc waypoints traveling along vertices
            var _this = this;
            return new Promise(function (resolve, reject) {
                var anFrame;
                var lastTime = 0;
                if (!window.cancelAnimationFrame)
                    window.cancelAnimationFrame = function (id) {
                        clearTimeout(id);
                    };
                // variable to hold how many frames have elapsed in the animation
                var t = 1;
                // t = 1;
                // define the path to plot
                var vertices = g.map(function (r) {
                    return new geometry_1.Point({
                        x: r.x,
                        y: r.y
                    });
                });
                // set some style
                _this.ctx.lineWidth = _this.lineWidth;
                _this.ctx.strokeStyle = color;
                // calculate incremental points along the path
                var points = _this.calcWaypoints(vertices);
                // extend the line from start to finish with animation
                // this.labelField && this.ctx.fillText(g[0][0].attribute, g[0][0].x, g[0][0].y);
                var animate = function () {
                    if (t < points.length - 1) {
                        // this.ctx.strokeStyle = this.randomColor();
                        animate = animate.bind(_this);
                        _this.anFrame = requestAnimationFrame(animate);
                    }
                    else {
                        resolve('done');
                    }
                    // draw a line segment from the last waypoint
                    // to the current waypoint
                    _this.ctx.beginPath();
                    _this.ctx.moveTo(points[t - 1].x, points[t - 1].y);
                    _this.ctx.lineTo(points[t].x, points[t].y);
                    _this.ctx.stroke();
                    // increment "t" to get the next waypoint
                    t += 1;
                };
                animate.bind(_this);
                animate();
            });
        };
        MotionLayer.prototype.randomColor = function () {
            var color = this.colorPalette;
            console.log(Math.floor(Math.random() * color.length));
            return color[Math.floor(Math.random() * color.length)];
        };
        MotionLayer.prototype.setSpeed = function (speed) {
            this.speed = speed;
        };
        MotionLayer.prototype.getSpeed = function () {
            return this.speed;
        };
        MotionLayer.prototype.setColor = function (color) {
            if (color === "random") {
                this.color = color;
            }
            else {
                this.color = this.randomColor();
            }
        };
        MotionLayer.prototype.getColor = function () {
            return this.color;
        };
        MotionLayer.prototype.addToMap = function () {
            // start initializing layer
            this._initView(this.view);
        };
        MotionLayer.prototype.zoomTo = function () {
            if (this.CustomExtent) {
                this.view.extent = this.CustomExtent;
            }
            ;
        };
        MotionLayer.prototype.simplify = function (points, tolerance, highestQuality) {
            /*
            (c) 2017, Vladimir Agafonkin
            Simplify.js, a high-performance JS polyline simplification library
            mourner.github.io/simplify-js
            */
            if (points.length <= 2)
                return points;
            var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;
            points = highestQuality ? points : this.simplifyRadialDist(points, sqTolerance);
            points = this.simplifyDouglasPeucker(points, sqTolerance);
            return points;
        };
        MotionLayer.prototype.simplifyDPStep = function (points, first, last, sqTolerance, simplified) {
            /*
            (c) 2017, Vladimir Agafonkin
            Simplify.js, a high-performance JS polyline simplification library
            mourner.github.io/simplify-js
            */
            var maxSqDist = sqTolerance, index;
            for (var i = first + 1; i < last; i++) {
                var sqDist = this.getSqSegDist(points[i], points[first], points[last]);
                if (sqDist > maxSqDist) {
                    index = i;
                    maxSqDist = sqDist;
                    if (maxSqDist > sqTolerance) {
                        if (index - first > 1)
                            this.simplifyDPStep(points, first, index, sqTolerance, simplified);
                        simplified.push(points[index]);
                        if (last - index > 1)
                            this.simplifyDPStep(points, index, last, sqTolerance, simplified);
                    }
                }
            }
            ;
        };
        // simplification using Ramer-Douglas-Peucker algorithm
        MotionLayer.prototype.simplifyDouglasPeucker = function (points, sqTolerance) {
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
        };
        MotionLayer.prototype.getSqDist = function (p1, p2) {
            /*
            (c) 2017, Vladimir Agafonkin
            Simplify.js, a high-performance JS polyline simplification library
            mourner.github.io/simplify-js
            */
            var dx = p1.x - p2.x, dy = p1.y - p2.y;
            return dx * dx + dy * dy;
        };
        // square distance from a point to a segment
        MotionLayer.prototype.getSqSegDist = function (p, p1, p2) {
            /*
            (c) 2017, Vladimir Agafonkin
            Simplify.js, a high-performance JS polyline simplification library
            mourner.github.io/simplify-js
            */
            var x = p1.x, y = p1.y, dx = p2.x - x, dy = p2.y - y;
            if (dx !== 0 || dy !== 0) {
                var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
                if (t > 1) {
                    x = p2.x;
                    y = p2.y;
                }
                else if (t > 0) {
                    x += dx * t;
                    y += dy * t;
                }
            }
            dx = p.x - x;
            dy = p.y - y;
            return dx * dx + dy * dy;
        };
        MotionLayer.prototype.simplifyRadialDist = function (points, sqTolerance) {
            /*
            (c) 2017, Vladimir Agafonkin
            Simplify.js, a high-performance JS polyline simplification library
            mourner.github.io/simplify-js
            */
            var prevPoint = points[0], newPoints = [prevPoint], point;
            for (var i = 1, len = points.length; i < len; i++) {
                point = points[i];
                if (this.getSqDist(point, prevPoint) > sqTolerance) {
                    newPoints.push(point);
                    prevPoint = point;
                }
            }
            if (prevPoint !== point)
                newPoints.push(point);
            return newPoints;
        };
        __decorate([
            decorators_1.property()
        ], MotionLayer.prototype, "source", void 0);
        MotionLayer = __decorate([
            decorators_1.subclass("esri/layers/MotionLayer")
        ], MotionLayer);
        return MotionLayer;
    }(decorators_1.declared(Layer)));
    exports.MotionLayer = MotionLayer;
});
