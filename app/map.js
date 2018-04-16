define(["require", "exports", "esri/Map", "esri/views/MapView", "./motion-module.js", "./data.js"], function (require, exports, EsriMap, MapView, Motion, data) {
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
    var customCanvas = function (r) {
        setTimeout(function () {
            console.log(r);
            var canvas = document.querySelector('canvas');
            if (canvas.getContext) {
                var ctx = canvas.getContext('2d');
                for (var i = 0; i < 20; i++) {
                    for (var j = 0; j < 20; j++) {
                        ctx.fillStyle = 'rgb(' + Math.floor(255 - 42.5 * i) + ', ' +
                            Math.floor(255 - 42.5 * j) + ', 0)';
                        ctx.fillRect(j * 25, i * 25, 25, 25);
                        ctx.globalAlpha = 0.2;
                    }
                }
            }
        }, 400);
    };
    view.when(function () {
        console.log('here');
        var layer = new Motion.MotionLayer({ title: "My Day", source: data });
        view.graphics.add(layer.LayerLines[0].graphic);
        customCanvas();
    });
    view.on("drag", function (r) {
        customCanvas(r);
    });
});
//# sourceMappingURL=map.js.map