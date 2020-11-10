/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function createWebGLContext(element: HTMLCanvasElement, attributes?: WebGLContextAttributes): null | { version: number, context: WebGLRenderingContext | WebGL2RenderingContext } {
    let version: number = 2;
    let context: null | WebGLRenderingContext | WebGL2RenderingContext = element.getContext("webgl2", attributes);

    if (context === null) {
        version = 1;
        context = element.getContext("webgl", attributes) || element.getContext("experimental-webgl", attributes) as WebGLRenderingContext;
    }

    return context === null ? null : { version, context };
}

export default createWebGLContext;
