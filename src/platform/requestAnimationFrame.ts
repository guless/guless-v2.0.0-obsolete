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
    let timeToCall: number = 0;
    
    return function requestAnimationFrame(callback: FrameRequestCallback): number {
        timeNow = Date.now();
        timeToCall = Math.max(timeToCall + 16, timeNow);

        return setTimeout(() => callback(timeToCall), timeToCall - timeNow) as internal;
    };
}

export default createRequestAnimationFrame();
