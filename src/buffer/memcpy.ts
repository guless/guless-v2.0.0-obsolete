/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import { i8vec, i16vec, i32vec, u8vec, u16vec, u32vec, f32vec, f64vec, i64vec, u64vec } from "./ctypes";

function memcpy<T extends i8vec | i16vec | i32vec | u8vec | u16vec | u32vec | f32vec | f64vec | i64vec | u64vec>(source: T, target: T, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): typeof target {
    if (typeof (target as internal).set === "function" && typeof (source as internal).subarray === "function") {
        sourceEnd = sourceStart + Math.min(sourceEnd - sourceStart, targetEnd - targetStart);

        if (sourceStart === 0 && sourceEnd === source.length) {
            (target as internal).set(source, targetStart);
        } else {
            (target as internal).set((source as internal).subarray(sourceStart, sourceEnd), targetStart);
        }

        return target;
    }

    for (let i: number = sourceStart, j: number = targetStart; i < sourceEnd && j < targetEnd; ++i, ++j) {
        target[j] = source[i];
    }

    return target;
}

export default memcpy;
