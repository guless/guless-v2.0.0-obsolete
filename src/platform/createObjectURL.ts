/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { SUPPORTED_URL_OBJECT, SUPPORTED_WEBKIT_URL_OBJECT } from "./capabilities";

function createObjectURL(object: any): string {
    if (SUPPORTED_URL_OBJECT) {
        return URL.createObjectURL(object);
    }

    if (SUPPORTED_WEBKIT_URL_OBJECT) {
        return webkitURL.createObjectURL(object);
    }

    throw new Error(`The "createObjectURL()" is not supported.`);
}

export default createObjectURL;
