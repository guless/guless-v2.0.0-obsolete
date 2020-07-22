/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { i64, u64, f32, f64, i8, u8, i16, i32, u16, u32, i64vec, u64vec } from "@/buffer/ctypes";
import memset from "@/buffer/memset";
import memcpy from "@/buffer/memcpy";

const m1: i64 = i64([0x01234567, 0x89abcdef]);
const m2: u64 = u64([0xfedeba98, 0x76543210]);
const v1: i64vec = i64vec([m1, m2]);
const v2: u64vec = u64vec([m1, m2]);

console.log(m1, m2);
console.log(v1, v2);

console.log("int8:", i8(m1), i8(m2));
console.log("int16:", i16(m1), i16(m2));
console.log("int32:", i32(m1), i32(m2));
console.log("uint8:", u8(m1), u8(m2));
console.log("uint16:", u16(m1), u16(m2));
console.log("uint32:", u32(m1), u32(m2));
console.log("float32:", f32(m1), f32(m2));
console.log("float64:", f64(m1), f64(m2));

// console.log(i64vec(10), u64vec(10));
// console.log(i64vec([-1, -2]), u64vec([-1, -2]))
// console.log(i64vec([1, 2, 3, 4, 5]), u64vec([1, 2, 3, 4, 5]));

// const v1: i64vec = i64vec(10);
// const v2: u64vec = u64vec(10);

// console.log("v1:", v1);
// console.log("v2:", v2);

// memset(v1, -1, 0, 2);
// memset(v2, -1);
// memcpy(v1, v1, 0, 2, 2, 4);

// console.log("v1:", v1);
// console.log("v2:", v2);


