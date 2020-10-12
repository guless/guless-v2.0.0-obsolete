/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import { SUPPORTED_TYPED_ARRAY } from "../platform/capabilities/supported-typed-array";
import memset from "./memset";

function allocInt32Array(length: number): Int32Array;
function allocInt32Array(buffer: number[]): Int32Array;
function allocInt32Array(buffer: any): Int32Array {
    if (SUPPORTED_TYPED_ARRAY) {
        return new Int32Array(buffer);
    }

    if (typeof buffer === "number") {
        return memset(new Array(buffer) as internal, 0, 0, buffer);
    }

    return buffer;
}

export default allocInt32Array;
