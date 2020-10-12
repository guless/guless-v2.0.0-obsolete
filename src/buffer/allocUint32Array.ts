/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import { SUPPORTED_TYPED_ARRAY } from "../platform/capabilities/supported-typed-array";
import memset from "./memset";

function allocUint32Array(length: number): Uint32Array;
function allocUint32Array(buffer: number[]): Uint32Array;
function allocUint32Array(buffer: any): Uint32Array {
    if (SUPPORTED_TYPED_ARRAY) {
        return new Uint32Array(buffer);
    }

    if (typeof buffer === "number") {
        return memset(new Array(buffer) as internal, 0, 0, buffer);
    }

    return buffer;
}

export default allocUint32Array;
