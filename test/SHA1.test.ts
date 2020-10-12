/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import SHA1 from "@/crypto/SHA1";
import TextEncoder from "@/text/TextEncoder";
import hexdmp from "@/buffer/hexdmp";

function sha1test(input: string, result: string): void {
    test(`"${input}" => "${result}"`, () => {
        const sha1: SHA1 = new SHA1();
        const block: Uint8Array = new TextEncoder().encode(input);

        sha1.update(block);
        const digest: Uint8Array = sha1.final();

        expect(hexdmp(digest)).toBe(result);
    });
}

sha1test("", "da39a3ee5e6b4b0d3255bfef95601890afd80709");
sha1test("a", "86f7e437faa5a7fce15d1ddcb9eaeaea377667b8");
sha1test("abc", "a9993e364706816aba3e25717850c26c9cd0d89d");
sha1test("secure hash algorithm", "d4d6d2f0ebe317513bbd8d967d89bac5819c2f60");
sha1test("abcdefghijklmnopqrstuvwxyz", "32d10c7b8cf96570ca04ce37f2a19d84240d3a89");
sha1test("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "761c457bf73b14d27e9e9265c46f4b4dda11f940");
sha1test("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "50abf5706a150990a08b2c5ea40fa0e585554732");
