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
define(["require", "exports", "esri/layers/Layer", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol", "esri/Graphic", "esri/geometry", "esri/core/accessorSupport/decorators"], function (require, exports, Layer, SimpleLineSymbol, SimpleMarkerSymbol, Graphic, geometry_1, decorators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MotionLayer = /** @class */ (function (_super) {
        __extends(MotionLayer, _super);
        function MotionLayer(args) {
            var _this = _super.call(this) || this;
            _this.LayerLines = args["source"];
            _this.LayerPoints = args["source"];
            return _this;
        }
        Object.defineProperty(MotionLayer.prototype, "LayerLines", {
            get: function () {
                return this._LayerLines;
            },
            set: function (value) {
                try {
                    var lineSymbol_1 = new SimpleLineSymbol({
                        color: [226, 119, 40],
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