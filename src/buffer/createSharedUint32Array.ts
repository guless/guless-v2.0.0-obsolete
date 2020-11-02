/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import createUint32Array from "./createUint32Array";

let __SHARED_UINT32_ARRAY__: null | Uint32Array = null;

function createSharedUint32Array(length: number): Uint32Array {
    if (__SHARED_UINT32_ARRAY__ === null || __SHARED_UINT32_ARRAY__.length < length) {
        __SHARED_UINT32_ARRAY__ = createUint32Array(length);
    }
    return __SHARED_UINT32_ARRAY__;
}

export default createSharedUint32Array;
