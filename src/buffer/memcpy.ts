/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";

function memcpy<T extends Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Float32Array | Float64Array>(source: T, target: T, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): void {
    if (typeof (target as internal).set === "function" && typeof (source as internal).subarray === "function") {
        sourceEnd = sourceStart + Math.min(sourceEnd - sourceStart, targetEnd - targetStart);

        if (sourceStart === 0 && sourceEnd === source.length) {
            (target as internal).set(source, targetStart);
        } else {
            (target as internal).set((source as internal).subarray(sourceStart, sourceEnd), targetStart);
        }
    } else {
        for (let i: number = sourceStart, j: number = targetStart; i < sourceEnd && j < targetEnd; ++i, ++j) {
            target[j] = source[i];
        }
    }
}

export default memcpy;
