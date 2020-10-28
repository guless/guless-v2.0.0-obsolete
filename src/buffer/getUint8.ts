/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Reference from "../platform/Reference";

function getUint8(source: Uint8Array, offset: number | Reference<number> = 0): number {
    if (typeof offset === "number") {
        return (source[offset]) & 0xFF;
    } else {
        return (source[offset.value++]) & 0xFF;
    }
}

export default getUint8;
