/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import fault from "../fault";
import { SUPPORTED_ANIMATION_FRAME, SUPPORTED_WEBKIT_ANIMATION_FRAME } from "./capabilities/supported-animation-frame";

function createCancelAnimationFrame(): typeof cancelAnimationFrame {
    if (SUPPORTED_ANIMATION_FRAME) {
        return cancelAnimationFrame.bind(null);
    }

    if (SUPPORTED_WEBKIT_ANIMATION_FRAME) {
        return webkitCancelAnimationFrame.bind(null);
    }

    return function cancelAnimationFrame(handle: number): void {
        fault(`The "cancelAnimationFrame()" is not implemented.`);
    };
}

export default createCancelAnimationFrame();
