/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import HashAlgorithm from "./HashAlgorithm";
import memcpy from "../buffer/memcpy";
import memset from "../buffer/memset";
import u32dec from "../buffer/u32dec";
import u32enc from "../buffer/u32enc";

class MD5 extends HashAlgorithm {
    private static readonly __PADLEN__: Uint8Array = new Uint8Array([
        0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0,
    ]);

    private static readonly __X__: Uint32Array = new Uint32Array(16);

    private static readonly __S11__: number = 7;
    private static readonly __S12__: number = 12;
    private static readonly __S13__: number = 17;
    private static readonly __S14__: number = 22;

    private static readonly __S21__: number = 5;
    private static readonly __S22__: number = 9;
    private static readonly __S23__: number = 14;
    private static readonly __S24__: number = 20;

    private static readonly __S31__: number = 4;
    private static readonly __S32__: number = 11;
    private static readonly __S33__: number = 16;
    private static readonly __S34__: number = 23;

    private static readonly __S41__: number = 6;
    private static readonly __S42__: number = 10;
    private static readonly __S43__: number = 15;
    private static readonly __S44__: number = 21;

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
        (a)  = MD5.__ROTATE_LEFT__((a), (s));
        (a) += (b);
        return a;
    }

    private static __GG__(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
        (a) += MD5.__G__((b), (c), (d)) + (x) + (ac);
        (a)  = MD5.__ROTATE_LEFT__((a), (s));
        (a) += (b);
        return a;
    }

    private static __HH__(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
        (a) += MD5.__H__((b), (c), (d)) + (x) + (ac);
        (a)  = MD5.__ROTATE_LEFT__((a), (s));
        (a) += (b);
        return a;
    }

    private static __II__(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
        (a) += MD5.__I__((b), (c), (d)) + (x) + (ac);
        (a)  = MD5.__ROTATE_LEFT__ ((a), (s));
        (a) += (b);
        return a;
    }

    private static __ROTATE_LEFT__(x: number, n: number): number {
        return (((x) << (n)) | ((x) >>> (32 - (n))));
    }

    private static __ADD_LENGTH__(u: Uint32Array, v: number): Uint32Array {
        const lo: number = (v << 3) >>> 0;
        const hi: number = (v >>> 29);
        u[0] = (u[0] + lo) >>> 0;
        u[1] = (u[1] + hi + (u[0] < lo ? 1 : 0)) >>> 0;
        return u;
    }

    private _digest: Uint32Array = new Uint32Array([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);
    private _length: Uint32Array = new Uint32Array(2);
    private _buffer: Uint8Array = new Uint8Array(64);
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
    
    public update(source: Uint8Array, sourceStart: number = 0, sourceEnd: number = source.length): void {
        const buffer: number = 64 - this._cursor;
        const length: number = sourceEnd - sourceStart;
        let i: number = sourceStart;

        MD5.__ADD_LENGTH__(this._length, length);

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

    public final(): Uint8Array {
        if (this._cursor < 56) {
            memcpy(MD5.__PADLEN__, this._buffer, 0, 56 - this._cursor, this._cursor);
            u32enc(this._length, this._buffer, true, 0, 2, 56);
            this._transform(this._buffer);
        } else {
            memcpy(MD5.__PADLEN__, this._buffer, 0, 64 - this._cursor, this._cursor);
            this._transform(this._buffer);
            u32enc(this._length, MD5.__PADLEN__, true, 0, 2, 64);
            this._transform(MD5.__PADLEN__, 8);
            memset(MD5.__PADLEN__, 0, 64);
        }

        const output: Uint8Array = u32enc(this._digest, new Uint8Array(16), true);
        this.reset();

        return output;
    }

    private _transform(block: Uint8Array, start: number = 0): void {
        let a: number = this._digest[0];
        let b: number = this._digest[1];
        let c: number = this._digest[2];
        let d: number = this._digest[3];

        u32dec(block, MD5.__X__, true, start, start + 64);

        /* Round 1 */
        a = MD5.__FF__(a, b, c, d, MD5.__X__[ 0], MD5.__S11__, 0xd76aa478); /* 1 */
        d = MD5.__FF__(d, a, b, c, MD5.__X__[ 1], MD5.__S12__, 0xe8c7b756); /* 2 */
        c = MD5.__FF__(c, d, a, b, MD5.__X__[ 2], MD5.__S13__, 0x242070db); /* 3 */
        b = MD5.__FF__(b, c, d, a, MD5.__X__[ 3], MD5.__S14__, 0xc1bdceee); /* 4 */
        a = MD5.__FF__(a, b, c, d, MD5.__X__[ 4], MD5.__S11__, 0xf57c0faf); /* 5 */
        d = MD5.__FF__(d, a, b, c, MD5.__X__[ 5], MD5.__S12__, 0x4787c62a); /* 6 */
        c = MD5.__FF__(c, d, a, b, MD5.__X__[ 6], MD5.__S13__, 0xa8304613); /* 7 */
        b = MD5.__FF__(b, c, d, a, MD5.__X__[ 7], MD5.__S14__, 0xfd469501); /* 8 */
        a = MD5.__FF__(a, b, c, d, MD5.__X__[ 8], MD5.__S11__, 0x698098d8); /* 9 */
        d = MD5.__FF__(d, a, b, c, MD5.__X__[ 9], MD5.__S12__, 0x8b44f7af); /* 10 */
        c = MD5.__FF__(c, d, a, b, MD5.__X__[10], MD5.__S13__, 0xffff5bb1); /* 11 */
        b = MD5.__FF__(b, c, d, a, MD5.__X__[11], MD5.__S14__, 0x895cd7be); /* 12 */
        a = MD5.__FF__(a, b, c, d, MD5.__X__[12], MD5.__S11__, 0x6b901122); /* 13 */
        d = MD5.__FF__(d, a, b, c, MD5.__X__[13], MD5.__S12__, 0xfd987193); /* 14 */
        c = MD5.__FF__(c, d, a, b, MD5.__X__[14], MD5.__S13__, 0xa679438e); /* 15 */
        b = MD5.__FF__(b, c, d, a, MD5.__X__[15], MD5.__S14__, 0x49b40821); /* 16 */

        /* Round 2 */
        a = MD5.__GG__(a, b, c, d, MD5.__X__[ 1], MD5.__S21__, 0xf61e2562); /* 17 */
        d = MD5.__GG__(d, a, b, c, MD5.__X__[ 6], MD5.__S22__, 0xc040b340); /* 18 */
        c = MD5.__GG__(c, d, a, b, MD5.__X__[11], MD5.__S23__, 0x265e5a51); /* 19 */
        b = MD5.__GG__(b, c, d, a, MD5.__X__[ 0], MD5.__S24__, 0xe9b6c7aa); /* 20 */
        a = MD5.__GG__(a, b, c, d, MD5.__X__[ 5], MD5.__S21__, 0xd62f105d); /* 21 */
        d = MD5.__GG__(d, a, b, c, MD5.__X__[10], MD5.__S22__,  0x2441453); /* 22 */
        c = MD5.__GG__(c, d, a, b, MD5.__X__[15], MD5.__S23__, 0xd8a1e681); /* 23 */
        b = MD5.__GG__(b, c, d, a, MD5.__X__[ 4], MD5.__S24__, 0xe7d3fbc8); /* 24 */
        a = MD5.__GG__(a, b, c, d, MD5.__X__[ 9], MD5.__S21__, 0x21e1cde6); /* 25 */
        d = MD5.__GG__(d, a, b, c, MD5.__X__[14], MD5.__S22__, 0xc33707d6); /* 26 */
        c = MD5.__GG__(c, d, a, b, MD5.__X__[ 3], MD5.__S23__, 0xf4d50d87); /* 27 */
        b = MD5.__GG__(b, c, d, a, MD5.__X__[ 8], MD5.__S24__, 0x455a14ed); /* 28 */
        a = MD5.__GG__(a, b, c, d, MD5.__X__[13], MD5.__S21__, 0xa9e3e905); /* 29 */
        d = MD5.__GG__(d, a, b, c, MD5.__X__[ 2], MD5.__S22__, 0xfcefa3f8); /* 30 */
        c = MD5.__GG__(c, d, a, b, MD5.__X__[ 7], MD5.__S23__, 0x676f02d9); /* 31 */
        b = MD5.__GG__(b, c, d, a, MD5.__X__[12], MD5.__S24__, 0x8d2a4c8a); /* 32 */

        /* Round 3 */
        a = MD5.__HH__(a, b, c, d, MD5.__X__[ 5], MD5.__S31__, 0xfffa3942); /* 33 */
        d = MD5.__HH__(d, a, b, c, MD5.__X__[ 8], MD5.__S32__, 0x8771f681); /* 34 */
        c = MD5.__HH__(c, d, a, b, MD5.__X__[11], MD5.__S33__, 0x6d9d6122); /* 35 */
        b = MD5.__HH__(b, c, d, a, MD5.__X__[14], MD5.__S34__, 0xfde5380c); /* 36 */
        a = MD5.__HH__(a, b, c, d, MD5.__X__[ 1], MD5.__S31__, 0xa4beea44); /* 37 */
        d = MD5.__HH__(d, a, b, c, MD5.__X__[ 4], MD5.__S32__, 0x4bdecfa9); /* 38 */
        c = MD5.__HH__(c, d, a, b, MD5.__X__[ 7], MD5.__S33__, 0xf6bb4b60); /* 39 */
        b = MD5.__HH__(b, c, d, a, MD5.__X__[10], MD5.__S34__, 0xbebfbc70); /* 40 */
        a = MD5.__HH__(a, b, c, d, MD5.__X__[13], MD5.__S31__, 0x289b7ec6); /* 41 */
        d = MD5.__HH__(d, a, b, c, MD5.__X__[ 0], MD5.__S32__, 0xeaa127fa); /* 42 */
        c = MD5.__HH__(c, d, a, b, MD5.__X__[ 3], MD5.__S33__, 0xd4ef3085); /* 43 */
        b = MD5.__HH__(b, c, d, a, MD5.__X__[ 6], MD5.__S34__,  0x4881d05); /* 44 */
        a = MD5.__HH__(a, b, c, d, MD5.__X__[ 9], MD5.__S31__, 0xd9d4d039); /* 45 */
        d = MD5.__HH__(d, a, b, c, MD5.__X__[12], MD5.__S32__, 0xe6db99e5); /* 46 */
        c = MD5.__HH__(c, d, a, b, MD5.__X__[15], MD5.__S33__, 0x1fa27cf8); /* 47 */
        b = MD5.__HH__(b, c, d, a, MD5.__X__[ 2], MD5.__S34__, 0xc4ac5665); /* 48 */

        /* Round 4 */
        a = MD5.__II__(a, b, c, d, MD5.__X__[ 0], MD5.__S41__, 0xf4292244); /* 49 */
        d = MD5.__II__(d, a, b, c, MD5.__X__[ 7], MD5.__S42__, 0x432aff97); /* 50 */
        c = MD5.__II__(c, d, a, b, MD5.__X__[14], MD5.__S43__, 0xab9423a7); /* 51 */
        b = MD5.__II__(b, c, d, a, MD5.__X__[ 5], MD5.__S44__, 0xfc93a039); /* 52 */
        a = MD5.__II__(a, b, c, d, MD5.__X__[12], MD5.__S41__, 0x655b59c3); /* 53 */
        d = MD5.__II__(d, a, b, c, MD5.__X__[ 3], MD5.__S42__, 0x8f0ccc92); /* 54 */
        c = MD5.__II__(c, d, a, b, MD5.__X__[10], MD5.__S43__, 0xffeff47d); /* 55 */
        b = MD5.__II__(b, c, d, a, MD5.__X__[ 1], MD5.__S44__, 0x85845dd1); /* 56 */
        a = MD5.__II__(a, b, c, d, MD5.__X__[ 8], MD5.__S41__, 0x6fa87e4f); /* 57 */
        d = MD5.__II__(d, a, b, c, MD5.__X__[15], MD5.__S42__, 0xfe2ce6e0); /* 58 */
        c = MD5.__II__(c, d, a, b, MD5.__X__[ 6], MD5.__S43__, 0xa3014314); /* 59 */
        b = MD5.__II__(b, c, d, a, MD5.__X__[13], MD5.__S44__, 0x4e0811a1); /* 60 */
        a = MD5.__II__(a, b, c, d, MD5.__X__[ 4], MD5.__S41__, 0xf7537e82); /* 61 */
        d = MD5.__II__(d, a, b, c, MD5.__X__[11], MD5.__S42__, 0xbd3af235); /* 62 */
        c = MD5.__II__(c, d, a, b, MD5.__X__[ 2], MD5.__S43__, 0x2ad7d2bb); /* 63 */
        b = MD5.__II__(b, c, d, a, MD5.__X__[ 9], MD5.__S44__, 0xeb86d391); /* 64 */

        this._digest[0] += a;
        this._digest[1] += b;
        this._digest[2] += c;
        this._digest[3] += d;

        memset(MD5.__X__, 0);
    }
}

export default MD5;
