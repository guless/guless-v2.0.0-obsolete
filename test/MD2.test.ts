/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import MD2 from "@/crypto/MD2";
import TextEncoder from "@/text/TextEncoder";
import hexdmp from "@/buffer/hexdmp";

function md2test(input: string, result: string): void {
    test(`"${input}" => "${result}"`, () => {
        const md2: MD2 = new MD2();
        const block: Uint8Array = new TextEncoder().encode(input);

        md2.update(block);
        const digest: Uint8Array = md2.final();

        expect(hexdmp(digest)).toBe(result);
    });
}

md2test("", "8350e5a3e24c153df2275c9f80692773");
md2test("a", "32ec01ec4a6dac72c0ab96fb34c0b5d1");
md2test("abc", "da853b0d3f88d99b30283a69e6ded6bb");
md2test("message digest", "ab4f496bfb2a530b219ff33031fe06b0");
md2test("abcdefghijklmnopqrstuvwxyz", "4e8ddff3650292ab5a4108c3aa47940b");
md2test("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "da33def2a42df13975352846c30338cd");
md2test("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "d5976f79d83d3a0dc9806c3c66f3efd8");
