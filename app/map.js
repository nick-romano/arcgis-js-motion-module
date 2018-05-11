define(["require", "exports", "esri/Map", "esri/views/MapView", "./motion-module.js", "./data.js"], function (require, exports, EsriMap, MapView, Motion, data) {
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
            speed: 2,
            color: '#ffc107',
        });
        // const layer2 = new Motion.MotionLayer({ 
        //     title: "8_21", 
        //     source: data2.data2, 
        //     sourceType: "GEOJSON",
        //     view: view, 
        //     speed: 2, 
        //     color: '#8BC34A'
        // });
        // const layer3 = new Motion.MotionLayer({ 
        //     title: "8_19", 
        //     source: data3.data3, 
        //     sourceType: "GEOJSON",
        //     view: view, 
        //     speed: 2, 
        //     color: '#2196f3'
        // });
        // const layer2 = new Motion.MotionLayer({ 
        //     title: "8_21", 
        //     source: data2, 
        //     sourceType: "GEOJSON",
        //     view: view, 
        //     speed: .5, 
        //     color: 'black'
        // });
        console.log(layer);
        // view.graphics.add(layer.LayerLines[1].graphic);
        console.log(view);
        // initCustomGraphics(layer);
        var start, end, change;
        // view.on("drag", function (event) {
        //     if(event.action === "start") {
        //         start = {x: event.x, y: event.y};
        //     }else if(event.action === "end") {
        //         end = { x: event.x, y: event.y };
        //         change = {x: end.x - start.x, y: end.y - start.y }
        //     }
        //     if(change) {
        //     addVertexes(layer, event, change);
        //     }
        // })
        // view.on("pointer-down", function (event) {
        // })
        // view.on("resize", function (event) {
        // })
        // view.on("immediate-click", function (event) {
        // })
        // view.on("layerview-create", function (event) {
        // })
    });
});
//# sourceMappingURL=map.js.map