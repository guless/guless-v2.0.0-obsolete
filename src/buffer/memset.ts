/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";

function memset<T extends Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Float32Array | Float64Array | Uint8ClampedArray>(source: T, value: number = 0, start: number = 0, end: number = source.length): typeof source {
    if (typeof (source as internal).fill === "function") {
        return (source as internal).fill(value, start, end);
    }

    for (let i: number = start; i < end; ++i) {
        source[i] = value;
    }

    return source;
}

export default memset;
