/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import { f64, i64, u64, } from "./ctypes";
import { i8vec, i16vec, i32vec, u8vec, u16vec, u32vec, f32vec, f64vec, i64vec, u64vec } from "./ctypes";
import { l64cnv } from "./ctypes";

function memset<T extends i8vec | i16vec | i32vec | u8vec | u16vec | u32vec | f32vec | f64vec | i64vec | u64vec>(source: T, value: number | i64 | u64, start: number = 0, end: number = source.length): typeof source {
    if (source.__IS_BIT64__) {
        for (let i: number = start; i + 2 <= end; i += 2) {
            l64cnv(source, value, i);
        }
        return source;
    }

    value = f64(value);

    if (typeof (source as internal).fill === "function") {
        return (source as internal).fill(value, start, end);
    }

    for (let i: number = start; i < end; ++i) {
        source[i] = value;
    }

    return source;
}

export default memset;
