/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function encodeInt16(source: Int16Array, target: Uint8Array, littleEndian: boolean = true, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): typeof target {
    if (littleEndian) {
        for (let i: number = sourceStart, j: number = targetStart; i < sourceEnd && j + 2 <= targetEnd; ++i, j += 2) {
            target[j    ] = ((source[i]      ) & 0xFF);
            target[j + 1] = ((source[i] >> 8 ) & 0xFF);
        }
    } else {
        for (let i: number = sourceStart, j: number = targetStart; i < sourceEnd && j + 2 <= targetEnd; ++i, j += 2) {
            target[j    ] = ((source[i] >> 8) & 0xFF);
            target[j + 1] = ((source[i]     ) & 0xFF);
        }
    }
    return target;
}

export default encodeInt16;
