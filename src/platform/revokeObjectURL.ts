/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { SUPPORTED_URL_OBJECT, SUPPORTED_WEBKIT_URL_OBJECT } from "./capabilities";

function revokeObjectURL(url: string): void {
    if (SUPPORTED_URL_OBJECT) {
        return URL.revokeObjectURL(url);
    }

    if (SUPPORTED_WEBKIT_URL_OBJECT) {
        return webkitURL.revokeObjectURL(url);
    }

    throw new Error(`The "revokeObjectURL()" is not supported.`);
}

export default revokeObjectURL;
