/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import getUint16 from "./getUint16";

function decodeUint16(source: Uint8Array, target: Uint16Array, littleEndian: boolean = true, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): typeof target {
    for (let i: number = sourceStart, j: number = targetStart; i + 2 <= sourceEnd && j < targetEnd; i += 2, ++j) {
        target[j] = getUint16(source, i, littleEndian);
    }
    return target;
}

export default decodeUint16;