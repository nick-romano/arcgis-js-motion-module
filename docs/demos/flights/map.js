define(["require", "exports", "esri/Map", "esri/views/MapView", "./../../motion-module.js", "../../data/flights/TY7.js", "../../data/flights/DLH414.js", "../../data/flights/UAL925.js", "../../data/flights/UAL1140.js", "../../data/flights/UAL933.js", "../../data/flights/UAL1133.js", "../../data/flights/UAL3872.js", "../../data/flights/UAL1669.js"], function (require, exports, EsriMap, MapView, Motion, TY7, DLH414, UAL925, UAL1140, UAL933, UAL1133, UAL3872, UAL1669) {
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
        zoom: 2
    });
    view.when(function () {
        var FullData = {
            TY7: TY7.TY7,
            DLH414: DLH414.DLH414,
            UAL925: UAL925.UAL925,
            UAL1140: UAL1140.UAL1140,
            UAL933: UAL933.UAL933,
            UAL1133: UAL1133.UAL1133,
            UAL3872: UAL3872.UAL3872,
            UAL1669: UAL1669.UAL1669
        };
        var date = new Date("5-12-2018 0:00");
        console.log(FullData);
        var times = Object.keys(FullData).map(function (r, i) { return new Date(FullData[r].features[0].properties.timespan.begin); });
        console.log(FullData);
        function iterateTime() {
            // date = date.setMinutes(date.getMinutes() + 30);
            date.setSeconds(date.getSeconds() + 60);
            times.map(function (r, i) {
                //console.log(r)
                if (date > r) {
                    var blah = new Motion.MotionLayer({
                        title: "8_21",
                        source: FullData[Object.keys(FullData)[i]],
                        sourceType: "GEOJSON",
                        view: view,
                        speed: 4,
                        color: randomColor(),
                        // catField: 'Category',
                    });
                    blah.addToMap();
                    times[i] = undefined;
                }
            });
            // console.log(date);
            clockCTX.clearRect(0, 0, 10000, 10000);
            clockCTX.fillText(date.toLocaleString(), 100, 100);
            if (date > new Date("5-13-2018")) {
                clearInterval(interval);
            }
        }
        ;
        function randomColor() {
            var color = ["#ffc107", "#e91e63", "#673ab7", "#2196f3", "#4caf50", "#ffeb3b"];
            return color[Math.floor(Math.random() * 6)];
        }
        var interval = setInterval(iterateTime, 10);
        var initCanvas = document.querySelector('.esri-display-object');
        var proto = document.createElement("canvas");
        proto.id = "clock";
        proto.width = window.innerWidth;
        proto.height = window.innerHeight;
        var clockCTX = proto.getContext('2d');
        clockCTX.canvas.style.position = 'absolute';
        clockCTX.canvas.style.zIndex = '2';
        initCanvas.insertAdjacentElement('beforebegin', clockCTX.canvas);
        clockCTX.fillStyle = 'black';
        clockCTX.font = "30px Arial";
        clockCTX.fillText(date.toLocaleString(), 100, 100);
    });
});
//# sourceMappingURL=map.js.map