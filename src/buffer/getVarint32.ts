/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import fault from "../fault";
import Reference from "../platform/Reference";

function getVarint32(source: Uint8Array, offset: number | Reference<number> = 0, length: number = source.length): number {
    let output: number = 0;
    if (typeof offset === "number") {
        for (let i: number = 0; i < 5 && offset < length; ++i) {
            const temp: number = source[offset++]; output |= ((temp & 0x7F) << (7 * i));

            if (temp < 0x80) {
                return output >>> 0;
            }
        }
    } else {
        for (let i: number = 0; i < 5 && offset.value < length; ++i) {
            const temp: number = source[offset.value++]; output |= ((temp & 0x7F) << (7 * i));

            if (temp < 0x80) {
                return output >>> 0;
            }
        }
    }
    fault("malformed varint32.");
}

export default getVarint32;
