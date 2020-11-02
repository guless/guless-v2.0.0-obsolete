/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import createInt32Array from "./createInt32Array";

let __SHARED_INT32_ARRAY__: null | Int32Array = null;

function createSharedInt8Array(length: number): Int32Array {
    if (__SHARED_INT32_ARRAY__ === null || __SHARED_INT32_ARRAY__.length < length) {
        __SHARED_INT32_ARRAY__ = createInt32Array(length);
    }
    return __SHARED_INT32_ARRAY__;
}

export default createSharedInt32Array;
