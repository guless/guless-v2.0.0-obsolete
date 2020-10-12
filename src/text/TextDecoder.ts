/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import { SUPPORTED_TEXT_CODEC } from "../platform/capabilities/supported-text-codec";

function createTextDecoder(): typeof TextDecoder {
    if (SUPPORTED_TEXT_CODEC) {
        return TextDecoder;
    }

    return class TextDecoder {
        public decode(source: Uint8Array): string {
            let encoded: string = '';
            for (let i: number = 0; i < source.length; ++i) {
                encoded += String.fromCharCode(source[i]);
            }
            return decodeURIComponent(escape(encoded));
        }
    } as internal;
}

export default createTextDecoder();
