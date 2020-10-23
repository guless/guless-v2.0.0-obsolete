/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import TextEncoder from "@/text/TextEncoder";
import TextDecoder from "@/text/TextDecoder";
import createUint8Array from "@/buffer/createUint8Array";

test("encode & decode", () => {
    const source: string = "123abc$£¥中国😄";
    const expected: Uint8Array = createUint8Array([49, 50, 51, 97, 98, 99, 36, 194, 163, 194, 165, 228, 184, 173, 229, 155, 189, 240, 159, 152, 132]);

    expect(new TextEncoder().encode(source)).toEqual(expected);
    expect(new TextDecoder().decode(expected)).toBe(source);
});
