/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import getUint32 from "./getUint32";

function decodeUint32(source: Uint8Array, target: Uint32Array, littleEndian: boolean = true, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): typeof target {
    for (let i: number = sourceStart, j: number = targetStart; i + 4 <= sourceEnd && j < targetEnd; i += 4, ++j) {
        target[j] = getUint32(source, i, littleEndian);
    }

    return target;
}

export default decodeUint32;
