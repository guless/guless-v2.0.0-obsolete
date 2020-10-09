/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import getFloat64 from "./getFloat64";

function decodeFloat64(source: Uint8Array, target: Float64Array, littleEndian: boolean = true,  sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): typeof target {
    for (let i: number = sourceStart, j: number = targetStart; i + 8 <= sourceEnd && j < targetEnd; i += 8, ++j) {
        target[j] = getFloat64(source, i, littleEndian);
    }
    return target;
}

export default decodeFloat64;
