/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import assert from "../assert";
import { SUPPORTED_ANIMATION_FRAME, SUPPORTED_WEBKIt_ANIMATION_FRAME } from "./capabilities";

function createRequestAnimationFrame(): typeof requestAnimationFrame {
    if (SUPPORTED_ANIMATION_FRAME) {
        return requestAnimationFrame.bind(null);
    }

    if (SUPPORTED_WEBKIt_ANIMATION_FRAME) {
        return webkitRequestAnimationFrame.bind(null);
    }

    assert(false, `The "revokeObjectURL()" is not supported.`);
}

export default createRequestAnimationFrame();
