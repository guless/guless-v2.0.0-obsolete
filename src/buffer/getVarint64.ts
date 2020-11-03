/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import fault from "../fault";
import Reference from "../platform/Reference";
import Long64 from "./Long64";

function getVarint64(source: Uint8Array, target: Long64, offset: number | Reference<number> = 0, length: number = source.length): Long64 {
    let l32: number = 0;
    let h32: number = 0;
    if (typeof offset === "number") {
        for (let i: number = 0, t: number; i < 4 && offset < length; ++i) {
            l32 |= (((t = source[offset++]) & 0x7F) << (7 * i));
            if (t < 0x80) {
                target.l32 = l32 >>> 0;
                target.h32 = h32 >>> 0;
                return target;
            }
        }
        if (offset < length) {
            const t: number = source[offset++];
            l32 |= (t & 0x7F) << 28;
            h32 |= (t & 0x7F) >>> 4;
            if (t < 0x80) {
                target.l32 = l32 >>> 0;
                target.h32 = h32 >>> 0;
                return target;
            }
        }
        for (let i: number = 0, t: number; i < 5 && offset < length; ++i) {
            h32 |= (((t = source[offset++]) & 0x7F) << (7 * i + 3));
            if (t < 0x80) {
                target.l32 = l32 >>> 0;
                target.h32 = h32 >>> 0;
                return target;
            }
        }
    } else {
        for (let i: number = 0, t: number; i < 4 && offset.value < length; ++i) {
            l32 |= (((t = source[offset.value++]) & 0x7F) << (7 * i));
            if (t < 0x80) {
                target.l32 = l32 >>> 0;
                target.h32 = h32 >>> 0;
                return target;
            }
        }
        if (offset.value < length) {
            const t: number = source[offset.value++];
            l32 |= (t & 0x7F) << 28;
            h32 |= (t & 0x7F) >>> 4;
            if (t < 0x80) {
                target.l32 = l32 >>> 0;
                target.h32 = h32 >>> 0;
                return target;
            }
        }
        for (let i: number = 0, t: number; i < 5 && offset.value < length; ++i) {
            h32 |= (((t = source[offset.value++]) & 0x7F) << (7 * i + 3));
            if (t < 0x80) {
                target.l32 = l32 >>> 0;
                target.h32 = h32 >>> 0;
                return target;
            }
        }
    }
    fault("malformed varint32.");
}

export default getVarint64;
