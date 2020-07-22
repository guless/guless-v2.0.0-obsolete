/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { i8vec, i16vec, i32vec, u8vec, u16vec, u32vec, f32vec, f64vec } from "./types";

function memset<T extends i8vec | i16vec | i32vec | u8vec | u16vec | u32vec | f32vec | f64vec>(source: T, value: number, start: number = 0, end: number = source.length): typeof source {
    if (typeof (source as any).fill === "function") {
        return (source as any).fill(value, start, end);
    }

    for (let i: number = start; i < end; ++i) {
        source[i] = value;
    }

    return source;
}

export default memset;
