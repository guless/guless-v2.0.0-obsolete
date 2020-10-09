/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import SYSTEM_ENDIANNESS from "@/platform/endianness";
import { read, write } from "@/buffer/IEEE754";

test("float32 read & write", () => {
    const input: number = Math.random();
    const float32: Float32Array = new Float32Array([input]);
    const buffer: Uint8Array = new Uint8Array(float32.buffer);
    const readResult: number = read(buffer, 0, SYSTEM_ENDIANNESS, 23, 4);
    const writeResult: Uint8Array = new Uint8Array(4);

    write(writeResult, input, 0, SYSTEM_ENDIANNESS, 23, 4);
    expect(readResult).toBe(float32[0]);
    expect(writeResult).toEqual(buffer);
});

test("float64 read & write", () => {
    const input: number = Math.random();
    const float64: Float64Array = new Float64Array([input]);
    const buffer: Uint8Array = new Uint8Array(float64.buffer);
    const readResult: number = read(buffer, 0, SYSTEM_ENDIANNESS, 52, 8);
    const writeResult: Uint8Array = new Uint8Array(8);

    write(writeResult, input, 0, SYSTEM_ENDIANNESS, 52, 8);
    expect(readResult).toBe(float64[0]);
    expect(writeResult).toEqual(buffer);
});
