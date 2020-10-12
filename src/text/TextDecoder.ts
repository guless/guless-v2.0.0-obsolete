/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class TextDecoder {
    public decode(source: Uint8Array): string {
        let encoded: string = '';
        for (let i: number = 0; i < source.length; ++i) {
            encoded += String.fromCharCode(source[i]);
        }
        return decodeURIComponent(escape(encoded));
    }
}

export default TextDecoder;
