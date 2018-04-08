import Layer = require("esri/layers/Layer");
import LayerView = require("esri/views/layers/LayerView");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
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
    

    constructor(args: object){
        super()
        this.LayerLines = args["source"];
        this.LayerPoints = args["source"];
    }

    get LayerLines(): object {
        return this._LayerLines
    }

    set LayerLines(value:object) {
        const lineSymbol = new SimpleLineSymbol({
            color: [226, 119, 40],  // RGB color values as an array
            width: 4
        });

        var geom = value["data"].features.map((r:any) => r.geometry);
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
    }

    get features(): object {
        var geom = this.source["data"].features.map(r => r.geometry);
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
        var geom = value["data"].features.map((r:any) => r.geometry);

        var PointFeatures = geom.filter((r:any) => r.type === "Point" ? r: null);
        PointFeatures.Points = new Array;
        PointFeatures.map((r: any) => r.geometry = new Point(r.coordinates));

        this._LayerPoints = PointFeatures;
    }
}

export { MotionLayer }