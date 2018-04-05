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
    _LayerPoints: object;


    get features(): object {
        var geom = this.source.data.features.map(r => r.geometry);
        geom.paths = geom.map(r => {
            var a = r.coordinates.map(a => a)
            return a
        });
        return geom
    }

    get LayerPoints(): object {
        var PointFeatures = this.features.filter(r => r.type === "Point" ? r : null);
        PointFeatures.Points = new Array;
        PointFeatures.map(r => r.geometry = new Point(r.coordinates));
        return PointFeatures
    }

    get LayerLines(): object {
        const lineSymbol = new SimpleLineSymbol({
            color: [226, 119, 40],  // RGB color values as an array
            width: 4
          });

          var geom = this.source.data.features.map(r => r.geometry);
          geom.paths = geom.map(r => {
              var a = r.coordinates.map(a => a)
              return a
          });

        var LineFeatures = geom.filter(r => r.type === "LineString" ? r : null);
        LineFeatures.map(r => {
            r.geometry = new Polyline();
            r.type = "polyline";
            r.attributes = {a: "b"}
            r.coordinates.map(t => r.geometry.paths.push([t[0], t[1]]));
            r.symbol = lineSymbol;
            r.graphic = new Graphic({geometry: r.geometry, attributes: r.attributes, symbol: r.symbol});
        });


        return LineFeatures
    }
}

export { MotionLayer }