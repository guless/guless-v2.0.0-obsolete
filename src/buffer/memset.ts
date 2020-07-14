/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import TypedArray from "./TypedArray";

function memset<T extends TypedArray>(buffer: T, value: number, start: number = 0, end: number = buffer.length): typeof buffer {
    if (typeof buffer.fill === "function") {
        buffer.fill(value, start, end);
    } else {
        for (let i: number = start; i < end; ++i) {
            buffer[i] = value;
        }
    }

    return buffer;
}

export default memset;
