/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import CRC32 from "@/crypto/CRC32";
import MD2 from "@/crypto/MD2";

const crc32Impl: CRC32 = new CRC32();
const md2Impl: MD2 = new MD2();

function hex16(bytes: Uint8Array): string {
    let output: string = "";
    for (let i: number = 0; i < bytes.length; ++i) {
        output += ("0" + bytes[i].toString(16)).slice(-2);
    }
    return output;
}

function bytes(value: string): Uint8Array {
    let output: Uint8Array = new Uint8Array(value.length);
    for (let i: number = 0; i < value.length; ++i) {
        output[i] = value.charCodeAt(i);
    }
    return output;
}

function test_crc32(value: string, expect: number): void {
    const block: number = 12;
    for (let i: number = 0; i < value.length; i += block) {
        crc32Impl.update(bytes(value.slice(i, i + block)));
    }

    const actual: number = crc32Impl.final();
    console.log(`%c crc32("${value}") => actual:${"0x" + ("00000000" + actual.toString(16)).slice(-8)}, expect:${"0x" + ("00000000" + expect.toString(16)).slice(-8)};`, `color: ${actual === expect ? "#0a0" : "#a00"};`);
}

function test_md2(value: string, expect: string): void {
    const block: number = 12;
    for (let i: number = 0; i < value.length; i += block) {
        md2Impl.update(bytes(value.slice(i, i + block)));
    }

    const actual: string = hex16(md2Impl.final());
    console.log(`%c md2("${value}") => actual:${actual}, expect:${expect};`, `color: ${actual === expect ? "#0a0" : "#a00"};`);
}

console.group("crc32");
test_crc32("", 0x00000000);
test_crc32("a", 0xe8b7be43);
test_crc32("abc", 0x352441c2);
test_crc32("message digest", 0x20159d7f);
test_crc32("abcdefghijklmnopqrstuvwxyz", 0x4c2750bd);
test_crc32("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 0x1fc2e6d2);
test_crc32("12345678901234567890123456789012345678901234567890123456789012345678901234567890", 0x7ca94a72);
console.groupEnd();

console.group("md2");
test_md2("", "8350e5a3e24c153df2275c9f80692773");
test_md2("a", "32ec01ec4a6dac72c0ab96fb34c0b5d1");
test_md2("abc", "da853b0d3f88d99b30283a69e6ded6bb");
test_md2("message digest", "ab4f496bfb2a530b219ff33031fe06b0");
test_md2("abcdefghijklmnopqrstuvwxyz", "4e8ddff3650292ab5a4108c3aa47940b");
test_md2("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "da33def2a42df13975352846c30338cd");
test_md2("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "d5976f79d83d3a0dc9806c3c66f3efd8");
console.groupEnd();
