/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import { SUPPORTED_TEXT_CODEC } from "../platform/capabilities/supported-text-codec";
import allocUint8Array from "../buffer/allocUint8Array";

function createTextEncoder(): typeof TextEncoder {
    if (SUPPORTED_TEXT_CODEC) {
        return TextEncoder;
    }

    return class TextEncoder {
        public encode(source: string): Uint8Array {
            const encoded: string = unescape(encodeURIComponent(source));
            const target: Uint8Array = allocUint8Array(encoded.length);
            for (let i: number = 0; i < encoded.length; ++i) {
                target[i] = encoded.charCodeAt(i);
            }
            return target;
        }
    } as internal;
}

export default createTextEncoder();
