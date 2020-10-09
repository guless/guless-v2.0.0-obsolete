/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function setUint32(target: Uint8Array, value: number, offset: number = 0, littleEndian: boolean = true): void {
    if (littleEndian) {
        target[offset    ] = ((value      ) & 0xFF);
        target[offset + 1] = ((value >> 8 ) & 0xFF);
        target[offset + 2] = ((value >> 16) & 0xFF);
        target[offset + 3] = ((value >> 24) & 0xFF);

    } else {
        target[offset    ] = ((value >> 24) & 0xFF);
        target[offset + 1] = ((value >> 16) & 0xFF);
        target[offset + 2] = ((value >> 8 ) & 0xFF);
        target[offset + 3] = ((value      ) & 0xFF);
    }
}

export default setUint32;
