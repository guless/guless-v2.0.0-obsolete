/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Reference from "./Reference";

function setBoolean(target: Uint8Array, value: boolean, offset: number | Reference<number> = 0): void {
    if (typeof offset === "number") {
        target[offset] = (value ? 1 : 0);
    } else {
        target[offset.value++] = (value ? 1 : 0);
    }
}

export default setBoolean;
