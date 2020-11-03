/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function sizeOfVarint32(value: number): number {
    value = value >>> 0;
    /// 00000000 00000000 00000000 0xxxxxxx
    if (value <= 0x7F) {
        return 1;
    }
    /// 00000000 00000000 00yyyyyy yxxxxxxx
    if (value <= 0x3FFF) {
        return 2;
    }
    /// 00000000 000zzzzz zzyyyyyy yxxxxxxx
    if (value <= 0x1FFFFF) {
        return 3;
    }
    /// 0000wwww wwwzzzzz zzyyyyyy yxxxxxxx
    if (value <= 0xFFFFFFF) {
        return 4;
    }
    return 5;
}

export default sizeOfVarint32;
