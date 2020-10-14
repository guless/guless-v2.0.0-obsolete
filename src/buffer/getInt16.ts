/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Reference from "./Reference";

function getInt16(source: Uint8Array, offset: number | Reference<number> = 0, littleEndian: boolean = true): number {
    if (typeof offset === "number") {
        if (littleEndian) {
            return ((source[offset]) | (source[offset + 1] << 8)) << 16 >> 16;
        } else {
            return ((source[offset] << 8) | (source[offset + 1])) << 16 >> 16;
        }
    } else {
        if (littleEndian) {
            return ((source[offset.value++]) | (source[offset.value++] << 8)) << 16 >> 16;
        } else {
            return ((source[offset.value++] << 8) | (source[offset.value++])) << 16 >> 16;
        }
    } 
}

export default getInt16;
