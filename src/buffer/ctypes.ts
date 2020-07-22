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
type i64 = u32vec;
type u64 = u32vec;

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
type i64vec = vec<u32>;
type u64vec = vec<u32>;

const __HAS_TYPED_ARRAY__: boolean = (typeof Uint8Array === "function");
const __HAS_MATH_FROUND__: boolean = (typeof Math.fround === "function");
const __F32_TYPE_CAST__: null | Float32Array = (__HAS_TYPED_ARRAY__ && __HAS_MATH_FROUND__) ? new Float32Array(1) : null;
const __U32_CHECK_ENDIAN__: null | Uint8Array = (__HAS_TYPED_ARRAY__) ? new Uint8Array(new Uint32Array([0x12345678]).buffer) : null;
const __IS_LITTLE_ENDIAN__: boolean = __U32_CHECK_ENDIAN__ 
    ? __U32_CHECK_ENDIAN__[0] === 0x78 && __U32_CHECK_ENDIAN__[1] === 0x56 && __U32_CHECK_ENDIAN__[2] === 0x34 && __U32_CHECK_ENDIAN__[3] === 0x12
    : true;
const __IS_BIG_ENDIAN__: boolean = __U32_CHECK_ENDIAN__ 
    ? __U32_CHECK_ENDIAN__[0] === 0x12 && __U32_CHECK_ENDIAN__[1] === 0x34 && __U32_CHECK_ENDIAN__[2] === 0x56 && __U32_CHECK_ENDIAN__[3] === 0x78
    : false;

function i8(x: number | i64 | u64): i8 {
    if (typeof x !== "number") {
        x = l64l32(x, 0, true);
    }

    return ((x) << 24 >> 24);
}

function i16(x: number | i64 | u64): i16 {
    if (typeof x !== "number") {
        x = l64l32(x, 0, true);
    }

    return ((x) << 16 >> 16);
}

function i32(x: number | i64 | u64): i32 {
    if (typeof x !== "number") {
        x = l64l32(x, 0, true);
    }

    return ((x) >> 0);
}

function u8(x: number | i64 | u64): u8 {
    if (typeof x !== "number") {
        x = l64l32(x, 0, true);
    }

    return ((x) & 0xFF);
}

function u16(x: number | i64 | u64): u16 {
    if (typeof x !== "number") {
        x = l64l32(x, 0, true);
    }

    return ((x) & 0xFFFF);
}

function u32(x: number | i64 | u64): u32 {
    if (typeof x !== "number") {
        x = l64l32(x, 0, true);
    }

    return ((x) >>> 0);
}

function f32(x: number | i64 | u64): f32 {
    if (typeof x !== "number") {
        x = l64l32(x, 0);
    }

    if (__HAS_MATH_FROUND__) {
        return Math.fround(x);
    }

    if (__F32_TYPE_CAST__ !== null) {
        return (__F32_TYPE_CAST__[0] = x);
    }

    if (x === 0 || isNaN(x)) {
        return x;
    }

    const sign: number = x < 0 ? -1 : 1; x *= sign;
    const exp: number = Math.floor(Math.log(x) / Math.LN2);
    const pow: number = Math.pow(2, Math.max(-126, Math.min(exp, 127)));
    const leading = exp < -127 ? 0 : 1;
    const mantissa = Math.round((leading - x / pow) * 0x800000);

    if (mantissa <= -0x800000) {
        return sign * Infinity;
    }

    return sign * pow * (leading - mantissa / 0x800000);
}

function f64(x: number | i64 | u64): f64 {
    if (typeof x !== "number") {
        return l64value(x, 0);
    }

    return x;
}

function i64(x: number | i64 | u64 | [number, number]): i64 {
    const v: u32vec = u32vec(2);

    (v as any)["__IS_BIT64__"] = true;
    (v as any)["__UNSIGNED__"] = false;

    if (typeof x === "number") {
        return l64parse(v, x, 0/*<, false >*/);
    } else {
        let l32: u32;
        let h32: u32;

        if ((x as any)["__IS_BIT64__"]) {
            l32 = l64l32(x, 0, true);
            h32 = l64h32(x, 0, true);
        } else {
            l32 = u32(x[0]);
            h32 = u32(x[1]);
        }

        return l64join(v, l32, h32, 0/*<, false >*/);
    }
}

function u64(x: number | i64 | u64 | [number, number]): u64 {
    const v: u32vec = u32vec(2);

    (v as any)["__IS_BIT64__"] = true;
    (v as any)["__UNSIGNED__"] = true;

    if (typeof x === "number") {
        return l64parse(v, x, 0/*<, true >*/);
    } else {
        let l32: u32;
        let h32: u32;

        if ((x as any)["__IS_BIT64__"]) {
            l32 = l64l32(x, 0, true);
            h32 = l64h32(x, 0, true);
        } else {
            l32 = u32(x[0]);
            h32 = u32(x[1]);
        }

        return l64join(v, l32, h32, 0/*<, true >*/);
    }
}

function i8vec(args: number | Array<number>): i8vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Int8Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<i8>(args), 0);
    }

    return args.map(value => i8(value));
}

function i16vec(args: number | Array<number>): i16vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Int16Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<i16>(args), 0);
    }

    return args.map(value => i16(value));
}

function i32vec(args: number | Array<number>): i32vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Int32Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<i32>(args), 0);
    }

    return args.map(value => i32(value));
}

function u8vec(args: number | Array<number>): u8vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Uint8Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<u8>(args), 0);
    }

    return args.map(value => u8(value));
}

function u16vec(args: number | Array<number>): u16vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Uint16Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<u16>(args), 0);
    }

    return args.map(value => u16(value));
}

function u32vec(args: number | Array<number>): u32vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Uint32Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<u32>(args), 0);
    }

    return args.map(value => u32(value));
}

function f32vec(args: number | Array<number>): f32vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Float32Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<f32>(args), 0);
    }

    return args.map(value => f32(value));
}

function f64vec(args: number | Array<number>): f64vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Float64Array(args as Array<number>);
    }

    if (typeof args === "number") {
        return memset(new Array<f64>(args), 0);
    }

    return args.map(value => f64(value));
}

function i64vec(args: number | Array<number> | Array<i64 | u64> | Array<[number, number]>): i64vec {
    let v: i64vec;

    if (typeof args === "number") {
        if (__HAS_TYPED_ARRAY__) {
            v = new Uint32Array(args * 2);
        } else {
            v = memset(new Array<u32>(args * 2), 0);
        }
    } else {
        if (__HAS_TYPED_ARRAY__) {
            v = new Uint32Array(args.length * 2);
        } else {
            v = new Array<u32>(args.length * 2);
        }

        for (let i: number = 0, j: number = 0; i + 2 <= v.length && j < args.length; i += 2, ++j) {
            if (typeof args[j] === "number") {
                l64parse(v, args[j] as number, i/*<, false >*/);
            } else {
                const x = args[j] as [number, number];

                let l32: u32;
                let h32: u32;

                if ((x as any)["__IS_BIT64__"]) {
                    l32 = l64l32(x, 0, true);
                    h32 = l64h32(x, 0, true);
                } else {
                    l32 = u32(x[0]);
                    h32 = u32(x[1]);
                }

                l64join(v, l32, h32, i/*<, false >*/);
            }
        }
    }

    (v as any)["__IS_BIT64__"] = true;
    (v as any)["__UNSIGNED__"] = false;

    return v;
}

function u64vec(args: number | Array<number> | Array<i64 | u64> | Array<[number, number]>): u64vec {
    let v: u64vec;

    if (typeof args === "number") {
        if (__HAS_TYPED_ARRAY__) {
            v = new Uint32Array(args * 2);
        } else {
            v = memset(new Array<u32>(args * 2), 0);
        }
    } else {
        if (__HAS_TYPED_ARRAY__) {
            v = new Uint32Array(args.length * 2);
        } else {
            v = new Array<u32>(args.length * 2);
        }

        for (let i: number = 0, j: number = 0; i + 2 <= v.length && j < args.length; i += 2, ++j) {
            if (typeof args[j] === "number") {
                l64parse(v, args[j] as number, i/*<, true >*/);
            } else {
                const x = args[j] as [number, number];

                let l32: u32;
                let h32: u32;

                if ((x as any)["__IS_BIT64__"]) {
                    l32 = l64l32(x, 0, true);
                    h32 = l64h32(x, 0, true);
                } else {
                    l32 = u32(x[0]);
                    h32 = u32(x[1]);
                }

                l64join(v, l32, h32, i/*<, true >*/);
            }
        }
    }

    (v as any)["__IS_BIT64__"] = true;
    (v as any)["__UNSIGNED__"] = true;

    return v;
}

function l64join(v: u32vec, l32: u32, h32: u32, i: number = 0/*<, unsigned: boolean = (v as any)["__UNSIGNED__"]>*/): u32vec {
    if (__IS_LITTLE_ENDIAN__) {
        v[i] = l32;
        v[i + 1] = h32;
    } else {
        v[i] = h32;
        v[i + 1] = l32;
    }

    return v;
}

function l64parse(v: u32vec, x: number, i: number = 0/*<, unsigned: boolean = (v as any)["__UNSIGNED__"]>*/): u32vec {
    const l32: number = u32(x);
    const h32: number = u32(Math.floor((x - l32) / 4294967296));

    return l64join(v, l32, h32, i/*<, unsigned>*/)
}

function l64value(v: u32vec, i: number = 0, unsigned: boolean = (v as any)["__UNSIGNED__"]): number {
    let l32: number;
    let h32: number;

    if (__IS_LITTLE_ENDIAN__) {
        l32 = v[i];
        h32 = v[i + 1];
    } else {
        h32 = v[i];
        l32 = v[i + 1];
    }

    if (unsigned) {
        return h32 * 4294967296 + l32;
    }

    const sign: number = (h32 & 0x80000000) === 0 ? 1 : -1;

    if (sign === -1) {
        l32 = u32(~l32 + 1);
        h32 = l32 === 0 ? u32(~h32 + 1) : u32(~h32);
    }

    return sign * (h32 * 4294967296 + l32);
}

function l64l32(v: u32vec, i: number = 0, unsigned: boolean = (v as any)["__UNSIGNED__"]): number {
    if (unsigned) {
        return (__IS_LITTLE_ENDIAN__ ? v[i] : v[i + 1]);
    }

    let l32: number;
    let h32: number;

    if (__IS_LITTLE_ENDIAN__) {
        l32 = v[i];
        h32 = v[i + 1];
    } else {
        h32 = v[i];
        l32 = v[i + 1];
    }

    const sign: number = (h32 & 0x80000000) === 0 ? 1 : -1;

    if (sign === -1) {
        l32 = u32(~l32 + 1);
    }

    return sign * l32;
}

function l64h32(v: u32vec, i: number = 0, unsigned: boolean = (v as any)["__UNSIGNED__"]): number {
    if (unsigned) {
        return (__IS_LITTLE_ENDIAN__ ? v[i + 1] : v[i]);
    }

    let l32: number;
    let h32: number;

    if (__IS_LITTLE_ENDIAN__) {
        l32 = v[i];
        h32 = v[i + 1];
    } else {
        h32 = v[i];
        l32 = v[i + 1];
    }

    const sign: number = (h32 & 0x80000000) === 0 ? 1 : -1;

    if (sign === -1) {
        l32 = u32(~l32 + 1);
        h32 = l32 === 0 ? u32(~h32 + 1) : u32(~h32);
    }

    return sign * h32;
}

function i32rotl(x: number, n: number): i32 {
    return (((x) << (n)) | ((x) >>> (32 - (n))));
}

function i32rotr(x: number, n: number): i32 {
    return (((x) << (32 - (n))) | ((x) >>> (n)));
}

export const isLittleEndian: boolean = __IS_LITTLE_ENDIAN__;
export const isBigEndian: boolean = __IS_BIG_ENDIAN__;
export { i8, i16, i32, u8, u16, u32, f32, f64, i64, u64 };
export { i8vec, i16vec, i32vec, u8vec, u16vec, u32vec, f32vec, f64vec, i64vec, u64vec };
export { l64l32, l64h32, l64join, l64parse, l64value };
export { i32rotl, i32rotr };
