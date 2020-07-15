/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import TypedArray from "./TypedArray";

function strget<T extends TypedArray>(source: T, sourceStart: number = 0, sourceEnd: number = source.length): string {
    let target: string = "";
    for (let i: number = sourceStart; i < sourceEnd; ++i) {
        target += String.fromCharCode(source[i]);
    }
    return target;
}

export default strget;
