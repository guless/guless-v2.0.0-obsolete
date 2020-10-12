/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import { SUPPORTED_TYPED_ARRAY } from "../platform/capabilities/supported-typed-array";
import memset from "./memset";

function allocFloat32Array(length: number): Float32Array;
function allocFloat32Array(buffer: number[]): Float32Array;
function allocFloat32Array(buffer: any): Float32Array {
    if (SUPPORTED_TYPED_ARRAY) {
        return new Float32Array(buffer);
    }

    if (typeof buffer === "number") {
        return memset(new Array(buffer) as internal, 0, 0, buffer);
    }

    return buffer;
}

export default allocFloat32Array;
