/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import createInt8Array from "./createInt8Array";

let __SHARED_INT8_ARRAY__: null | Int8Array = null;

function createSharedInt8Array(length: number): Int8Array {
    if (__SHARED_INT8_ARRAY__ === null || __SHARED_INT8_ARRAY__.length < length) {
        __SHARED_INT8_ARRAY__ = createInt8Array(length);
    }
    return __SHARED_INT8_ARRAY__;
}

export default createSharedInt8Array;
