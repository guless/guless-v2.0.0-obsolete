/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import RMD128 from "@/crypto/RMD128";
import TextEncoder from "@/text/TextEncoder";
import hexdmp from "@/buffer/hexdmp";

function rmd128test(input: string, result: string): void {
    test(`"${input}" => "${result}"`, () => {
        const rmd128: RMD128 = new RMD128();
        const block: Uint8Array = new TextEncoder().encode(input);

        rmd128.update(block);
        const digest: Uint8Array = rmd128.final();

        expect(hexdmp(digest)).toBe(result);
    });
}

rmd128test("", "cdf26213a150dc3ecb610f18f6b38b46");
rmd128test("a", "86be7afa339d0fc7cfc785e72f578d33");
rmd128test("abc", "c14a12199c66e4ba84636b0f69144c77");
rmd128test("message digest", "9e327b3d6e523062afc1132d7df9d1b8");
rmd128test("abcdefghijklmnopqrstuvwxyz", "fd2aa607f71dc8f510714922b371834e");
rmd128test("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "d1e959eb179c911faea4624c60c5c702");
rmd128test("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "3f45ef194732c2dbb2c4a2c769795fa3");
