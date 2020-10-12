/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import allocUint8Array from "../buffer/allocUint8Array";

class TextEncoder {
    public encode(source: string): Uint8Array {
        const target: Uint8Array = allocUint8Array(source.length);
        for (let i: number = 0, j: number = 0; i < source.length && j < target.length; ++i, ++j) {
            target[j] = source.charCodeAt(i) & 0xFF;
        }
        return target;
    }
}

export default TextEncoder;
