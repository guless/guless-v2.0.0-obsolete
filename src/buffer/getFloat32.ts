/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import SYSTEM_ENDIANNESS from "../platform/endianness";
import { SUPPORTED_TYPED_ARRAY } from "../platform/capabilities";
import { read } from "./IEEE754";

function createGetFloat32(): (source: Uint8Array, offset?: number, littleEndian?: boolean) => number {
    if (SUPPORTED_TYPED_ARRAY) {
        const __FLOAT32_DATA_VIEWER__: Float32Array = new Float32Array(1);
        const __FLOAT32_BYTE_VIEWER__: Uint8Array = new Uint8Array(__FLOAT32_DATA_VIEWER__.buffer, 0, 4);

        return function getFloat32(source: Uint8Array, offset: number = 0, littleEndian: boolean = true): number {
            if (littleEndian === SYSTEM_ENDIANNESS) {
                __FLOAT32_BYTE_VIEWER__[0] = source[offset    ];
                __FLOAT32_BYTE_VIEWER__[1] = source[offset + 1];
                __FLOAT32_BYTE_VIEWER__[2] = source[offset + 2];
                __FLOAT32_BYTE_VIEWER__[3] = source[offset + 3];
            } else {
                __FLOAT32_BYTE_VIEWER__[0] = source[offset + 3];
                __FLOAT32_BYTE_VIEWER__[1] = source[offset + 2];
                __FLOAT32_BYTE_VIEWER__[2] = source[offset + 1];
                __FLOAT32_BYTE_VIEWER__[3] = source[offset    ];
            }

            return __FLOAT32_DATA_VIEWER__[0];
        };
    }

    return function getFloat32(source: Uint8Array, offset: number = 0, littleEndian: boolean = true): number {
        return read(source, offset, littleEndian, 23, 4);
    };
}

export default createGetFloat32();
