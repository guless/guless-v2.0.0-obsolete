/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const __HTML_MEDIA_ELEMENT_TESTER__: HTMLAudioElement = document.createElement("video");
export const SUPPORTED_HTML_MEDIA_ELEMENT_SRC_OBJECT = (typeof __HTML_MEDIA_ELEMENT_TESTER__.srcObject !== "undefined");
export const SUPPORTED_WEBKIT_URL_OBJECT = (typeof webkitURL !== "undefined");
export const SUPPORTED_URL_OBJECT = (typeof URL !== "undefined");
