/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { i8, i16, i32, u8, u16, u32, f32, f64, i64, u64 } from "@/buffer/ctypes";
import { i8vec, i16vec, i32vec, u8vec, u16vec, u32vec, f32vec, f64vec, i64vec, u64vec } from "@/buffer/ctypes";

const i8val : i8  = i8 (0xFF      );
const u8val : u8  = u8 (0xFF      );
const i16val: i16 = i16(0xFFFF    );
const u16val: u16 = u16(0xFFFF    );
const i32val: i32 = i32(0xFFFFFFFF);
const u32val: u32 = u32(0xFFFFFFFF);
const i64val: i64 = i64([0xFFFFFFFF, 0xFFFFFFFF]);
const u64val: u64 = u64([0xFFFFFFFF, 0xFFFFFFFF]);

console.log(i8val, u8val);
console.log(i16val, u16val);
console.log(i32val, u32val);
console.log(i64val, u64val);
console.log(f64(i64val), f64(u64val));
console.log(f32(i64val), f32(u64val));
