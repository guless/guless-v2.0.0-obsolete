/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import SingletonElementRegistry from "../SingletonElementRegistry";
export const SUPPORTED_MEDIA_SRC_OBJECT_ATTRIBUTE: boolean = (typeof SingletonElementRegistry.create("video").srcObject !== "undefined");
