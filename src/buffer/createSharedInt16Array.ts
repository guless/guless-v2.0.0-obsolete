/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import createInt16Array from "./createInt16Array";

let __SHARED_INT16_ARRAY__: null | Int16Array = null;

function createSharedInt8Array(length: number): Int16Array {
    if (__SHARED_INT16_ARRAY__ === null || __SHARED_INT16_ARRAY__.length < length) {
        __SHARED_INT16_ARRAY__ = createInt16Array(length);
    }
    return __SHARED_INT16_ARRAY__;
}

export default createSharedInt16Array;
