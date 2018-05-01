var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
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
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
define(["require", "exports", "esri/layers/Layer", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol", "esri/Graphic", "esri/geometry", "esri/core/accessorSupport/decorators"], function (require, exports, Layer, SimpleLineSymbol, SimpleMarkerSymbol, Graphic, geometry_1, decorators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MotionLayer = /** @class */ (function (_super) {
        __extends(MotionLayer, _super);
        function MotionLayer(args) {
            var _this = _super.call(this) || this;
            _this.LayerLines = args["source"];
            _this.LayerPoints = args["source"];
            //start initializing layer
            _this._initView(args.view);
            return _this;
        }
        Object.defineProperty(MotionLayer.prototype, "LayerLines", {
            get: function () {
                return this._LayerLines;
            },
            set: function (value) {
                try {
                    var lineSymbol_1 = new SimpleLineSymbol({
                        color: [255, 255, 255],
                        width: 4
                    });
                    var geom = value["data"].features.map(function (r) { return r.geometry; });
                    geom.paths = geom.map(function (r) {
                        var a = r.coordinates.map(function (a) { return a; });
                        return a;
                    });
                    var LineFeatures = geom.filter(function (r) { return r.type === "LineString" ? r : null; });
                    LineFeatures.map(function (r) {
                        r.geometry = new geometry_1.Polyline();
                        r.type = "polyline";
                        r.attributes = { a: "b" };
                        r.geometry.paths[0] = [];
                        r.coordinates.map(function (t) { return r.geometry.paths[0].push([t[0], t[1]]); });
                        r.symbol = lineSymbol_1;
                        r.graphic = new Graphic({ geometry: r.geometry, attributes: r.attributes, symbol: r.symbol });
                    });
                    this._LayerLines = LineFeatures;
                }
                catch (e) {
                    console.error(e);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionLayer.prototype, "features", {
            get: function () {
                var geom = this.source["data"].features.map(function (r) { return r.geometry; });
                geom.paths = geom.map(function (r) {
                    var a = r.coordinates.map(function (a) { return a; });
                    return a;
                });
                return geom;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionLayer.prototype, "LayerPoints", {
            get: function () {
                return this._LayerPoints;
            },
            set: function (value) {
                var geom = value["data"].features.map(function (r) { return r.geometry; });
                var PointFeatures = geom.filter(function (r) { return r.type === "Point" ? r : null; });
                var MarkerSymbol = new SimpleMarkerSymbol({
                    color: "black",
                    size: 16,
                });
                PointFeatures.Points = new Array;
                PointFeatures.map(function (r) {
                    r.geometry = new geometry_1.Point(r.coordinates),
                        r.type = "Point",
                        // ! set up polyfill for attributes
                        r.attributes = { 'blah': 'blah' },
                        r.symbol = MarkerSymbol,
                        r.graphic = new Graphic({ geometry: r.geometry, attributes: r.attributes, symbol: r.symbol });
                });
                this._LayerPoints = PointFeatures;
            },
            enumerable: true,
            configurable: true
        });
        MotionLayer.prototype._initView = function (view) {
            try {
                this.mapView = view;
                this._initCustomGraphics(this);
                this._initListeners();
            }
            catch (error) {
                console.error(error);
            }
        };
        MotionLayer.prototype._initListeners = function () {
        };
        MotionLayer.prototype._initCustomGraphics = function (layer) {
            var initCanvas = document.querySelector('.esri-display-object');
            var proto = document.createElement("canvas");
            proto.id = "motionLayer";
            var rootDiv = document.querySelector('g');
            this.ctx = proto.getContext("2d");
            this.ctx.canvas.style.position = 'absolute';
            this.ctx.canvas.style.zIndex = '0';
            initCanvas.insertAdjacentElement('beforebegin', this.ctx.canvas);
            this.ctx.canvas.width = initCanvas.width;
            this.ctx.canvas.height = initCanvas.height;
            // bouncingBall(layer);
            // vertexes for line segment
            function asyncFunc() {
                return __awaiter(this, void 0, void 0, function () {
                    var i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < layer.LayerLines.length)) return [3 /*break*/, 4];
                                return [4 /*yield*/, this._addVertexes(layer.LayerLines[i].graphic.geometry.paths[0], undefined, undefined)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            var loopSegments = asyncFunc.bind(this);
            loopSegments().then(function (r) { console.log(r); });
        };
        MotionLayer.prototype._addVertexes = function (vertexArray, event, change) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                console.log(vertexArray);
                var g = vertexArray.map(function (r) {
                    return _this.mapView.toScreen(new geometry_1.Point(r));
                });
                var length = 0;
                for (var i = 0; i < g.length; i++) {
                    if (i < g.length - 1) {
                        var distance = Math.sqrt(Math.pow(g[i + 1].x - g[i].x, 2) + Math.pow(g[i + 1].y - g[i].y, 2));
                        length += distance;
                    }
                }
                ;
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
                _this._animate(g).then(function (r) { return resolve(r); });
            });
        };
        MotionLayer.prototype._animate = function (g) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var anFrame;
                var lastTime = 0;
                var vendors = ['ms', 'moz', 'webkit', 'o'];
                for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
                }
                if (!window.requestAnimationFrame)
                    window.requestAnimationFrame = function (callback, element) {
                        var currTime = new Date().getTime();
                        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                        var id = window.setTimeout(function () {
                            callback(currTime + timeToCall);
                        }, timeToCall);
                        lastTime = currTime + timeToCall;
                        return id;
                    };
                if (!window.cancelAnimationFrame)
                    window.cancelAnimationFrame = function (id) {
                        clearTimeout(id);
                    };
                // window.cancelAnimationFrame();
                // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                _this.ctx.lineCap = "round";
                _this.ctx.fillStyle = 'red';
                // variable to hold how many frames have elapsed in the animation
                var t = 1;
                // define the path to plot
                var vertices = g.map(function (r) {
                    return {
                        x: r.x,
                        y: r.y
                    };
                });
                // set some style
                _this.ctx.lineWidth = 2;
                _this.ctx.strokeStyle = 'red';
                // calculate incremental points along the path
                var points = calcWaypoints(vertices);
                // extend the line from start to finish with animation
                var removeAnim = _this.mapView.on('drag', removeAnimation);
                var iter = 0;
                function removeAnimation(event) {
                    console.log(iter);
                    iter += 1;
                    cancelAnimationFrame(anFrame);
                    console.log(event);
                    if (event.action === "end") {
                        removeAnim.remove();
                    }
                }
                // calc waypoints traveling along vertices
                function calcWaypoints(vertices) {
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
                var animate = function () {
                    if (t < points.length - 1) {
                        animate = animate.bind(_this);
                        anFrame = requestAnimationFrame(animate);
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
                    t++;
                };
                animate.bind(_this);
                animate();
            });
        };
        __decorate([
            decorators_1.property()
        ], MotionLayer.prototype, "source", void 0);
        __decorate([
            decorators_1.property()
        ], MotionLayer.prototype, "_LayerLines", void 0);
        MotionLayer = __decorate([
            decorators_1.subclass("esri/layers/MotionLayer")
        ], MotionLayer);
        return MotionLayer;
    }(decorators_1.declared(Layer)));
    exports.MotionLayer = MotionLayer;
});
//# sourceMappingURL=motion-module.js.map