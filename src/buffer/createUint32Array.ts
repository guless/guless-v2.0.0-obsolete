/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import { SUPPORTED_TYPED_ARRAY } from "../platform/capabilities/supported-typed-array";
import createTypedArrayLike from "./createTypedArrayLike";

function createUint32Array(buffer: number | number[]): Uint32Array {
    if (SUPPORTED_TYPED_ARRAY) {
        return new Uint32Array(buffer as internal);
    }

    return createTypedArrayLike(buffer) as internal;
}

export default createUint32Array;
