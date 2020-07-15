/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function u32dec(source: Uint8Array, target: Uint32Array, littleEndian: boolean = true, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): typeof target {
    if (littleEndian) {
        for (let i: number = sourceStart, j: number = targetStart; i + 4 <= sourceEnd && j < targetEnd; i += 4, ++j) {
            target[j] = (source[i]) | (source[i + 1] << 8) | (source[i + 2] << 16) | (source[i + 3] << 24);
        }
    } else {
        for (let i: number = sourceStart, j: number = targetStart; i + 4 <= sourceEnd && j < targetEnd; i += 4, ++j) {
            target[j] = (source[i] << 24) | (source[i + 1] << 16) | (source[i + 2] << 8) | (source[i + 3]);
        }
    }
    return target;
}

export default u32dec;
