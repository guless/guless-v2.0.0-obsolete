/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import SYSTEM_ENDIANNESS from "../platform/endianness";
import { SUPPORTED_TYPED_ARRAY } from "../platform/capabilities";
import { write } from "./IEEE754";

function createSetFloat32(): (target: Uint8Array, value: number, offset?: number, littleEndian?: boolean) => void {
    if (SUPPORTED_TYPED_ARRAY) {
        const __FLOAT32_DATA_VIEWER__: Float32Array = new Float32Array(1);
        const __FLOAT32_BYTE_VIEWER__: Uint8Array = new Uint8Array(__FLOAT32_DATA_VIEWER__.buffer, 0, 4);

        return function setFloat32(target: Uint8Array, value: number, offset: number = 0, littleEndian: boolean = true): void {
            __FLOAT32_BYTE_VIEWER__[0] = value;

            if (littleEndian === SYSTEM_ENDIANNESS) {
                target[offset    ] = __FLOAT32_BYTE_VIEWER__[0];
                target[offset + 1] = __FLOAT32_BYTE_VIEWER__[1];
                target[offset + 2] = __FLOAT32_BYTE_VIEWER__[2];
                target[offset + 3] = __FLOAT32_BYTE_VIEWER__[3];
            } else {
                target[offset    ] = __FLOAT32_BYTE_VIEWER__[3];
                target[offset + 1] = __FLOAT32_BYTE_VIEWER__[2];
                target[offset + 2] = __FLOAT32_BYTE_VIEWER__[1];
                target[offset + 3] = __FLOAT32_BYTE_VIEWER__[0];
            }
        };
    }

    return function setFloat32(target: Uint8Array, value: number, offset: number = 0, littleEndian: boolean = true): void {
        write(target, value, offset, littleEndian, 23, 4);
    };
}

export default createSetFloat32();
