/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import createFloat32Array from "./createFloat32Array";

let __SHARED_FLOAT32_ARRAY__: null | Float32Array = null;

function createSharedFloat32Array(length: number): Float32Array {
    if (__SHARED_FLOAT32_ARRAY__ === null || __SHARED_FLOAT32_ARRAY__.length < length) {
        __SHARED_FLOAT32_ARRAY__ = createFloat32Array(length);
    }
    return __SHARED_FLOAT32_ARRAY__;
}

export default createSharedFloat32Array;
