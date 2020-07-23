/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { i32 } from "./ctypes";

function i32rotl(x: i32, n: number): i32 {
    return (((x) << (n)) | ((x) >>> (32 - (n))));
}

function i32rotr(x: i32, n: number): i32 {
    return (((x) << (32 - (n))) | ((x) >>> (n)));
}

export { i32rotl, i32rotr };
