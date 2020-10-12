/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import { SUPPORTED_TYPED_ARRAY } from "../platform/capabilities/supported-typed-array";
import memset from "./memset";

function allocUint16Array(length: number): Uint16Array;
function allocUint16Array(buffer: number[]): Uint16Array;
function allocUint16Array(buffer: any): Uint16Array {
    if (SUPPORTED_TYPED_ARRAY) {
        return new Uint16Array(buffer);
    }

    if (typeof buffer === "number") {
        return memset(new Array(buffer) as internal, 0, 0, buffer);
    }

    return buffer;
}

export default allocUint16Array;
