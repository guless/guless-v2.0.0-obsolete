/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Long64 from "./Long64";
import Reference from "../platform/Reference";
import getUint32 from "./getUint32";

function getLong64(source: Uint8Array, target: Long64, offset: number | Reference<number> = 0, littleEndian: boolean = true): Long64 {
    if (typeof offset === "number") {
        if (littleEndian) {
            target.l32 = getUint32(source, offset, littleEndian);
            target.h32 = getUint32(source, offset + 4, littleEndian);
        } else {
            target.h32 = getUint32(source, offset, littleEndian);
            target.l32 = getUint32(source, offset + 4, littleEndian);
        }
    } else {
        if (littleEndian) {
            target.l32 = getUint32(source, offset, littleEndian);
            target.h32 = getUint32(source, offset, littleEndian);
        } else {
            target.h32 = getUint32(source, offset, littleEndian);
            target.l32 = getUint32(source, offset, littleEndian);
        }
    }
    return target;
}

export default getLong64;
