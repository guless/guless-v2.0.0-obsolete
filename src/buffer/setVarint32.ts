/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Reference from "../platform/Reference";

function setVarint32(target: Uint8Array, value: number, offset: number | Reference<number> = 0): void {
    value = value >>> 0;
    if (typeof offset === "number") {
        while (value > 0x7F) {
            target[offset++] = ((value & 0x7F) | 0x80);
            value = value >>> 7;
        }
        target[offset++] = value;
    } else {
        while(value > 0x7F) {
            target[offset.value++] = ((value & 0x7F) | 0x80);
            value = value >>> 7;
        }
        target[offset.value++] = value;
    }
}

export default setVarint32;
