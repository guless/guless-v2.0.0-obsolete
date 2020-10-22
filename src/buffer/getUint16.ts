/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Reference from "../platform/Reference";

function getUint16(source: Uint8Array, offset: number | Reference<number> = 0, littleEndian: boolean = true): number {
    if (typeof offset === "number") {
        if (littleEndian) {
            return ((source[offset]) | (source[offset + 1] << 8)) & 0xFFFF;
    
        } else {
            return ((source[offset] << 8) | (source[offset + 1])) & 0xFFFF;
        }
    } else {
        if (littleEndian) {
            return ((source[offset.value++]) | (source[offset.value++] << 8)) & 0xFFFF;
    
        } else {
            return ((source[offset.value++] << 8) | (source[offset.value++])) & 0xFFFF;
        }
    }
}

export default getUint16;
