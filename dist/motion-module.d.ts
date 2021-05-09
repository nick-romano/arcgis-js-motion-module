/// <reference types="arcgis-js-api" />
import GraphicsLayer = require("esri/layers/GraphicsLayer");
import Graphic = require("esri/Graphic");
import Extent = require("esri/geometry/Extent");
import MapView = require("esri/views/MapView");
export interface source {
    features: Array<object>;
}
export interface ExtendedScreenPoint extends __esri.ScreenPoint {
    attribute: string | undefined;
    vectorColor: string | undefined;
}
export interface IMotionLayer {
    source: source;
    catField: string | undefined;
    sourceType: ESourceType;
    view: MapView;
    speed: number;
    color: string;
    lineWidth: number;
    width: number;
    shadowBlur: boolean;
    labelField: string;
}
export declare enum ESourceType {
    GEOJSON = "GEOJSON"
}
declare const MotionLayer_base: __esri.LayerConstructor;
declare class MotionLayer extends MotionLayer_base {
    source: source;
    sourceType: ESourceType;
    catField: string | undefined;
    view: MapView;
    LayerLines: GraphicsLayer | undefined;
    LayerPoints: Graphic[] | undefined;
    mapView: MapView;
    ctx: CanvasRenderingContext2D;
    CustomExtent: Extent | undefined;
    categories: {
        [item: string]: string;
    } | undefined;
    speed: number;
    color: string;
    lineWidth: number;
    state: {
        segment: number;
        vertex: number;
    };
    labelField: string;
    shadowBlur: boolean;
    anFrame: number;
    constructor(args: IMotionLayer);
    createLayerLines(): GraphicsLayer | undefined;
    get features(): object;
    createLayerPoints(): any[] | undefined;
    createCategories(): {
        [item: string]: string;
    } | undefined;
    private _initView;
    private _initListeners;
    private _calcPixelRatio;
    private _createCTX;
    private _recordChange;
    private _createHiDPICanvas;
    private _initCustomGraphics;
    private _paint;
    private loopSegments;
    private _drawExistingState;
    private _draw;
    private _addVertexes;
    private calcWaypoints;
    private _animate;
    private randomColor;
    setSpeed(speed: number): void;
    getSpeed(): number;
    setColor(color: any): void;
    getColor(): string;
    addToMap(): void;
    zoomTo(): void;
    private simplify;
    private simplifyDPStep;
    private simplifyDouglasPeucker;
    private getSqDist;
    private getSqSegDist;
    private simplifyRadialDist;
}
export { MotionLayer };
//# sourceMappingURL=motion-module.d.ts.map