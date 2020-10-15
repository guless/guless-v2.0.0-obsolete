/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import RMD256 from "@/crypto/RMD256";
import TextEncoder from "@/text/TextEncoder";
import hexdmp from "@/buffer/hexdmp";

function rmd256test(input: string, result: string): void {
    test(`"${input}" => "${result}"`, () => {
        const rmd256: RMD256 = new RMD256();
        const block: Uint8Array = new TextEncoder().encode(input);

        rmd256.update(block);
        const digest: Uint8Array = rmd256.final();

        expect(hexdmp(digest)).toBe(result);
    });
}

rmd256test("", "02ba4c4e5f8ecd1877fc52d64d30e37a2d9774fb1e5d026380ae0168e3c5522d");
rmd256test("a", "f9333e45d857f5d90a91bab70a1eba0cfb1be4b0783c9acfcd883a9134692925");
rmd256test("abc", "afbd6e228b9d8cbbcef5ca2d03e6dba10ac0bc7dcbe4680e1e42d2e975459b65");
rmd256test("message digest", "87e971759a1ce47a514d5c914c392c9018c7c46bc14465554afcdf54a5070c0e");
rmd256test("abcdefghijklmnopqrstuvwxyz", "649d3034751ea216776bf9a18acc81bc7896118a5197968782dd1fd97d8d5133");
rmd256test("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "5740a408ac16b720b84424ae931cbb1fe363d1d0bf4017f1a89f7ea6de77a0b8");
rmd256test("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "06fdcc7a409548aaf91368c06a6275b553e3f099bf0ea4edfd6778df89a890dd");
