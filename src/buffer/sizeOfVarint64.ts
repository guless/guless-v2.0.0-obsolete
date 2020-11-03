/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import clz32 from "../math/clz32";
import Long64 from "./Long64";

function sizeOfVarint64(value: Long64): number {
    const clz64: number = (value.h32 === 0 ? 32 + clz32(value.l32) : clz32(value.h32));
    return Math.ceil((64 - clz64) / 7);
}

export default sizeOfVarint64;
