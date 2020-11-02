/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import createUint16Array from "./createUint16Array";

let __SHARED_UINT16_ARRAY__: null | Uint16Array = null;

function createSharedUint16Array(length: number): Uint16Array {
    if (__SHARED_UINT16_ARRAY__ === null || __SHARED_UINT16_ARRAY__.length < length) {
        __SHARED_UINT16_ARRAY__ = createUint16Array(length);
    }
    return __SHARED_UINT16_ARRAY__;
}

export default createSharedUint16Array;
