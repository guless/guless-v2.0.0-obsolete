/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import setUint32 from "./setUint32";

function encodeUint32(source: Uint32Array, target: Uint8Array, littleEndian: boolean = true, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): void {
    for (let i: number = sourceStart, j: number = targetStart; i < sourceEnd && j + 4 <= targetEnd; ++i, j += 4) {
        setUint32(target, source[i], j, littleEndian);
    }
}

export default encodeUint32;
