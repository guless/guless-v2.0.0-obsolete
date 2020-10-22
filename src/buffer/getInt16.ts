/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getInt16(source: Uint8Array, offset: number = 0, littleEndian: boolean = true): number {
    if (littleEndian) {
        return ((source[offset]) | (source[offset + 1] << 8)) << 16 >> 16;
    } else {
        return ((source[offset] << 8) | (source[offset + 1])) << 16 >> 16;
    }
}

export default getInt16;
