/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { u32, u64 } from "./ctypes";
import { u64vec }  from "./ctypes";
import { l64l32, l64h32, l64set } from "./ctypes";

function u64abits(x: u64 | u64vec, l: number): u64 | u64vec {
    const lo: number = (l << 3) >>> 0;
    const hi: number = (l >>> 29);
    const l32: u32 = u32(l64l32(x) + lo);
    const h32: u32 = u32(l64h32(x) + hi + (l32 < lo ? 1 : 0));
    return l64set(x, l32, h32);
}

export default u64abits;
