/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function memcpy<T extends Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Uint8ClampedArray | Float32Array | Float64Array>(source: T, target: T, sourceStart: number = 0, sourceEnd: number = source.length, targetStart: number = 0, targetEnd: number = target.length): typeof target {
    if (typeof source.subarray === "function" && typeof target.set === "function") {
        sourceEnd -= Math.max(0, (sourceEnd - sourceStart) - (targetEnd - targetStart));

        if (sourceStart === 0 && sourceEnd === source.length) {
            target.set(source, targetStart);
        } else if (sourceEnd > sourceStart) {
            target.set(source.subarray(sourceStart, sourceEnd), targetStart);
        }
    } else {
        for (let i: number = sourceStart, j: number = targetStart; i < sourceEnd && j < targetEnd; ++i, ++j) {
            target[j] = source[i];
        }
    }

    return target;
}

export default memcpy;
