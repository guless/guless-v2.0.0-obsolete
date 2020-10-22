/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import setInt16 from "./setInt16";

function encodeInt16(source: Int16Array, target: Uint8Array, littleEndian: boolean = true, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): void {
    for (let i: number = sourceStart, j: number = targetStart; i < sourceEnd && j + 2 <= targetEnd; ++i, j += 2) {
        setInt16(target, source[i], j, littleEndian);
    }
}

export default encodeInt16;
