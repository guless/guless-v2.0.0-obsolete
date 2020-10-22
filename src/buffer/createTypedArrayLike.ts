/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import memset from "../buffer/memset";

function createTypedArrayLike(buffer: number | number[]): number[] {
    if (typeof buffer === "number") {
        buffer = new Array<number>(buffer);
        memset(buffer as internal, 0, 0, buffer.length);
    }

    return buffer;
}

export default createTypedArrayLike;
