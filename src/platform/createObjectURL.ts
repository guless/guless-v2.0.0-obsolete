/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import assert from "../assert";
import { SUPPORTED_URL_OBJECT, SUPPORTED_WEBKIT_URL_OBJECT } from "./capabilities";

function createCreateObjectURL(): typeof URL.createObjectURL {
    if (SUPPORTED_URL_OBJECT) {
        return URL.createObjectURL.bind(URL);
    }

    if (SUPPORTED_WEBKIT_URL_OBJECT) {
        return webkitURL.createObjectURL.bind(webkitURL);
    }

    assert(false, `The "createObjectURL()" is not supported.`);
}

export default createCreateObjectURL();
