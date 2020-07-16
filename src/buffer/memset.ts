/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function memset<T extends Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Uint8ClampedArray | Float32Array | Float64Array>(source: T, value: number, sourceStart: number = 0, sourceEnd: number = source.length): typeof source {
    if (typeof source.fill === "function") {
        source.fill(value, sourceStart, sourceEnd);
    } else {
        for (let i: number = sourceStart; i < sourceEnd; ++i) {
            source[i] = value;
        }
    }

    return source;
}

export default memset;
