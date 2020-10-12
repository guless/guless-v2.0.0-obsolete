/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import { SUPPORTED_TYPED_ARRAY } from "../platform/capabilities/supported-typed-array";
import memset from "./memset";

function allocUint8Array(length: number): Uint8Array;
function allocUint8Array(buffer: number[]): Uint8Array;
function allocUint8Array(buffer: any): Uint8Array {
    if (SUPPORTED_TYPED_ARRAY) {
        return new Uint8Array(buffer);
    }

    if (typeof buffer === "number") {
        return memset(new Array(buffer) as internal, 0, 0, buffer);
    }

    return buffer;
}

export default allocUint8Array;
