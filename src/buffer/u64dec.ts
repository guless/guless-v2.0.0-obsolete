/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { u32, u8vec, u64vec } from "./ctypes";
import { l64set } from "./ctypes";

function u64dec(source: u8vec, target: u64vec, littleEndian: boolean = true, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): typeof target {
    if (littleEndian) {
        for (let i: number = sourceStart, j: number = targetStart; i + 8 <= sourceEnd && j + 2 <= targetEnd; i += 4, j += 4) {
            const l32: u32 = u32((source[i    ]) | (source[i + 1] << 8) | (source[i + 2] << 16) | (source[i + 3] << 24));
            const h32: u32 = u32((source[i + 4]) | (source[i + 5] << 8) | (source[i + 6] << 16) | (source[i + 7] << 24));

            l64set(target, l32, h32, j);
        }
    } else {
        for (let i: number = sourceStart, j: number = targetStart; i + 8 <= sourceEnd && j + 2 <= targetEnd; i += 4, j += 4) {
            const l32: u32 = u32((source[i + 7]) | (source[i + 6] << 8) | (source[i + 5] << 16) | (source[i + 4] << 24));
            const h32: u32 = u32((source[i + 3]) | (source[i + 2] << 8) | (source[i + 1] << 16) | (source[i    ] << 24));

            l64set(target, l32, h32, j);
        }

    }
    return target;
}

export default u64dec;
