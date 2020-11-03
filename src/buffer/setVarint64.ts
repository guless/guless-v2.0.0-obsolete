/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Reference from "../platform/Reference";
import Long64 from "./Long64";

function setVarint64(target: Uint8Array, value: Long64, offset: number | Reference<number> = 0): void {
    let l32: number = value.l32 >>> 0;
    let h32: number = value.h32 >>> 0;
    
    if (typeof offset === "number") {
        while (h32 > 0 || l32 > 0x7F) {
            target[offset++] = ((l32 & 0x7F) | 0x80);
            l32 = ((l32 >>> 7) | (h32 << 25)) >>> 0;
            h32 = h32 >>> 7;
        }
        target[offset++] = l32;
    } else {
        while (h32 > 0 || l32 > 0x7F) {
            target[offset.value++] = ((l32 & 0x7F) | 0x80);
            l32 = ((l32 >>> 7) | (h32 << 25)) >>> 0;
            h32 = h32 >>> 7;
        }
        target[offset.value++] = l32;
    }
}

export default setVarint64;
