/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import HashAlgorithm from "./HashAlgorithm";
import memcpy from "../buffer/memcpy";
import memset from "../buffer/memset";
import u32vdec from "../buffer/u32vdec";
import u32venc from "../buffer/u32venc";

class MD4 extends HashAlgorithm {
    private static readonly __PADLEN__: Uint8Array = new Uint8Array([
        0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0,
    ]);

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

    private static __FF__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += MD4.__F__((b), (c), (d)) + (x);
        (a)  = MD4.__ROTL__((a), (s));
        return a;
    }

    private static __GG__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += MD4.__G__((b), (c), (d)) + (x) + 0x5a827999;
        (a)  = MD4.__ROTL__((a), (s));
        return a;
    }

    private static __HH__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += MD4.__H__((b), (c), (d)) + (x) + 0x6ed9eba1;
        (a)  = MD4.__ROTL__((a), (s));
        return a;
    }

    private static __ROTL__(x: number, n: number): number {
        return (((x) << (n)) | ((x) >>> (32 - (n))));
    }

    private static __U64_ADD__(u: Uint32Array, v: number): Uint32Array {
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

        MD4.__U64_ADD__(this._length, length);

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
            u32venc(this._length, this._buffer, true, 0, 2, 56);
            this._transform(this._buffer);
        } else {
            memcpy(MD4.__PADLEN__, this._buffer, 0, 64 - this._cursor, this._cursor);
            this._transform(this._buffer);
            u32venc(this._length, MD4.__PADLEN__, true, 0, 2, 64);
            this._transform(MD4.__PADLEN__, 8);
            memset(MD4.__PADLEN__, 0, 64);
        }

        const output: Uint8Array = u32venc(this._digest, new Uint8Array(16), true);
        this.reset();

        return output;
    }

    private _transform(block: Uint8Array, start: number = 0): void {
        let a: number = this._digest[0];
        let b: number = this._digest[1];
        let c: number = this._digest[2];
        let d: number = this._digest[3];

        u32vdec(block, MD4.__X__, true, start, start + 64);

        /* Round 1 */
        a = MD4.__FF__(a, b, c, d, MD4.__X__[ 0],  3);
        d = MD4.__FF__(d, a, b, c, MD4.__X__[ 1],  7);
        c = MD4.__FF__(c, d, a, b, MD4.__X__[ 2], 11);
        b = MD4.__FF__(b, c, d, a, MD4.__X__[ 3], 19);
        a = MD4.__FF__(a, b, c, d, MD4.__X__[ 4],  3);
        d = MD4.__FF__(d, a, b, c, MD4.__X__[ 5],  7);
        c = MD4.__FF__(c, d, a, b, MD4.__X__[ 6], 11);
        b = MD4.__FF__(b, c, d, a, MD4.__X__[ 7], 19);
        a = MD4.__FF__(a, b, c, d, MD4.__X__[ 8],  3);
        d = MD4.__FF__(d, a, b, c, MD4.__X__[ 9],  7);
        c = MD4.__FF__(c, d, a, b, MD4.__X__[10], 11);
        b = MD4.__FF__(b, c, d, a, MD4.__X__[11], 19);
        a = MD4.__FF__(a, b, c, d, MD4.__X__[12],  3);
        d = MD4.__FF__(d, a, b, c, MD4.__X__[13],  7);
        c = MD4.__FF__(c, d, a, b, MD4.__X__[14], 11);
        b = MD4.__FF__(b, c, d, a, MD4.__X__[15], 19);

        /* Round 2 */
        a = MD4.__GG__(a, b, c, d, MD4.__X__[ 0],  3);
        d = MD4.__GG__(d, a, b, c, MD4.__X__[ 4],  5);
        c = MD4.__GG__(c, d, a, b, MD4.__X__[ 8],  9);
        b = MD4.__GG__(b, c, d, a, MD4.__X__[12], 13);
        a = MD4.__GG__(a, b, c, d, MD4.__X__[ 1],  3);
        d = MD4.__GG__(d, a, b, c, MD4.__X__[ 5],  5);
        c = MD4.__GG__(c, d, a, b, MD4.__X__[ 9],  9);
        b = MD4.__GG__(b, c, d, a, MD4.__X__[13], 13);
        a = MD4.__GG__(a, b, c, d, MD4.__X__[ 2],  3);
        d = MD4.__GG__(d, a, b, c, MD4.__X__[ 6],  5);
        c = MD4.__GG__(c, d, a, b, MD4.__X__[10],  9);
        b = MD4.__GG__(b, c, d, a, MD4.__X__[14], 13);
        a = MD4.__GG__(a, b, c, d, MD4.__X__[ 3],  3);
        d = MD4.__GG__(d, a, b, c, MD4.__X__[ 7],  5);
        c = MD4.__GG__(c, d, a, b, MD4.__X__[11],  9);
        b = MD4.__GG__(b, c, d, a, MD4.__X__[15], 13);

        /* Round 3 */
        a = MD4.__HH__(a, b, c, d, MD4.__X__[ 0],  3);
        d = MD4.__HH__(d, a, b, c, MD4.__X__[ 8],  9);
        c = MD4.__HH__(c, d, a, b, MD4.__X__[ 4], 11);
        b = MD4.__HH__(b, c, d, a, MD4.__X__[12], 15);
        a = MD4.__HH__(a, b, c, d, MD4.__X__[ 2],  3);
        d = MD4.__HH__(d, a, b, c, MD4.__X__[10],  9);
        c = MD4.__HH__(c, d, a, b, MD4.__X__[ 6], 11);
        b = MD4.__HH__(b, c, d, a, MD4.__X__[14], 15);
        a = MD4.__HH__(a, b, c, d, MD4.__X__[ 1],  3);
        d = MD4.__HH__(d, a, b, c, MD4.__X__[ 9],  9);
        c = MD4.__HH__(c, d, a, b, MD4.__X__[ 5], 11);
        b = MD4.__HH__(b, c, d, a, MD4.__X__[13], 15);
        a = MD4.__HH__(a, b, c, d, MD4.__X__[ 3],  3);
        d = MD4.__HH__(d, a, b, c, MD4.__X__[11],  9);
        c = MD4.__HH__(c, d, a, b, MD4.__X__[ 7], 11);
        b = MD4.__HH__(b, c, d, a, MD4.__X__[15], 15);

        this._digest[0] += a;
        this._digest[1] += b;
        this._digest[2] += c;
        this._digest[3] += d;

        memset(MD4.__X__, 0);
    }
}

export default MD4;
