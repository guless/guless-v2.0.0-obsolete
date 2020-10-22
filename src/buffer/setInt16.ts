/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function setInt16(target: Uint8Array, value: number, offset: number = 0, littleEndian: boolean = true): void {
    if (littleEndian) {
        target[offset    ] = ((value     ) & 0xFF);
        target[offset + 1] = ((value >> 8) & 0xFF);
    } else {
        target[offset    ] = ((value >> 8) & 0xFF);
        target[offset + 1] = ((value     ) & 0xFF);
    }
}

export default setInt16;
