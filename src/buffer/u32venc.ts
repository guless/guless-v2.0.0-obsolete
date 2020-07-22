/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { u8, u8vec, u32vec } from "./types";

function u32venc(source: u32vec, target: u8vec, littleEndian: boolean = true, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): typeof target {
    if (littleEndian) {
        for (let i: number = sourceStart, j: number = targetStart; i < sourceEnd && j + 4 <= targetEnd; ++i, j += 4) {
            target[j    ] = u8((source[i]      ));
            target[j + 1] = u8((source[i] >> 8 ));
            target[j + 2] = u8((source[i] >> 16));
            target[j + 3] = u8((source[i] >> 24));
        }
    } else {
        for (let i: number = sourceStart, j: number = targetStart; i < sourceEnd && j + 4 <= targetEnd; ++i, j += 4) {
            target[j    ] = u8((source[i] >> 24));
            target[j + 1] = u8((source[i] >> 16));
            target[j + 2] = u8((source[i] >> 8 ));
            target[j + 3] = u8((source[i]      ));
        }
    }
    return target;
}

export default u32venc;
