/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import assert from "../assert";
import { SUPPORTED_ANIMATION_FRAME, SUPPORTED_WEBKIt_ANIMATION_FRAME } from "./capabilities";

function createCancelAnimationFrame(): typeof cancelAnimationFrame {
    if (SUPPORTED_ANIMATION_FRAME) {
        return cancelAnimationFrame.bind(null);
    }

    if (SUPPORTED_WEBKIt_ANIMATION_FRAME) {
        return webkitCancelAnimationFrame.bind(null);
    }

    assert(false, `The "cancelAnimationFrame()" is not supported.`);
}

export default createCancelAnimationFrame();
