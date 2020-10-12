/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import { SUPPORTED_ANIMATION_FRAME, SUPPORTED_WEBKIT_ANIMATION_FRAME } from "./capabilities/supported-animation-frame";

function createRequestAnimationFrame(): typeof requestAnimationFrame {
    if (SUPPORTED_ANIMATION_FRAME) {
        return requestAnimationFrame.bind(null);
    }

    if (SUPPORTED_WEBKIT_ANIMATION_FRAME) {
        return webkitRequestAnimationFrame.bind(null);
    }

    let timeNow: number;
    let timeCall: number = 0;
    
    return function requestAnimationFrame(callback: FrameRequestCallback): number {
        timeNow = Date.now();
        timeCall = Math.max(timeCall + 16, timeNow);

        return setTimeout(() => callback(timeCall), timeCall - timeNow) as internal;
    };
}

export default createRequestAnimationFrame();
