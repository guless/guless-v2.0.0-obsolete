/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import getInt8 from "./getInt8";

function decodeInt8(source: Uint8Array, target: Int8Array, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): typeof target {
    for (let i: number = sourceStart, j: number = targetStart; i < sourceEnd && j < targetEnd; ++i, ++j) {
        target[j] = getInt8(source, i);
    }
    return target;
}

export default decodeInt8;
