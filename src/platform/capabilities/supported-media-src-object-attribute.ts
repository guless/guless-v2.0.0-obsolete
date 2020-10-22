/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import SharedElementRegistry from "../SharedElementRegistry";
export const SUPPORTED_MEDIA_SRC_OBJECT_ATTRIBUTE: boolean = (typeof SharedElementRegistry.create("video").srcObject !== "undefined");
