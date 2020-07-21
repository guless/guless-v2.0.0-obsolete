
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import memset from "./memset";

type i8  = number;
type i16 = number;
type i32 = number;
type u8  = number;
type u16 = number;
type u32 = number;
type f32 = number;
type f64 = number;

interface vec<T extends i8 | i16 | i32 | u8 | u16 | u32 | f32 | f64> {
    readonly length: number;
    [index: number]: T;
}

type i8vec = vec<i8>;
type i16vec = vec<i16>;
type i32vec = vec<i32>;
type u8vec = vec<u8>;
type u16vec = vec<u16>;
type u32vec = vec<u32>;
type f32vec = vec<f32>;
type f64vec = vec<f64>;

function i8(x: number): i8 {
    return ((x) << 24 >> 24);
}

function i16(x: number): i16 {
    return ((x) << 16 >> 16);
}

function i32(x: number): i32 {
    return ((x) >> 0);
}

function u8(x: number): u8 {
    return ((x) & 0xFF);
}

function u16(x: number): u16 {
    return ((x) & 0xFFFF);
}

function u32(x: number): u32 {
    return ((x) >>> 0);
}

function f32(x: number): f32 {
    return x;
}

function f64(x: number): f64 {
    return x;
}

function i8vec(args: number | Array<number>): i8vec {
    if (typeof Int8Array === "function") {
        return new Int8Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<i8>(args), 0);
    }

    return args.map(value => i8(value));
}

function i16vec(args: number | Array<number>): i16vec {
    if (typeof Int16Array === "function") {
        return new Int16Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<i16>(args), 0);
    }

    return args.map(value => i16(value));
}

function i32vec(args: number | Array<number>): i32vec {
    if (typeof Int32Array === "function") {
        return new Int32Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<i32>(args), 0);
    }

    return args.map(value => i32(value));
}

function u8vec(args: number | Array<number>): u8vec {
    if (typeof Uint8Array === "function") {
        return new Uint8Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<u8>(args), 0);
    }

    return args.map(value => u8(value));
}

function u16vec(args: number | Array<number>): u16vec {
    if (typeof Uint16Array === "function") {
        return new Uint16Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<u16>(args), 0);
    }

    return args.map(value => u16(value));
}

function u32vec(args: number | Array<number>): u32vec {
    if (typeof Uint32Array === "function") {
        return new Uint32Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<u32>(args), 0);
    }

    return args.map(value => u32(value));
}

function f32vec(args: number | Array<number>): f32vec {
    if (typeof Float32Array === "function") {
        return new Float32Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<f32>(args), 0);
    }

    return args.map(value => f32(value));
}

function f64vec(args: number | Array<number>): f64vec {
    if (typeof Float64Array === "function") {
        return new Float64Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<f64>(args), 0);
    }

    return args.map(value => f64(value));
}

export { i8, i16, i32, u8, u16, u32, f32, f64 };
export { i8vec, i16vec, i32vec, u8vec, u16vec, u32vec, f32vec, f64vec };
