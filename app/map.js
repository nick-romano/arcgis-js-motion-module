define(["require", "exports", "esri/Map", "esri/views/MapView", "./motion-module.js", "./data3.js"], function (require, exports, EsriMap, MapView, Motion, data3) {
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
        // const layer = new Motion.MotionLayer({ 
        //     title: "8_20", 
        //     source: data.data, 
        //     sourceType: "GEOJSON",
        //     view: view, 
        //     speed: 4, 
        //     color: '#ffc107',
        //     // catField: 'Category',
        // });
        // const layer2 = new Motion.MotionLayer({ 
        //     title: "8_21", 
        //     source: data2.data2, 
        //     sourceType: "GEOJSON",
        //     view: view, 
        //     speed: 4, 
        //     color: '#673ab7',
        //     // catField: 'Category',
        // });
        var layer3 = new Motion.MotionLayer({
            title: "8_19",
            source: data3.data3,
            sourceType: "GEOJSON",
            view: view,
            speed: 4,
            color: '#e91e63',
        });
    });
});
//# sourceMappingURL=map.js.map