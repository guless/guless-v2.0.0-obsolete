/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { ENDIANNESS } from "../platform/endianness";
import { SUPPORTED_TYPED_ARRAY } from "../platform/capabilities/supported-typed-array";
import { read } from "./IEEE754";
import Reference from "./Reference";

function createGetFloat64(): (source: Uint8Array, offset?: number | Reference<number>, littleEndian?: boolean) => number {
    if (SUPPORTED_TYPED_ARRAY) {
        const __FLOAT64_DATA_VIEWER__: Float64Array = new Float64Array(1);
        const __FLOAT64_BYTE_VIEWER__: Uint8Array = new Uint8Array(__FLOAT64_DATA_VIEWER__.buffer, 0, 8);

        return function getFloat64(source: Uint8Array, offset: number | Reference<number> = 0, littleEndian: boolean = true): number {
            if (typeof offset === "number") {
                if (littleEndian === ENDIANNESS) {
                    __FLOAT64_BYTE_VIEWER__[0] = source[offset    ];
                    __FLOAT64_BYTE_VIEWER__[1] = source[offset + 1];
                    __FLOAT64_BYTE_VIEWER__[2] = source[offset + 2];
                    __FLOAT64_BYTE_VIEWER__[3] = source[offset + 3];
                    __FLOAT64_BYTE_VIEWER__[4] = source[offset + 4];
                    __FLOAT64_BYTE_VIEWER__[5] = source[offset + 5];
                    __FLOAT64_BYTE_VIEWER__[6] = source[offset + 6];
                    __FLOAT64_BYTE_VIEWER__[7] = source[offset + 7];
                } else {
                    __FLOAT64_BYTE_VIEWER__[0] = source[offset + 7];
                    __FLOAT64_BYTE_VIEWER__[1] = source[offset + 6];
                    __FLOAT64_BYTE_VIEWER__[2] = source[offset + 5];
                    __FLOAT64_BYTE_VIEWER__[3] = source[offset + 4];
                    __FLOAT64_BYTE_VIEWER__[4] = source[offset + 3];
                    __FLOAT64_BYTE_VIEWER__[5] = source[offset + 2];
                    __FLOAT64_BYTE_VIEWER__[6] = source[offset + 1];
                    __FLOAT64_BYTE_VIEWER__[7] = source[offset    ];
                }
            } else {
                if (littleEndian === ENDIANNESS) {
                    __FLOAT64_BYTE_VIEWER__[0] = source[offset.value++];
                    __FLOAT64_BYTE_VIEWER__[1] = source[offset.value++];
                    __FLOAT64_BYTE_VIEWER__[2] = source[offset.value++];
                    __FLOAT64_BYTE_VIEWER__[3] = source[offset.value++];
                    __FLOAT64_BYTE_VIEWER__[4] = source[offset.value++];
                    __FLOAT64_BYTE_VIEWER__[5] = source[offset.value++];
                    __FLOAT64_BYTE_VIEWER__[6] = source[offset.value++];
                    __FLOAT64_BYTE_VIEWER__[7] = source[offset.value++];
                } else {
                    __FLOAT64_BYTE_VIEWER__[7] = source[offset.value++];
                    __FLOAT64_BYTE_VIEWER__[6] = source[offset.value++];
                    __FLOAT64_BYTE_VIEWER__[5] = source[offset.value++];
                    __FLOAT64_BYTE_VIEWER__[4] = source[offset.value++];
                    __FLOAT64_BYTE_VIEWER__[3] = source[offset.value++];
                    __FLOAT64_BYTE_VIEWER__[2] = source[offset.value++];
                    __FLOAT64_BYTE_VIEWER__[1] = source[offset.value++];
                    __FLOAT64_BYTE_VIEWER__[0] = source[offset.value++];
                }
            }

            return __FLOAT64_DATA_VIEWER__[0];
        };
    }

    return function getFloat64(source: Uint8Array, offset: number | Reference<number> = 0, littleEndian: boolean = true): number {
        if (typeof offset === "number") {
            return read(source, offset, littleEndian, 52, 8);
        } else {
            const cursor: number = offset.value;
            offset.value += 8;
            return read(source, cursor, littleEndian, 52, 8);
        }
    };
}

export default createGetFloat64();
