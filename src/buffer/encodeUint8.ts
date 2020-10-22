/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import setUint8 from "./setUint8";

function encodeUint8(source: Uint8Array, target: Uint8Array, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): void {
    for (let i: number = sourceStart, j: number = targetStart; i < sourceEnd && j < targetEnd; ++i, ++j) {
        setUint8(target, source[i], j);
    }
}

export default encodeUint8;
