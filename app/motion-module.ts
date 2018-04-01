import EsriMap = require("esri/Map");
import Layer = require("esri/layers/Layer");
import { Point, Polygon, Polyline } from "esri/geometry";
import { subclass, property, declared } from "esri/core/accessorSupport/decorators";

@subclass("esri/layers/MotionLayer")
class MotionLayer extends declared(Layer) {
    @property()
    source: object;


    get features(): object {
        this.source.data.features.map(r => r.type = "dd");
        this.source.geometry.
        return this.source
    }

}

export {MotionLayer}