/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import assert from "../assert";
import { SUPPORTED_TYPED_ARRAY } from "./capabilities/supported-typed-array";

function detectPlatformEndianness(): boolean {
    if (SUPPORTED_TYPED_ARRAY) {
        const __UINT32_BYTE_VIEWER__: Uint8Array = new Uint8Array(new Uint32Array([0x12345678]).buffer, 0, 4);
        const __IS_LITTLE_ENDIAN__: boolean = (__UINT32_BYTE_VIEWER__[0] === 0x78 && __UINT32_BYTE_VIEWER__[1] === 0x56 && __UINT32_BYTE_VIEWER__[2] === 0x34 && __UINT32_BYTE_VIEWER__[3] === 0x12);
        const __IS_BIG_ENDIAN__   : boolean = (__UINT32_BYTE_VIEWER__[3] === 0x78 && __UINT32_BYTE_VIEWER__[2] === 0x56 && __UINT32_BYTE_VIEWER__[1] === 0x34 && __UINT32_BYTE_VIEWER__[0] === 0x12);

        assert(__IS_LITTLE_ENDIAN__ || __IS_BIG_ENDIAN__, `The platform endianness must be either "LITTLE_ENDIAN" or "BIG_ENDIAN".`);
        return __IS_LITTLE_ENDIAN__;
    }

    return true;
}

export const ENDIANNESS: boolean = detectPlatformEndianness();
