/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const __TESTVIEW__ = typeof Uint8Array === "function" ? new Uint8Array(new Uint32Array([0x12345678]).buffer) : [0x78, 0x56, 0x34, 0x12];
export const LITTLE_ENDIAN: boolean = __TESTVIEW__[0] === 0x78 && __TESTVIEW__[1] === 0x56 && __TESTVIEW__[2] === 0x34 && __TESTVIEW__[3] === 0x12;
export const BIG_ENDIAN: boolean = __TESTVIEW__[0] === 0x12 && __TESTVIEW__[1] === 0x34 && __TESTVIEW__[2] === 0x56 && __TESTVIEW__[3] === 0x78;
