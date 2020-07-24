/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { u8vec, u16vec } from "./ctypes";

function strdec(source: u8vec | u16vec, start: number = 0, end: number = source.length): string {
    let target: string = "";
    for (let i: number = start; i < end; ++i) {
        target += String.fromCharCode(source[i]);
    }
    return target;
}

export default strdec;
