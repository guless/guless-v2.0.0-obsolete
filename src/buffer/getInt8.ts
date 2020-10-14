/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Reference from "./Reference";

function getInt8(source: Uint8Array, offset: number | Reference<number> = 0): number {
    if (typeof offset === "number") {
        return (source[offset]) << 24 >> 24;
    } else {
        return (source[offset.value++]) << 24 >> 24;
    }
}

export default getInt8;
