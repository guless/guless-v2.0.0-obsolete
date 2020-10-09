/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { SUPPORTED_URL_OBJECT, SUPPORTED_WEBKIT_URL_OBJECT } from "./capabilities";

function createRevokeObjectURL(): typeof URL.revokeObjectURL {
    if (SUPPORTED_URL_OBJECT) {
        return URL.revokeObjectURL.bind(URL);
    }

    if (SUPPORTED_WEBKIT_URL_OBJECT) {
        return webkitURL.revokeObjectURL.bind(webkitURL);
    }

    return function revokeObjectURL(url: string): void {
        throw new Error(`The "revokeObjectURL()" is not implemented.`);
    }
}

export default createRevokeObjectURL();
