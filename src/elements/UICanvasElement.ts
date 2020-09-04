/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import UIElement from "./UIElement";
import UISelector from "./UISelector";

@UISelector("UICanvasElement")
class UICanvasElement extends UIElement {
    public readonly domElement!: HTMLCanvasElement;

    constructor(domElement: HTMLCanvasElement = document.createElement("canvas")) {
        super(domElement);
    }

    public get width(): number {
        return this.domElement.width;
    }

    public set width(value: number) {
        this.domElement.width = value;
    }

    public get height(): number {
        return this.domElement.height;
    }

    public set height(value: number) {
        this.domElement.height = value;
    }

    public getContext(contextId: "2d", options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D | null;
    public getContext(contextId: "bitmaprenderer", options?: ImageBitmapRenderingContextSettings): ImageBitmapRenderingContext | null;
    public getContext(contextId: "webgl", options?: WebGLContextAttributes): WebGLRenderingContext | null;
    public getContext(contextId: "webgl2", options?: WebGLContextAttributes): WebGL2RenderingContext | null;
    public getContext(contextId: string, options?: any): RenderingContext | null;
    public getContext(contextId: string, options?: any): RenderingContext | null {
        return this.domElement.getContext(contextId, options);
    }
}

export default UICanvasElement;
