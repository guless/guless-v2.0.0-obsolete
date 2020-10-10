/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import SYSTEM_ENDIANNESS from "../platform/endianness";
import { SUPPORTED_TYPED_ARRAY } from "../platform/capabilities/supported-typed-array";
import { write } from "./IEEE754";

function createSetFloat64(): (target: Uint8Array, value: number, offset?: number, littleEndian?: boolean) => void {
    if (SUPPORTED_TYPED_ARRAY) {
        const __FLOAT64_DATA_VIEWER__: Float64Array = new Float64Array(1);
        const __FLOAT64_BYTE_VIEWER__: Uint8Array = new Uint8Array(__FLOAT64_DATA_VIEWER__.buffer, 0, 8);

        return function setFloat64(target: Uint8Array, value: number, offset: number = 0, littleEndian: boolean = true): void {
            __FLOAT64_BYTE_VIEWER__[0] = value;

            if (littleEndian === SYSTEM_ENDIANNESS) {
                target[offset    ] = __FLOAT64_BYTE_VIEWER__[0];
                target[offset + 1] = __FLOAT64_BYTE_VIEWER__[1];
                target[offset + 2] = __FLOAT64_BYTE_VIEWER__[2];
                target[offset + 3] = __FLOAT64_BYTE_VIEWER__[3];
                target[offset + 4] = __FLOAT64_BYTE_VIEWER__[4];
                target[offset + 5] = __FLOAT64_BYTE_VIEWER__[5];
                target[offset + 6] = __FLOAT64_BYTE_VIEWER__[6];
                target[offset + 7] = __FLOAT64_BYTE_VIEWER__[7];
            } else {
                target[offset    ] = __FLOAT64_BYTE_VIEWER__[7];
                target[offset + 1] = __FLOAT64_BYTE_VIEWER__[6];
                target[offset + 2] = __FLOAT64_BYTE_VIEWER__[5];
                target[offset + 3] = __FLOAT64_BYTE_VIEWER__[4];
                target[offset + 4] = __FLOAT64_BYTE_VIEWER__[3];
                target[offset + 5] = __FLOAT64_BYTE_VIEWER__[2];
                target[offset + 6] = __FLOAT64_BYTE_VIEWER__[1];
                target[offset + 7] = __FLOAT64_BYTE_VIEWER__[0];
            }
        };
    }

    return function setFloat64(target: Uint8Array, value: number, offset: number = 0, littleEndian: boolean = true): void {
        write(target, value, offset, littleEndian, 52, 8);
    };
}

export default createSetFloat64();
