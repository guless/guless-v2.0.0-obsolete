/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import memcpy from "./memcpy";

function memseg<T extends Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Float32Array | Float64Array>(source: T, targets: T[], sourceStart: number = 0, sourceEnd: number = source.length, targetIdStart: number = 0, targetIdEnd: number = targets.length, targetOffset: number = 0): void {
    for (let i: number = targetIdStart; i < targetIdEnd && sourceStart < sourceEnd; ++i, targetOffset = 0) {
        const target: T = targets[i];

        memcpy(source, target, sourceStart, sourceEnd, targetOffset, target.length);
        sourceStart += Math.min(target.length - targetOffset, sourceEnd - sourceStart);
    }
}

export default memseg;
