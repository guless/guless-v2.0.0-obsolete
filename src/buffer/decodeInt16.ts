/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function decodeInt16(source: Uint8Array, target: Int16Array, littleEndian: boolean = true, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): typeof target {
    if (littleEndian) {
        for (let i: number = sourceStart, j: number = targetStart; i + 2 <= sourceEnd && j < targetEnd; i += 2, ++j) {
            target[j] = ((source[i]) | (source[i + 1] << 8)) << 16 >> 16;
        }
    } else {
        for (let i: number = sourceStart, j: number = targetStart; i + 2 <= sourceEnd && j < targetEnd; i += 2, ++j) {
            target[j] = ((source[i] << 8) | (source[i + 1])) << 16 >> 16;
        }
    }
    return target;
}

export default decodeInt16;
