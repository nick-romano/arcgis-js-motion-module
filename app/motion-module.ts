import Layer = require("esri/layers/Layer");
import { Point, Polygon, Polyline } from "esri/geometry";
import { subclass, property, declared } from "esri/core/accessorSupport/decorators";

@subclass("esri/layers/MotionLayer")
class MotionLayer extends declared(Layer) {
    @property()
    source: object;


    get features(): object {
        var geom = this.source.data.features.map(r => r.geometry);
        geom.paths = geom.map(r => {
            var a = r.coordinates.map(a => a)
            return a
        });
        return geom
    }

}

export { MotionLayer }