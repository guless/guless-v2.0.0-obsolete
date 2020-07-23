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
type i64 = l64vec;
type u64 = l64vec;

type i8vec  = vec<i8 >;
type i16vec = vec<i16>;
type i32vec = vec<i32>;
type u8vec  = vec<u8 >;
type u16vec = vec<u16>;
type u32vec = vec<u32>;
type f32vec = vec<f32>;
type f64vec = vec<f64>;
type i64vec = l64vec;
type u64vec = l64vec;

interface l64vec extends u32vec {
    __IS_BIT64__: true;
    __UNSIGNED__: boolean;
}

interface vec<T extends i8 | i16 | i32 | u8 | u16 | u32 | f32 | f64> {
    readonly length: number;
    [index: number]: T;
}

const __HAS_TYPED_ARRAY__: boolean = (typeof Uint8Array === "function");
const __HAS_MATH_FROUND__: boolean = (typeof Math.fround === "function");
const __F32_TYPE_CASTER__: null | Float32Array = (__HAS_TYPED_ARRAY__ && __HAS_MATH_FROUND__) ? new Float32Array(1) : null;
const __U32_BYTES_ORDER__: null | Uint8Array = (__HAS_TYPED_ARRAY__) ? new Uint8Array(new Uint32Array([0x12345678]).buffer) : null;
const __LITTLE_ENDIAN__  : boolean = __U32_BYTES_ORDER__ 
    ? __U32_BYTES_ORDER__[0] === 0x78 && __U32_BYTES_ORDER__[1] === 0x56 && __U32_BYTES_ORDER__[2] === 0x34 && __U32_BYTES_ORDER__[3] === 0x12
    : true;

function i8(x: number | l64vec): i8 {
    return ((typeof x === "number" ? x : l64l32(x)) << 24 >> 24);
}

function i16(x: number | l64vec): i16 {
    return ((typeof x === "number" ? x : l64l32(x)) << 16 >> 16);
}

function i32(x: number | l64vec): i32 {
    return ((typeof x === "number" ? x : l64l32(x)) | 0);
}

function u8(x: number | l64vec): u8 {
    return ((typeof x === "number" ? x : l64l32(x)) & 0xFF);
}

function u16(x: number | l64vec): u16 {
    return ((typeof x === "number" ? x : l64l32(x)) & 0xFFFF);
}

function u32(x: number | l64vec): u32 {
    return ((typeof x === "number" ? x : l64l32(x)) >>> 0);
}

function f32(x: number | l64vec): f32 {
    return f32rnd((typeof x === "number" ? x : l64val(x)));
}

function f64(x: number | l64vec): f64 {
    return (typeof x === "number" ? x : l64val(x));
}

function i64(x: number | [number, number] | l64vec): i64 {
    return l64cnv(l64alc(1, false), x);
}

function u64(x: number | [number, number] | l64vec): u64 {
    return l64cnv(l64alc(1, true), x);
}

function i8vec(buffer: number | Array<number>): i8vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Int8Array(buffer as number);
    }

    if (typeof buffer === "number") {
        return memset(new Array<i8>(buffer), 0);
    }

    return buffer.map(value => i8(value));
}

function i16vec(buffer: number | Array<number>): i16vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Int16Array(buffer as number);
    }

    if (typeof buffer === "number") {
        return memset(new Array<i16>(buffer), 0);
    }

    return buffer.map(value => i16(value));
}

function i32vec(buffer: number | Array<number>): i32vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Int32Array(buffer as number);
    }

    if (typeof buffer === "number") {
        return memset(new Array<i32>(buffer), 0);
    }

    return buffer.map(value => i32(value));
}

function u8vec(buffer: number | Array<number>): u8vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Uint8Array(buffer as number);
    }

    if (typeof buffer === "number") {
        return memset(new Array<u8>(buffer), 0);
    }

    return buffer.map(value => u8(value));
}

function u16vec(buffer: number | Array<number>): u16vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Uint16Array(buffer as number);
    }

    if (typeof buffer === "number") {
        return memset(new Array<u16>(buffer), 0);
    }

    return buffer.map(value => u16(value));
}

function u32vec(buffer: number | Array<number>): u32vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Uint32Array(buffer as number);
    }

    if (typeof buffer === "number") {
        return memset(new Array<u32>(buffer), 0);
    }

    return buffer.map(value => u32(value));
}

function f32vec(buffer: number | Array<number>): f32vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Float32Array(buffer as number);
    }

    if (typeof buffer === "number") {
        return memset(new Array<f32>(buffer), 0);
    }

    return buffer.map(value => f32(value));
}

function f64vec(buffer: number | Array<number>): f64vec {
    if (__HAS_TYPED_ARRAY__) {
        return new Float64Array(buffer as number);
    }

    if (typeof buffer === "number") {
        return memset(new Array<f64>(buffer), 0);
    }

    return buffer.map(value => f64(value));
}

function i64vec(buffer: number | Array<number> | Array<[number, number]> | Array<l64vec>): i64vec {
    if (typeof buffer === "number") {
        return l64alc(buffer, false);
    }

    const v: l64vec = l64alc(buffer.length, false);

    for (let i: number = 0, j: number = 0; i + 2 < v.length && j < buffer.length; i += 2, ++j) {
        l64cnv(v, buffer[j], i);
    }

    return v;
}

function u64vec(buffer: number | Array<number> | Array<[number, number]> | Array<l64vec>): u64vec {
    if (typeof buffer === "number") {
        return l64alc(buffer, true);
    }

    const v: l64vec = l64alc(buffer.length, true);

    for (let i: number = 0, j: number = 0; i + 2 < v.length && j < buffer.length; i += 2, ++j) {
        l64cnv(v, buffer[j], i);
    }

    return v;
}

function f32rnd(x: number): f32 {
    if (__HAS_MATH_FROUND__) { return Math.fround(x); }
    if (__F32_TYPE_CASTER__ !== null) { __F32_TYPE_CASTER__[0] = x; return __F32_TYPE_CASTER__[0]; }

    if (x === 0 || isNaN(x)) {
        return x;
    }

    const sign: number = x < 0 ? -1 : 1;

    if (sign === -1) {
        x = -x;
    }

    const e: number = Math.floor(Math.log(x) / Math.LN2);
    const p: number = Math.pow(2, Math.max(-126, Math.min(e, 127)));
    const l: number = e < -127 ? 0 : 1;
    const m: number = Math.round((l - x / p) * 0x800000);

    if (m <= -0x800000) {
        return sign * Infinity;
    }

    return sign * p * (l - m / 0x800000);
}

function l64tst(x: vec<i8 | i16 | i32 | u8 | u16 | u32 | f32 | f64>): x is l64vec {
    return ((x as any as l64vec).__IS_BIT64__ === true);
}

function l64alc(n: number, unsgined: boolean): l64vec {
    const v: u32vec = u32vec(n * 2);

    (v as l64vec).__IS_BIT64__ = true;
    (v as l64vec).__UNSIGNED__ = unsgined;

    return (v as l64vec);
}

function l64l32(v: l64vec, i: number = 0): u32 {
    return (__LITTLE_ENDIAN__ ? v[i] : v[i + 1]);
}

function l64h32(v: l64vec, i: number = 0): u32 {
    return (__LITTLE_ENDIAN__? v[i + 1] : v[i]);
}

function l64set(v: l64vec, l32: u32, h32: u32, i: number = 0): l64vec {
    if (__LITTLE_ENDIAN__) {
        v[i] = l32;
        v[i + 1] = h32;
    } else {
        v[i] = h32;
        v[i + 1] = l32;
    }
    return v;
}

function l64cpy(v: l64vec, x: l64vec, i: number = 0, j: number = 0): l64vec {
    v[i] = x[j];
    v[i + 1] = x[j + 1];
    return v;
}

function l64rnd(v: l64vec, x: number, i: number = 0): l64vec {
    const l32: number = u32(x);
    const h32: number = u32(Math.floor((x - l32) / 4294967296));

    return l64set(v, l32, h32, i);
}

function l64cnv(v: l64vec, x: number | [number, number] | l64vec, i: number = 0): l64vec {
    if (typeof x === "number") {
        return l64rnd(v, x, i);
    }

    if (l64tst(x)) {
        return l64cpy(v, x, i);
    }

    return l64set(v, x[0], x[1], i);
}

function l64val(v: l64vec, i: number = 0): f64 {
    let l32: u32 = l64l32(v, i);
    let h32: u32 = l64h32(v, i);

    if (v.__UNSIGNED__) {
        return h32 * 4294967296 * l32;
    }

    const sign: number = (h32 & 0x80000000) === 0 ? 1 : -1;

    if (sign === -1) {
        l32 = u32(~l32 + 1);
        h32 = l32 === 0 ? u32(~h32 + 1) : u32(~h32);
    }

    return sign * (h32 * 4294967296 + l32);
}

export { i8, i16, i32, u8, u16, u32, f32, f64, i64, u64 };
export { i8vec, i16vec, i32vec, u8vec, u16vec, u32vec, f32vec, f64vec, i64vec, u64vec };
export { l64tst, l64cnv };
