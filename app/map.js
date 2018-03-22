define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"], function (require, exports, EsriMap, MapView, FeatureLayer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new EsriMap({
        basemap: "topo"
    });
    var view = new MapView({
        map: map,
        container: "viewDiv",
        center: [-76.93, 38.9897],
        zoom: 12
    });
    view.when(function () {
        var layer = new FeatureLayer({ url: "http://maps.umd.edu/arcgis/rest/services/Layers/Transportation/MapServer/4" });
    });
});
//# sourceMappingURL=map.js.map