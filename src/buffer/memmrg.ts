/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import memcpy from "./memcpy";

function memmrg<T extends Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Float32Array | Float64Array>(sources: T[], target: T, sourceIdStart: number = 0, sourceIdEnd: number = sources.length, sourceOffset: number = 0, targetStart: number = 0, targetEnd: number = target.length): void {
    for (let i: number = sourceIdStart; i < sourceIdEnd && targetStart < targetEnd; ++i, sourceOffset = 0) {
        const source: T = sources[i];

        memcpy(source, target, sourceOffset, source.length, targetStart, targetEnd);
        targetStart += Math.min(targetEnd - targetStart, source.length - sourceOffset);
    }
}

export default memmrg;
