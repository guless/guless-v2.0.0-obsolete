/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { SUPPORTED_MATH_FROUND } from "../platform/capabilities/supported-math-fround";
import { SUPPORTED_TYPED_ARRAY } from "../platform/capabilities/supported-typed-array";

function createMathFRound(): typeof Math.fround {
    if (SUPPORTED_MATH_FROUND) {
        return Math.fround.bind(Math);
    }

    if (SUPPORTED_TYPED_ARRAY) {
        const __FLOAT32_DATA_VIEWER__: Float32Array = new Float32Array(1);
        return function fround(x: number): number { __FLOAT32_DATA_VIEWER__[0] = x; return __FLOAT32_DATA_VIEWER__[0]; };
    }

    return function fround(x: number): number {
        if (x === 0 || isNaN(x)) {
            return x;
        }
    
        const sign: number = x < 0 ? -1 : 1;
    
        if (sign === -1) {
            x = -x;
        }
    
        const e: number = Math.floor(Math.log(x) / Math.LN2);
        const p: number = Math.pow(2, Math.max(-126, Math.min(e, 127)));
        const l: number = e < -127 ? 0 : 1;
        const m: number = Math.round((l - x / p) * 0x800000);
    
        if (m <= -0x800000) {
            return sign * Infinity;
        }
    
        return sign * p * (l - m / 0x800000);
    };
}

export default createMathFRound();
