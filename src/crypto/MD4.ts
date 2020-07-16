/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import HashAlgorithm from "./HashAlgorithm";
import memcpy from "../buffer/memcpy";
import memset from "../buffer/memset";
import u32dec from "../buffer/u32dec";
import u32enc from "../buffer/u32enc";

class MD4 extends HashAlgorithm {
    private static readonly __PADLEN__: Uint8Array = new Uint8Array([
        0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0,
    ]);

    private static readonly __S11__: number = 3;
    private static readonly __S12__: number = 7;
    private static readonly __S13__: number = 11;
    private static readonly __S14__: number = 19;

    private static readonly __S21__: number = 3;
    private static readonly __S22__: number = 5;
    private static readonly __S23__: number = 9;
    private static readonly __S24__: number = 13;

    private static readonly __S31__: number = 3;
    private static readonly __S32__: number = 9;
    private static readonly __S33__: number = 11;
    private static readonly __S34__: number = 15;

    private static readonly __X__: Uint32Array = new Uint32Array(16);

    private static __F__(x: number, y: number, z: number): number {
        return (((x) & (y)) | ((~x) & (z)));
    }

    private static __G__(x: number, y: number, z: number): number {
        return (((x) & (y)) | ((x) & (z)) | ((y) & (z)));
    }

    private static __H__(x: number, y: number, z: number): number {
        return ((x) ^ (y) ^ (z));
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

    private static __FF__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += MD4.__F__((b), (c), (d)) + (x);
        (a)  = MD4.__ROTATE_LEFT__((a), (s));
        return a;
    }

    private static __GG__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += MD4.__G__((b), (c), (d)) + (x) + 0x5a827999;
        (a)  = MD4.__ROTATE_LEFT__((a), (s));
        return a;
    }

    private static __HH__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += MD4.__H__((b), (c), (d)) + (x) + 0x6ed9eba1;
        (a)  = MD4.__ROTATE_LEFT__((a), (s));
        return a;
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

        MD4.__ADD_LENGTH__(this._length, length);

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
            memcpy(MD4.__PADLEN__, this._buffer, 0, 56 - this._cursor, this._cursor);
            u32enc(this._length, this._buffer, true, 0, 2, 56);
            this._transform(this._buffer);
        } else {
            memcpy(MD4.__PADLEN__, this._buffer, 0, 64 - this._cursor, this._cursor);
            this._transform(this._buffer);
            u32enc(this._length, MD4.__PADLEN__, true, 0, 2, 64);
            this._transform(MD4.__PADLEN__, 8);
            memset(MD4.__PADLEN__, 0, 64);
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

        u32dec(block, MD4.__X__, true, start, start + 64);

        /* Round 1 */
        a = MD4.__FF__(a, b, c, d, MD4.__X__[ 0], MD4.__S11__); /* 1 */
        d = MD4.__FF__(d, a, b, c, MD4.__X__[ 1], MD4.__S12__); /* 2 */
        c = MD4.__FF__(c, d, a, b, MD4.__X__[ 2], MD4.__S13__); /* 3 */
        b = MD4.__FF__(b, c, d, a, MD4.__X__[ 3], MD4.__S14__); /* 4 */
        a = MD4.__FF__(a, b, c, d, MD4.__X__[ 4], MD4.__S11__); /* 5 */
        d = MD4.__FF__(d, a, b, c, MD4.__X__[ 5], MD4.__S12__); /* 6 */
        c = MD4.__FF__(c, d, a, b, MD4.__X__[ 6], MD4.__S13__); /* 7 */
        b = MD4.__FF__(b, c, d, a, MD4.__X__[ 7], MD4.__S14__); /* 8 */
        a = MD4.__FF__(a, b, c, d, MD4.__X__[ 8], MD4.__S11__); /* 9 */
        d = MD4.__FF__(d, a, b, c, MD4.__X__[ 9], MD4.__S12__); /* 10 */
        c = MD4.__FF__(c, d, a, b, MD4.__X__[10], MD4.__S13__); /* 11 */
        b = MD4.__FF__(b, c, d, a, MD4.__X__[11], MD4.__S14__); /* 12 */
        a = MD4.__FF__(a, b, c, d, MD4.__X__[12], MD4.__S11__); /* 13 */
        d = MD4.__FF__(d, a, b, c, MD4.__X__[13], MD4.__S12__); /* 14 */
        c = MD4.__FF__(c, d, a, b, MD4.__X__[14], MD4.__S13__); /* 15 */
        b = MD4.__FF__(b, c, d, a, MD4.__X__[15], MD4.__S14__); /* 16 */

        /* Round 2 */
        a = MD4.__GG__(a, b, c, d, MD4.__X__[ 0], MD4.__S21__); /* 17 */
        d = MD4.__GG__(d, a, b, c, MD4.__X__[ 4], MD4.__S22__); /* 18 */
        c = MD4.__GG__(c, d, a, b, MD4.__X__[ 8], MD4.__S23__); /* 19 */
        b = MD4.__GG__(b, c, d, a, MD4.__X__[12], MD4.__S24__); /* 20 */
        a = MD4.__GG__(a, b, c, d, MD4.__X__[ 1], MD4.__S21__); /* 21 */
        d = MD4.__GG__(d, a, b, c, MD4.__X__[ 5], MD4.__S22__); /* 22 */
        c = MD4.__GG__(c, d, a, b, MD4.__X__[ 9], MD4.__S23__); /* 23 */
        b = MD4.__GG__(b, c, d, a, MD4.__X__[13], MD4.__S24__); /* 24 */
        a = MD4.__GG__(a, b, c, d, MD4.__X__[ 2], MD4.__S21__); /* 25 */
        d = MD4.__GG__(d, a, b, c, MD4.__X__[ 6], MD4.__S22__); /* 26 */
        c = MD4.__GG__(c, d, a, b, MD4.__X__[10], MD4.__S23__); /* 27 */
        b = MD4.__GG__(b, c, d, a, MD4.__X__[14], MD4.__S24__); /* 28 */
        a = MD4.__GG__(a, b, c, d, MD4.__X__[ 3], MD4.__S21__); /* 29 */
        d = MD4.__GG__(d, a, b, c, MD4.__X__[ 7], MD4.__S22__); /* 30 */
        c = MD4.__GG__(c, d, a, b, MD4.__X__[11], MD4.__S23__); /* 31 */
        b = MD4.__GG__(b, c, d, a, MD4.__X__[15], MD4.__S24__); /* 32 */

        /* Round 3 */
        a = MD4.__HH__(a, b, c, d, MD4.__X__[ 0], MD4.__S31__); /* 33 */
        d = MD4.__HH__(d, a, b, c, MD4.__X__[ 8], MD4.__S32__); /* 34 */
        c = MD4.__HH__(c, d, a, b, MD4.__X__[ 4], MD4.__S33__); /* 35 */
        b = MD4.__HH__(b, c, d, a, MD4.__X__[12], MD4.__S34__); /* 36 */
        a = MD4.__HH__(a, b, c, d, MD4.__X__[ 2], MD4.__S31__); /* 37 */
        d = MD4.__HH__(d, a, b, c, MD4.__X__[10], MD4.__S32__); /* 38 */
        c = MD4.__HH__(c, d, a, b, MD4.__X__[ 6], MD4.__S33__); /* 39 */
        b = MD4.__HH__(b, c, d, a, MD4.__X__[14], MD4.__S34__); /* 40 */
        a = MD4.__HH__(a, b, c, d, MD4.__X__[ 1], MD4.__S31__); /* 41 */
        d = MD4.__HH__(d, a, b, c, MD4.__X__[ 9], MD4.__S32__); /* 42 */
        c = MD4.__HH__(c, d, a, b, MD4.__X__[ 5], MD4.__S33__); /* 43 */
        b = MD4.__HH__(b, c, d, a, MD4.__X__[13], MD4.__S34__); /* 44 */
        a = MD4.__HH__(a, b, c, d, MD4.__X__[ 3], MD4.__S31__); /* 45 */
        d = MD4.__HH__(d, a, b, c, MD4.__X__[11], MD4.__S32__); /* 46 */
        c = MD4.__HH__(c, d, a, b, MD4.__X__[ 7], MD4.__S33__); /* 47 */
        b = MD4.__HH__(b, c, d, a, MD4.__X__[15], MD4.__S34__); /* 48 */

        this._digest[0] += a;
        this._digest[1] += b;
        this._digest[2] += c;
        this._digest[3] += d;

        memset(MD4.__X__, 0);
    }
}

export default MD4;
