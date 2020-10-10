/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { SUPPORTED_ANIMATION_FRAME, SUPPORTED_WEBKIT_ANIMATION_FRAME } from "./capabilities/supported-animation-frame";

function createRequestAnimationFrame(): typeof requestAnimationFrame {
    if (SUPPORTED_ANIMATION_FRAME) {
        return requestAnimationFrame.bind(null);
    }

    if (SUPPORTED_WEBKIT_ANIMATION_FRAME) {
        return webkitRequestAnimationFrame.bind(null);
    }

    return function requestAnimationFrame(callback: FrameRequestCallback): number {
        throw new Error(`The "requestAnimationFrame()" is not implemented.`);
    };
}

export default createRequestAnimationFrame();
