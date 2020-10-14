/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Long64 from "./Long64";
import Reference from "./Reference";
import getUint32 from "./getUint32";

function getLong64(source: Uint8Array, offset: number | Reference<number> = 0, littleEndian: boolean = true, output: Long64 = Long64.SHARED_INSTANCE): Long64 {
    if (typeof offset === "number") {
        if (littleEndian) {
            output.l32 = getUint32(source, offset, littleEndian);
            output.h32 = getUint32(source, offset + 4, littleEndian);
        } else {
            output.h32 = getUint32(source, offset, littleEndian);
            output.l32 = getUint32(source, offset + 4, littleEndian);
        }
    } else {
        if (littleEndian) {
            output.l32 = getUint32(source, offset, littleEndian);
            output.h32 = getUint32(source, offset, littleEndian);
        } else {
            output.h32 = getUint32(source, offset, littleEndian);
            output.l32 = getUint32(source, offset, littleEndian);
        }
    }
    return output;
}

export default getLong64;
