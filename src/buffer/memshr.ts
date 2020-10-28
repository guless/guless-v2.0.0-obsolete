/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";

function memshr<T extends Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Float32Array | Float64Array>(source: T, start: number = 0, end: number = source.length): typeof source {
    if (start === 0 && end === source.length) {
        return source;
    }
    if (typeof (source as internal).subarray === "function") {
        return (source as internal).subarray(start, end);
    }
    (source as internal).length = end - start;
    return source;
}

export default memshr;
