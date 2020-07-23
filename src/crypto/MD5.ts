/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import HashAlgorithm from "./HashAlgorithm";
import { u32 } from "../buffer/ctypes";
import { u8vec, u32vec, u64vec } from "../buffer/ctypes";
import { i32rotl } from "../buffer/coperators";
import memcpy from "../buffer/memcpy";
import memset from "../buffer/memset";
import u32dec from "../buffer/u32dec";
import u32enc from "../buffer/u32enc";
import u64enc from "../buffer/u64enc";
import u64abits from "../buffer/u64abits";

class MD5 extends HashAlgorithm {
    private static readonly __PADLEN__: u8vec = u8vec([
        0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    private static readonly __X__: u32vec = u32vec(16);

    private static __F__(x: number, y: number, z: number): number {
        return (((x) & (y)) | ((~x) & (z)));
    }

    private static __G__(x: number, y: number, z: number): number {
        return (((x) & (z)) | ((y) & (~z)))
    }

    private static __H__(x: number, y: number, z: number): number {
        return ((x) ^ (y) ^ (z));
    }

    private static __I__(x: number, y: number, z: number): number {
        return ((y) ^ ((x) | (~z)));
    }

    private static __FF__(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
        (a) += MD5.__F__((b), (c), (d)) + (x) + (ac);
        (a)  = i32rotl((a), (s));
        (a) += (b);
        return a;
    }

    private static __GG__(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
        (a) += MD5.__G__((b), (c), (d)) + (x) + (ac);
        (a)  = i32rotl((a), (s));
        (a) += (b);
        return a;
    }

    private static __HH__(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
        (a) += MD5.__H__((b), (c), (d)) + (x) + (ac);
        (a)  = i32rotl((a), (s));
        (a) += (b);
        return a;
    }

    private static __II__(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
        (a) += MD5.__I__((b), (c), (d)) + (x) + (ac);
        (a)  = i32rotl((a), (s));
        (a) += (b);
        return a;
    }

    private _digest: u32vec = u32vec([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);
    private _length: u64vec = u64vec(1);
    private _buffer: u8vec = u8vec(64);
    private _cursor: number = 0;

    public reset(): void {
        this._digest[0] = 0x67452301;
        this._digest[1] = 0xefcdab89;
        this._digest[2] = 0x98badcfe;
        this._digest[3] = 0x10325476;
        memset(this._length, 0);
        this._cursor = 0;
        memset(this._buffer, 0);
    }
    
    public update(source: u8vec, sourceStart: number = 0, sourceEnd: number = source.length): void {
        const buffer: number = 64 - this._cursor;
        const length: number = sourceEnd - sourceStart;
        let i: number = sourceStart;

        u64abits(this._length, length);

        if (length >= buffer) {
            const partial: number = buffer & 0x3F;

            if (partial !== 0) {
                memcpy(source, this._buffer, 0, partial, this._cursor);
                this._cursor = 0;
                this._transform(this._buffer);
            }

            for (i += partial; i + 64 <= sourceEnd; i += 64) {
                this._transform(source, i);
            }
        }

        memcpy(source, this._buffer, i, sourceEnd, this._cursor);
        this._cursor += sourceEnd - i;
    }

    public final(): u8vec {
        if (this._cursor < 56) {
            memcpy(MD5.__PADLEN__, this._buffer, 0, 56 - this._cursor, this._cursor);
            u64enc(this._length, this._buffer, true, 0, 2, 56);
            this._transform(this._buffer);
        } else {
            memcpy(MD5.__PADLEN__, this._buffer, 0, 64 - this._cursor, this._cursor);
            this._transform(this._buffer);
            u64enc(this._length, MD5.__PADLEN__, true, 0, 2, 64);
            this._transform(MD5.__PADLEN__, 8);
            memset(MD5.__PADLEN__, 0, 64);
        }

        const output: u8vec = u32enc(this._digest, u8vec(16), true);
        this.reset();

        return output;
    }

    private _transform(block: u8vec, start: number = 0): void {
        let a: number = this._digest[0];
        let b: number = this._digest[1];
        let c: number = this._digest[2];
        let d: number = this._digest[3];

        u32dec(block, MD5.__X__, true, start, start + 64);

        /* Round 1 */
        a = MD5.__FF__(a, b, c, d, MD5.__X__[ 0],  7, 0xd76aa478);
        d = MD5.__FF__(d, a, b, c, MD5.__X__[ 1], 12, 0xe8c7b756);
        c = MD5.__FF__(c, d, a, b, MD5.__X__[ 2], 17, 0x242070db);
        b = MD5.__FF__(b, c, d, a, MD5.__X__[ 3], 22, 0xc1bdceee);
        a = MD5.__FF__(a, b, c, d, MD5.__X__[ 4],  7, 0xf57c0faf);
        d = MD5.__FF__(d, a, b, c, MD5.__X__[ 5], 12, 0x4787c62a);
        c = MD5.__FF__(c, d, a, b, MD5.__X__[ 6], 17, 0xa8304613);
        b = MD5.__FF__(b, c, d, a, MD5.__X__[ 7], 22, 0xfd469501);
        a = MD5.__FF__(a, b, c, d, MD5.__X__[ 8],  7, 0x698098d8);
        d = MD5.__FF__(d, a, b, c, MD5.__X__[ 9], 12, 0x8b44f7af);
        c = MD5.__FF__(c, d, a, b, MD5.__X__[10], 17, 0xffff5bb1);
        b = MD5.__FF__(b, c, d, a, MD5.__X__[11], 22, 0x895cd7be);
        a = MD5.__FF__(a, b, c, d, MD5.__X__[12],  7, 0x6b901122);
        d = MD5.__FF__(d, a, b, c, MD5.__X__[13], 12, 0xfd987193);
        c = MD5.__FF__(c, d, a, b, MD5.__X__[14], 17, 0xa679438e);
        b = MD5.__FF__(b, c, d, a, MD5.__X__[15], 22, 0x49b40821);

        /* Round 2 */
        a = MD5.__GG__(a, b, c, d, MD5.__X__[ 1],  5, 0xf61e2562);
        d = MD5.__GG__(d, a, b, c, MD5.__X__[ 6],  9, 0xc040b340);
        c = MD5.__GG__(c, d, a, b, MD5.__X__[11], 14, 0x265e5a51);
        b = MD5.__GG__(b, c, d, a, MD5.__X__[ 0], 20, 0xe9b6c7aa);
        a = MD5.__GG__(a, b, c, d, MD5.__X__[ 5],  5, 0xd62f105d);
        d = MD5.__GG__(d, a, b, c, MD5.__X__[10],  9,  0x2441453);
        c = MD5.__GG__(c, d, a, b, MD5.__X__[15], 14, 0xd8a1e681);
        b = MD5.__GG__(b, c, d, a, MD5.__X__[ 4], 20, 0xe7d3fbc8);
        a = MD5.__GG__(a, b, c, d, MD5.__X__[ 9],  5, 0x21e1cde6);
        d = MD5.__GG__(d, a, b, c, MD5.__X__[14],  9, 0xc33707d6);
        c = MD5.__GG__(c, d, a, b, MD5.__X__[ 3], 14, 0xf4d50d87);
        b = MD5.__GG__(b, c, d, a, MD5.__X__[ 8], 20, 0x455a14ed);
        a = MD5.__GG__(a, b, c, d, MD5.__X__[13],  5, 0xa9e3e905);
        d = MD5.__GG__(d, a, b, c, MD5.__X__[ 2],  9, 0xfcefa3f8);
        c = MD5.__GG__(c, d, a, b, MD5.__X__[ 7], 14, 0x676f02d9);
        b = MD5.__GG__(b, c, d, a, MD5.__X__[12], 20, 0x8d2a4c8a);

        /* Round 3 */
        a = MD5.__HH__(a, b, c, d, MD5.__X__[ 5],  4, 0xfffa3942);
        d = MD5.__HH__(d, a, b, c, MD5.__X__[ 8], 11, 0x8771f681);
        c = MD5.__HH__(c, d, a, b, MD5.__X__[11], 16, 0x6d9d6122);
        b = MD5.__HH__(b, c, d, a, MD5.__X__[14], 23, 0xfde5380c);
        a = MD5.__HH__(a, b, c, d, MD5.__X__[ 1],  4, 0xa4beea44);
        d = MD5.__HH__(d, a, b, c, MD5.__X__[ 4], 11, 0x4bdecfa9);
        c = MD5.__HH__(c, d, a, b, MD5.__X__[ 7], 16, 0xf6bb4b60);
        b = MD5.__HH__(b, c, d, a, MD5.__X__[10], 23, 0xbebfbc70);
        a = MD5.__HH__(a, b, c, d, MD5.__X__[13],  4, 0x289b7ec6);
        d = MD5.__HH__(d, a, b, c, MD5.__X__[ 0], 11, 0xeaa127fa);
        c = MD5.__HH__(c, d, a, b, MD5.__X__[ 3], 16, 0xd4ef3085);
        b = MD5.__HH__(b, c, d, a, MD5.__X__[ 6], 23,  0x4881d05);
        a = MD5.__HH__(a, b, c, d, MD5.__X__[ 9],  4, 0xd9d4d039);
        d = MD5.__HH__(d, a, b, c, MD5.__X__[12], 11, 0xe6db99e5);
        c = MD5.__HH__(c, d, a, b, MD5.__X__[15], 16, 0x1fa27cf8);
        b = MD5.__HH__(b, c, d, a, MD5.__X__[ 2], 23, 0xc4ac5665);

        /* Round 4 */
        a = MD5.__II__(a, b, c, d, MD5.__X__[ 0],  6, 0xf4292244);
        d = MD5.__II__(d, a, b, c, MD5.__X__[ 7], 10, 0x432aff97);
        c = MD5.__II__(c, d, a, b, MD5.__X__[14], 15, 0xab9423a7);
        b = MD5.__II__(b, c, d, a, MD5.__X__[ 5], 21, 0xfc93a039);
        a = MD5.__II__(a, b, c, d, MD5.__X__[12],  6, 0x655b59c3);
        d = MD5.__II__(d, a, b, c, MD5.__X__[ 3], 10, 0x8f0ccc92);
        c = MD5.__II__(c, d, a, b, MD5.__X__[10], 15, 0xffeff47d);
        b = MD5.__II__(b, c, d, a, MD5.__X__[ 1], 21, 0x85845dd1);
        a = MD5.__II__(a, b, c, d, MD5.__X__[ 8],  6, 0x6fa87e4f);
        d = MD5.__II__(d, a, b, c, MD5.__X__[15], 10, 0xfe2ce6e0);
        c = MD5.__II__(c, d, a, b, MD5.__X__[ 6], 15, 0xa3014314);
        b = MD5.__II__(b, c, d, a, MD5.__X__[13], 21, 0x4e0811a1);
        a = MD5.__II__(a, b, c, d, MD5.__X__[ 4],  6, 0xf7537e82);
        d = MD5.__II__(d, a, b, c, MD5.__X__[11], 10, 0xbd3af235);
        c = MD5.__II__(c, d, a, b, MD5.__X__[ 2], 15, 0x2ad7d2bb);
        b = MD5.__II__(b, c, d, a, MD5.__X__[ 9], 21, 0xeb86d391);

        this._digest[0] = u32(this._digest[0] + a);
        this._digest[1] = u32(this._digest[1] + b);
        this._digest[2] = u32(this._digest[2] + c);
        this._digest[3] = u32(this._digest[3] + d);

        memset(MD5.__X__, 0);
    }
}

export default MD5;
