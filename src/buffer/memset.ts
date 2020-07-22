/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { i8vec, i16vec, i32vec, u8vec, u16vec, u32vec, f32vec, f64vec, i64vec, u64vec, l64parse } from "./ctypes";

function memset<T extends i8vec | i16vec | i32vec | u8vec | u16vec | u32vec | f32vec | f64vec | i64vec | u64vec>(source: T, value: number, start: number = 0, end: number = source.length): typeof source {
    if ((source as any)["__IS_BIT64__"]) {
        for (let i: number = start; i + 2 <= end; i += 2) {
            l64parse(source, value, i/*<, (source as any)["__UNSIGNED__"]>*/);
        }
        return source;
    }

    if (typeof (source as any).fill === "function") {
        return (source as any).fill(value, start, end);
    }

    for (let i: number = start; i < end; ++i) {
        source[i] = value;
    }

    return source;
}

export default memset;
