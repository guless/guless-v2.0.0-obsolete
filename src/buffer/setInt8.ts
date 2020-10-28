/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Reference from "../platform/Reference";

function setInt8(target: Uint8Array, value: number, offset: number | Reference<number> = 0): void {
    if (typeof offset === "number") {
        target[offset] = (value & 0xFF);
    } else {
        target[offset.value++] = (value & 0xFF);
    }
}

export default setInt8;
