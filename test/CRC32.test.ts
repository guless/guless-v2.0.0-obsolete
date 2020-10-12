/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import TextEncoder from "@/text/TextEncoder";
import crc32 from "@/crypto/crc32";

function crc32test(input: string, result: number): void {
    test(`"${input}" => ${result}`, () => {
        const block: Uint8Array = new TextEncoder().encode(input);
        const digest: number = crc32(block, 0);

        expect(digest).toBe(result);
    });
}

crc32test("", 0x00000000);
crc32test("a", 0xE8B7BE43);
crc32test("abc", 0x352441C2);
crc32test("message digest", 0x20159D7F);
crc32test("abcdefghijklmnopqrstuvwxyz", 0x4C2750BD);
crc32test("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 0x1FC2E6D2);
crc32test("12345678901234567890123456789012345678901234567890123456789012345678901234567890", 0x7CA94A72);
