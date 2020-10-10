/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const SUPPORTED_ANIMATION_FRAME: boolean = (typeof requestAnimationFrame === "function" && typeof cancelAnimationFrame === "function");
export const SUPPORTED_WEBKIT_ANIMATION_FRAME: boolean = (typeof webkitRequestAnimationFrame === "function" && typeof webkitCancelAnimationFrame === "function");
