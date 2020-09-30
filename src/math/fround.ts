/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import assert from "../assert";
import { SUPPORTED_MATH_FROUND, SUPPORTED_TYPED_ARRAY } from "../platform/capabilities";

function createMathFRound(): typeof Math.fround {
    if (SUPPORTED_MATH_FROUND) {
        return Math.fround.bind(Math);
    }

    if (SUPPORTED_TYPED_ARRAY) {
        const __FLOAT32_DATA_VIEWER__: Float32Array = new Float32Array(1);
        return function fround(x: number): number { __FLOAT32_DATA_VIEWER__[0] = x; return __FLOAT32_DATA_VIEWER__[0]; };
    }

    assert(false, `The "fround()" is not supported.`);
}

export default createMathFRound();
