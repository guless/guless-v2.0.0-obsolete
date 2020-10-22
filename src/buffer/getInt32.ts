/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getInt32(source: Uint8Array, offset: number = 0, littleEndian: boolean = true): number {
    if (littleEndian) {
        return ((source[offset]) | (source[offset + 1] << 8) | (source[offset + 2] << 16) | (source[offset + 3] << 24)) | 0;
    } else {
        return ((source[offset] << 24) | (source[offset + 1] << 16) | (source[offset + 2] << 8) | (source[offset + 3])) | 0;
    }
}

export default getInt32;
