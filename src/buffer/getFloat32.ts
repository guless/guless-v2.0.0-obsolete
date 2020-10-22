/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { ENDIANNESS } from "../platform/endianness";
import { SUPPORTED_TYPED_ARRAY } from "../platform/capabilities/supported-typed-array";
import { read } from "./IEEE754";
import Reference from "../platform/Reference";

function createGetFloat32(): (source: Uint8Array, offset?: number | Reference<number>, littleEndian?: boolean) => number {
    if (SUPPORTED_TYPED_ARRAY) {
        const __FLOAT32_DATA_VIEWER__: Float32Array = new Float32Array(1);
        const __FLOAT32_BYTE_VIEWER__: Uint8Array = new Uint8Array(__FLOAT32_DATA_VIEWER__.buffer, 0, 4);

        return function getFloat32(source: Uint8Array, offset: number | Reference<number> = 0, littleEndian: boolean = true): number {
            if (typeof offset === "number") {
                if (littleEndian === ENDIANNESS) {
                    __FLOAT32_BYTE_VIEWER__[0] = source[offset    ];
                    __FLOAT32_BYTE_VIEWER__[1] = source[offset + 1];
                    __FLOAT32_BYTE_VIEWER__[2] = source[offset + 2];
                    __FLOAT32_BYTE_VIEWER__[3] = source[offset + 3];
                } else {
                    __FLOAT32_BYTE_VIEWER__[3] = source[offset    ];
                    __FLOAT32_BYTE_VIEWER__[2] = source[offset + 1];
                    __FLOAT32_BYTE_VIEWER__[1] = source[offset + 2];
                    __FLOAT32_BYTE_VIEWER__[0] = source[offset + 3];
                }
            } else {
                if (littleEndian === ENDIANNESS) {
                    __FLOAT32_BYTE_VIEWER__[0] = source[offset.value++];
                    __FLOAT32_BYTE_VIEWER__[1] = source[offset.value++];
                    __FLOAT32_BYTE_VIEWER__[2] = source[offset.value++];
                    __FLOAT32_BYTE_VIEWER__[3] = source[offset.value++];
                } else {
                    __FLOAT32_BYTE_VIEWER__[3] = source[offset.value++];
                    __FLOAT32_BYTE_VIEWER__[2] = source[offset.value++];
                    __FLOAT32_BYTE_VIEWER__[1] = source[offset.value++];
                    __FLOAT32_BYTE_VIEWER__[0] = source[offset.value++];
                }
            }

            return __FLOAT32_DATA_VIEWER__[0];
        };
    }

    return function getFloat32(source: Uint8Array, offset: number | Reference<number> = 0, littleEndian: boolean = true): number {
        if (typeof offset === "number") {
            return read(source, offset, littleEndian, 23, 4);
        } else {
            const cursor: number = offset.value;
            offset.value += 4;
            return read(source, cursor, littleEndian, 23, 4);
        }
    };
}

export default createGetFloat32();
