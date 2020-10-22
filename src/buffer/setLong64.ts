/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Long64 from "./Long64";
import setUint32 from "./setUint32";

function setLong64(target: Uint8Array, value: Long64, offset: number = 0, littleEndian: boolean = true): void {
    if (littleEndian) {
        setUint32(target, value.l32, offset, littleEndian);
        setUint32(target, value.h32, offset + 4, littleEndian);
    } else {
        setUint32(target, value.h32, offset, littleEndian);
        setUint32(target, value.l32, offset + 4, littleEndian);
    }
}

export default setLong64;
