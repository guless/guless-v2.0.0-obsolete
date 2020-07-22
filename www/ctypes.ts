/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { i64, u64, f32, f64, i8, u8, i16, i32, u16, u32, i64vec, u64vec } from "@/buffer/ctypes";

const m1: i64 = i64(-1);
const m2: u64 = u64(-1);

console.log(m1, m2);
console.log("int8:", i8(m1), i8(m2));
console.log("int16:", i16(m1), i16(m2));
console.log("int32:", i32(m1), i32(m2));
console.log("uint8:", u8(m1), u8(m2));
console.log("uint16:", u16(m1), u16(m2));
console.log("uint32:", u32(m1), u32(m2));
console.log("float32:", f32(m1), f32(m2));
console.log("float64:", f64(m1), f64(m2));

console.log(i64vec(10), u64vec(10));
console.log(i64vec([-1, -2]), u64vec([-1, -2]))
console.log(i64vec([1, 2, 3, 4, 5]), u64vec([1, 2, 3, 4, 5]));
