/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import RMD160 from "@/crypto/RMD160";
import TextEncoder from "@/text/TextEncoder";
import hexdmp from "@/buffer/hexdmp";

function rmd160test(input: string, result: string): void {
    test(`"${input}" => "${result}"`, () => {
        const rmd160: RMD160 = new RMD160();
        const block: Uint8Array = new TextEncoder().encode(input);

        rmd160.update(block);
        const digest: Uint8Array = rmd160.final();

        expect(hexdmp(digest)).toBe(result);
    });
}

rmd160test("", "9c1185a5c5e9fc54612808977ee8f548b2258d31");
rmd160test("a", "0bdc9d2d256b3ee9daae347be6f4dc835a467ffe");
rmd160test("abc", "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc");
rmd160test("message digest", "5d0689ef49d2fae572b881b123a85ffa21595f36");
rmd160test("abcdefghijklmnopqrstuvwxyz", "f71c27109c692c1b56bbdceb5b9d2865b3708dbc");
rmd160test("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "b0e20b6e3116640286ed3a87a5713079b21f5189");
rmd160test("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "9b752e45573d4b39f4dbd3323cab82bf63326bfb");
