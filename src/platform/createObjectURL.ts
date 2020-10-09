/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { SUPPORTED_URL_OBJECT, SUPPORTED_WEBKIT_URL_OBJECT } from "./capabilities";

function createCreateObjectURL(): typeof URL.createObjectURL {
    if (SUPPORTED_URL_OBJECT) {
        return URL.createObjectURL.bind(URL);
    }

    if (SUPPORTED_WEBKIT_URL_OBJECT) {
        return webkitURL.createObjectURL.bind(webkitURL);
    }

    return function createObjectURL(object: any): string {
        throw new Error(`The "createObjectURL()" is not implemented.`);
    }
}

export default createCreateObjectURL();
