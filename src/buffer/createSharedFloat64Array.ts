/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import createFloat64Array from "./createFloat64Array";

let __SHARED_FLOAT64_ARRAY__: null | Float64Array = null;

function createSharedFloat64Array(length: number): Float64Array {
    if (__SHARED_FLOAT64_ARRAY__ === null || __SHARED_FLOAT64_ARRAY__.length < length) {
        __SHARED_FLOAT64_ARRAY__ = createFloat64Array(length);
    }
    return __SHARED_FLOAT64_ARRAY__;
}

export default createSharedFloat64Array;
