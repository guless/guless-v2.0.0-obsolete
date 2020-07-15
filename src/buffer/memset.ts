/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import TypedArray from "./TypedArray";

function memset<T extends TypedArray>(source: T, value: number, sourceStart: number = 0, sourceEnd: number = source.length): typeof source {
    if (typeof source.fill === "function") {
        source.fill(value, sourceStart, sourceEnd);
    } else {
        for (let i: number = sourceStart; i < sourceEnd; ++i) {
            source[i] = value;
        }
    }

    return source;
}

export default memset;
