/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const __HTML_VIDEO_ELEMENT_TESTER__: HTMLVideoElement = document.createElement("video");

export const SUPPORTED_HTML_MEDIA_ELEMENT_SRC_OBJECT: boolean = (typeof __HTML_VIDEO_ELEMENT_TESTER__.srcObject !== "undefined");
export const SUPPORTED_URL_OBJECT: boolean = (typeof URL !== "undefined");
export const SUPPORTED_WEBKIT_URL_OBJECT: boolean = (typeof webkitURL !== "undefined");

export const SUPPORTED_ANIMATION_FRAME: boolean = (typeof requestAnimationFrame === "function" && typeof cancelAnimationFrame === "function");
export const SUPPORTED_WEBKIt_ANIMATION_FRAME: boolean = (typeof webkitRequestAnimationFrame === "function" && typeof webkitCancelAnimationFrame === "function");
