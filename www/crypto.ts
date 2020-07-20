/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import CRC32 from "@/crypto/CRC32";
import MD2 from "@/crypto/MD2";
import MD4 from "@/crypto/MD4";
import MD5 from "@/crypto/MD5";
import RIPEMD128 from "@/crypto/RIPEMD128";
import RIPEMD160 from "@/crypto/RIPEMD160";
import RIPEMD256 from "@/crypto/RIPEMD256";
import RIPEMD320 from "@/crypto/RIPEMD320";

const block: number = 1 + Math.floor(Math.random() * 0x0F);
console.log("block:", block);

const crc32Impl: CRC32 = new CRC32();
const md2Impl: MD2 = new MD2();
const md4Impl: MD4 = new MD4();
const md5Impl: MD5 = new MD5();
const ripemd128Impl: RIPEMD128 = new RIPEMD128();
const ripemd160Impl: RIPEMD160 = new RIPEMD160();
const ripemd256Impl: RIPEMD256 = new RIPEMD256();
const ripemd320Impl: RIPEMD320 = new RIPEMD320();

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
    for (let i: number = 0; i < value.length; i += block) {
        crc32Impl.update(bytes(value.slice(i, i + block)));
    }

    const actual: number = crc32Impl.final();
    console.log(`%c crc32("${value}") => actual:${"0x" + ("00000000" + actual.toString(16)).slice(-8)}, expect:${"0x" + ("00000000" + expect.toString(16)).slice(-8)};`, `color: ${actual === expect ? "#0a0" : "#a00"};`);
}

function test_md2(value: string, expect: string): void {
    for (let i: number = 0; i < value.length; i += block) {
        md2Impl.update(bytes(value.slice(i, i + block)));
    }

    const actual: string = hex16(md2Impl.final());
    console.log(`%c md2("${value}") => actual:${actual}, expect:${expect};`, `color: ${actual === expect ? "#0a0" : "#a00"};`);
}

function test_md4(value: string, expect: string): void {
    for (let i: number = 0; i < value.length; i += block) {
        md4Impl.update(bytes(value.slice(i, i + block)));
    }

    const actual: string = hex16(md4Impl.final());
    console.log(`%c md4("${value}") => actual:${actual}, expect:${expect};`, `color: ${actual === expect ? "#0a0" : "#a00"};`);
}

function test_md5(value: string, expect: string): void {
    for (let i: number = 0; i < value.length; i += block) {
        md5Impl.update(bytes(value.slice(i, i + block)));
    }

    const actual: string = hex16(md5Impl.final());
    console.log(`%c md5("${value}") => actual:${actual}, expect:${expect};`, `color: ${actual === expect ? "#0a0" : "#a00"};`);
}

function test_ripemd128(value: string, expect: string): void {
    for (let i: number = 0; i < value.length; i += block) {
        ripemd128Impl.update(bytes(value.slice(i, i + block)));
    }

    const actual: string = hex16(ripemd128Impl.final());
    console.log(`%c ripemd128("${value}") => actual:${actual}, expect:${expect};`, `color: ${actual === expect ? "#0a0" : "#a00"};`);
}

function test_ripemd160(value: string, expect: string): void {
    for (let i: number = 0; i < value.length; i += block) {
        ripemd160Impl.update(bytes(value.slice(i, i + block)));
    }

    const actual: string = hex16(ripemd160Impl.final());
    console.log(`%c ripemd160("${value}") => actual:${actual}, expect:${expect};`, `color: ${actual === expect ? "#0a0" : "#a00"};`);
}

function test_ripemd256(value: string, expect: string): void {
    for (let i: number = 0; i < value.length; i += block) {
        ripemd256Impl.update(bytes(value.slice(i, i + block)));
    }

    const actual: string = hex16(ripemd256Impl.final());
    console.log(`%c ripemd256("${value}") => actual:${actual}, expect:${expect};`, `color: ${actual === expect ? "#0a0" : "#a00"};`);
}

function test_ripemd320(value: string, expect: string): void {
    for (let i: number = 0; i < value.length; i += block) {
        ripemd320Impl.update(bytes(value.slice(i, i + block)));
    }

    const actual: string = hex16(ripemd320Impl.final());
    console.log(`%c ripemd320("${value}") => actual:${actual}, expect:${expect};`, `color: ${actual === expect ? "#0a0" : "#a00"};`);
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

console.group("md4");
test_md4("", "31d6cfe0d16ae931b73c59d7e0c089c0");
test_md4("a", "bde52cb31de33e46245e05fbdbd6fb24");
test_md4("abc", "a448017aaf21d8525fc10ae87aa6729d");
test_md4("message digest", "d9130a8164549fe818874806e1c7014b");
test_md4("abcdefghijklmnopqrstuvwxyz", "d79e1c308aa5bbcdeea8ed63df412da9");
test_md4("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "043f8582f241db351ce627e153e7f0e4");
test_md4("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "e33b4ddc9c38f2199c3e7b164fcc0536");
console.groupEnd();

console.group("md5");
test_md5("", "d41d8cd98f00b204e9800998ecf8427e");
test_md5("a", "0cc175b9c0f1b6a831c399e269772661");
test_md5("abc", "900150983cd24fb0d6963f7d28e17f72");
test_md5("message digest", "f96b697d7cb7938d525a2f31aaf161d0");
test_md5("abcdefghijklmnopqrstuvwxyz", "c3fcd3d76192e4007dfb496cca67e13b");
test_md5("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "d174ab98d277d9f5a5611c2c9f419d9f");
test_md5("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "57edf4a22be3c955ac49da2e2107b67a");
console.groupEnd();

console.group("ripemd128");
test_ripemd128("", "cdf26213a150dc3ecb610f18f6b38b46");
test_ripemd128("a", "86be7afa339d0fc7cfc785e72f578d33");
test_ripemd128("abc", "c14a12199c66e4ba84636b0f69144c77");
test_ripemd128("message digest", "9e327b3d6e523062afc1132d7df9d1b8");
test_ripemd128("abcdefghijklmnopqrstuvwxyz", "fd2aa607f71dc8f510714922b371834e");
test_ripemd128("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "d1e959eb179c911faea4624c60c5c702");
test_ripemd128("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "3f45ef194732c2dbb2c4a2c769795fa3");
console.groupEnd();

console.group("ripemd160");
test_ripemd160("", "9c1185a5c5e9fc54612808977ee8f548b2258d31");
test_ripemd160("a", "0bdc9d2d256b3ee9daae347be6f4dc835a467ffe");
test_ripemd160("abc", "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc");
test_ripemd160("message digest", "5d0689ef49d2fae572b881b123a85ffa21595f36");
test_ripemd160("abcdefghijklmnopqrstuvwxyz", "f71c27109c692c1b56bbdceb5b9d2865b3708dbc");
test_ripemd160("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "b0e20b6e3116640286ed3a87a5713079b21f5189");
test_ripemd160("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "9b752e45573d4b39f4dbd3323cab82bf63326bfb");
console.groupEnd();

console.group("test_ripemd256");
test_ripemd256("", "02ba4c4e5f8ecd1877fc52d64d30e37a2d9774fb1e5d026380ae0168e3c5522d");
test_ripemd256("a", "f9333e45d857f5d90a91bab70a1eba0cfb1be4b0783c9acfcd883a9134692925");
test_ripemd256("abc", "afbd6e228b9d8cbbcef5ca2d03e6dba10ac0bc7dcbe4680e1e42d2e975459b65");
test_ripemd256("message digest", "87e971759a1ce47a514d5c914c392c9018c7c46bc14465554afcdf54a5070c0e");
test_ripemd256("abcdefghijklmnopqrstuvwxyz", "649d3034751ea216776bf9a18acc81bc7896118a5197968782dd1fd97d8d5133");
test_ripemd256("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "5740a408ac16b720b84424ae931cbb1fe363d1d0bf4017f1a89f7ea6de77a0b8");
test_ripemd256("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "06fdcc7a409548aaf91368c06a6275b553e3f099bf0ea4edfd6778df89a890dd");
console.groupEnd();

console.group("ripemd320");
test_ripemd320("", "22d65d5661536cdc75c1fdf5c6de7b41b9f27325ebc61e8557177d705a0ec880151c3a32a00899b8");
test_ripemd320("a", "ce78850638f92658a5a585097579926dda667a5716562cfcf6fbe77f63542f99b04705d6970dff5d");
test_ripemd320("abc", "de4c01b3054f8930a79d09ae738e92301e5a17085beffdc1b8d116713e74f82fa942d64cdbc4682d");
test_ripemd320("message digest", "3a8e28502ed45d422f68844f9dd316e7b98533fa3f2a91d29f84d425c88d6b4eff727df66a7c0197");
test_ripemd320("abcdefghijklmnopqrstuvwxyz", "cabdb1810b92470a2093aa6bce05952c28348cf43ff60841975166bb40ed234004b8824463e6b009");
test_ripemd320("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "ed544940c86d67f250d232c30b7b3e5770e0c60c8cb9a4cafe3b11388af9920e1b99230b843c86a4");
test_ripemd320("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "557888af5f6d8ed62ab66945c6d2a0a47ecd5341e915eb8fea1d0524955f825dc717e4a008ab2d42");
console.groupEnd();
