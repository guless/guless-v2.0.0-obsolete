/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import createUint8Array from "./createUint8Array";

let __SHARED_UINT8_ARRAY__: null | Uint8Array = null;

function createSharedUint8Array(length: number): Uint8Array {
    if (__SHARED_UINT8_ARRAY__ === null || __SHARED_UINT8_ARRAY__.length < length) {
        __SHARED_UINT8_ARRAY__ = createUint8Array(length);
    }
    return __SHARED_UINT8_ARRAY__;
}

export default createSharedUint8Array;
