/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import { SUPPORTED_TYPED_ARRAY } from "../platform/capabilities/supported-typed-array";
import createTypedArrayLike from "./createTypedArrayLike";

function createInt16Array(buffer: number | number[]): Int16Array {
    if (SUPPORTED_TYPED_ARRAY) {
        return new Int16Array(buffer as internal);
    }

    return createTypedArrayLike(buffer) as internal;
}

export default createInt16Array;
