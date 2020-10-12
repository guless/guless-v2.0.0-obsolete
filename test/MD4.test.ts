/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import MD4 from "@/crypto/MD4";
import TextEncoder from "@/text/TextEncoder";
import hexdmp from "@/buffer/hexdmp";

function md4test(input: string, result: string): void {
    test(`"${input}" => "${result}"`, () => {
        const md4: MD4 = new MD4();
        const block: Uint8Array = new TextEncoder().encode(input);

        md4.update(block);
        const digest: Uint8Array = md4.final();

        expect(hexdmp(digest)).toBe(result);
    });
}

md4test("", "31d6cfe0d16ae931b73c59d7e0c089c0");
md4test("a", "bde52cb31de33e46245e05fbdbd6fb24");
md4test("abc", "a448017aaf21d8525fc10ae87aa6729d");
md4test("message digest", "d9130a8164549fe818874806e1c7014b");
md4test("abcdefghijklmnopqrstuvwxyz", "d79e1c308aa5bbcdeea8ed63df412da9");
md4test("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "043f8582f241db351ce627e153e7f0e4");
md4test("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "e33b4ddc9c38f2199c3e7b164fcc0536");
