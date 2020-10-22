/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import getFloat32 from "./getFloat32";

function decodeFloat32(source: Uint8Array, target: Float32Array, littleEndian: boolean = true,  sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): void {
    for (let i: number = sourceStart, j: number = targetStart; i + 4 <= sourceEnd && j < targetEnd; i += 4, ++j) {
        target[j] = getFloat32(source, i, littleEndian);
    }
}

export default decodeFloat32;
