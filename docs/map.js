define(["require", "exports", "esri/Map", "esri/views/MapView", "./motion-module.js", "./data/data.js", "./data/data2.js", "./data/data3.js"], function (require, exports, EsriMap, MapView, Motion, data, data2, data3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new EsriMap({
        basemap: "gray-vector"
    });
    window.map = map;
    var view = new MapView({
        map: map,
        container: "viewDiv",
        center: [-76.93, 38.9897],
        zoom: 9
    });
    view.when(function () {
        console.log('here');
        var layer = new Motion.MotionLayer({
            title: "8_20",
            source: data.data,
            sourceType: "GEOJSON",
            view: view,
            speed: 4,
            color: '#ffc107',
            labelField: "Category",
            shadowBlur: true,
            // catField: 'Category',
        });
        layer.addToMap();
        var layer2 = new Motion.MotionLayer({
            title: "8_21",
            source: data2.data2,
            sourceType: "GEOJSON",
            view: view,
            speed: 4,
            color: '#8BC34A',
            labelField: "Category",
            shadowBlur: true,
            // catField: 'Category',
        });
        layer2.addToMap();
        var layer3 = new Motion.MotionLayer({
            title: "8_19",
            source: data3.data3,
            sourceType: "GEOJSON",
            view: view,
            speed: 4,
            color: '#2196f3',
            labelField: "Category",
            shadowBlur: true,
            // catField: 'Category',
        });
        layer3.addToMap();
        layer3.zoomTo();
    });
});
//# sourceMappingURL=map.js.map