define(["require", "exports", "esri/Map", "esri/views/MapView", "./motion-module.js", "./data.js"], function (require, exports, EsriMap, MapView, Motion, data) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.log(data);
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
        var layer = new Motion.MotionLayer({ title: "My Day", source: data });
        console.log(layer);
    });
});
//# sourceMappingURL=map.js.map