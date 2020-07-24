/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { u8 } from "./ctypes";
import { u8vec, u16vec } from "./ctypes";

function strenc(source: string, target: u8vec | u16vec, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): typeof target {
    if (target.__BYTES_PER_ELEMENT__ === 1) {
        for (let i: number = sourceStart, j: number = targetStart; i < sourceEnd && j < targetEnd; ++i, ++j) {
            target[j] = u8(source.charCodeAt(i));
        }
    } else {
        for (let i: number = sourceStart, j: number = targetStart; i < sourceEnd && j < targetEnd; ++i, ++j) {
            target[j] = source.charCodeAt(i);
        }
    }
    return target;
}

export default strenc;
