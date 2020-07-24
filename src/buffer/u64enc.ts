/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { u8 } from "./ctypes";
import { u8vec, u64vec } from "./ctypes";
import { l64l32, l64h32 } from "./ctypes";

function u64enc(source: u64vec, target: u8vec, littleEndian: boolean = true, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): typeof target {
    if (littleEndian) {
        for (let i: number = sourceStart, j: number = targetStart; i + 2 <= sourceEnd && j + 8 <= targetEnd; i += 2, j += 8) {
            const l32: number = l64l32(source, i);
            const h32: number = l64h32(source, i);

            target[j    ] = u8((l32      ));
            target[j + 1] = u8((l32 >> 8 ));
            target[j + 2] = u8((l32 >> 16));
            target[j + 3] = u8((l32 >> 24));
            target[j + 4] = u8((h32      ));
            target[j + 5] = u8((h32 >> 8 ));
            target[j + 6] = u8((h32 >> 16));
            target[j + 7] = u8((h32 >> 24));
        }
    } else {
        for (let i: number = sourceStart, j: number = targetStart; i + 2 <= sourceEnd && j + 8 <= targetEnd; i += 2, j += 8) {
            const l32: number = l64l32(source, i);
            const h32: number = l64h32(source, i);

            target[j + 7] = u8((l32      ));
            target[j + 6] = u8((l32 >> 8 ));
            target[j + 5] = u8((l32 >> 16));
            target[j + 4] = u8((l32 >> 24));
            target[j + 3] = u8((h32      ));
            target[j + 2] = u8((h32 >> 8 ));
            target[j + 1] = u8((h32 >> 16));
            target[j    ] = u8((h32 >> 24));
        }
    }
    return target;
}

export default u64enc;
