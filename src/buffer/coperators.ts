/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { i32, u32 } from "./ctypes";

function i32rotl(x: number, n: number): i32 {
    return (((x) << (n)) | ((x) >>> (32 - (n))));
}

function i32rotr(x: number, n: number): i32 {
    return (((x) << (32 - (n))) | ((x) >>> (n)));
}

function u32rotl(x: number, n: number): u32 {
    return u32(i32rotl(x, n));
}

function u32rotr(x: number, n: number): u32 {
    return u32(i32rotr(x, n));
}

export { i32rotl, i32rotr, u32rotl, u32rotr };
