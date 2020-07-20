/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import HashAlgorithm from "./HashAlgorithm";
import memcpy from "../buffer/memcpy";
import memset from "../buffer/memset";
import u32dec from "../buffer/u32dec";
import u32enc from "../buffer/u32enc";

class RIPEMD256 extends HashAlgorithm {
    private static readonly __PADLEN__: Uint8Array = new Uint8Array([
        0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0,
    ]);

    private static readonly __X__: Uint32Array = new Uint32Array(16);

    private static __F__(x: number, y: number, z: number): number {
        return ((x) ^ (y) ^ (z));
    }

    private static __G__(x: number, y: number, z: number): number {
        return (((x) & (y)) | (~(x) & (z)));
    }

    private static __H__(x: number, y: number, z: number): number {
        return (((x) | ~(y)) ^ (z));
    }

    private static __I__(x: number, y: number, z: number): number {
        return (((x) & (z)) | ((y) & ~(z)));
    }

    private static __FF__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD256.__F__((b), (c), (d)) + (x);
        (a)  = RIPEMD256.__ROTL__((a), (s));
        return a;
    }

    private static __GG__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD256.__G__((b), (c), (d)) + (x) + 0x5a827999;
        (a)  = RIPEMD256.__ROTL__((a), (s));
        return a;
    }

    private static __HH__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD256.__H__((b), (c), (d)) + (x) + 0x6ed9eba1;
        (a)  = RIPEMD256.__ROTL__((a), (s));
        return a;
    }

    private static __II__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD256.__I__((b), (c), (d)) + (x) + 0x8f1bbcdc;
        (a)  = RIPEMD256.__ROTL__((a), (s));
        return a;
    }

    private static __FFF__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD256.__F__((b), (c), (d)) + (x);
        (a)  = RIPEMD256.__ROTL__((a), (s));
        return a;
    }

    private static __GGG__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD256.__G__((b), (c), (d)) + (x) + 0x6d703ef3;
        (a)  = RIPEMD256.__ROTL__((a), (s));
        return a;
    }
    private static __HHH__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD256.__H__((b), (c), (d)) + (x) + 0x5c4dd124;
        (a)  = RIPEMD256.__ROTL__((a), (s));
        return a;
    }
    private static __III__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD256.__I__((b), (c), (d)) + (x) + 0x50a28be6;
        (a)  = RIPEMD256.__ROTL__((a), (s));
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

    private _digest: Uint32Array = new Uint32Array([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0x76543210, 0xfedcba98, 0x89abcdef, 0x01234567]);
    private _length: Uint32Array = new Uint32Array(2);
    private _buffer: Uint8Array = new Uint8Array(64);
    private _cursor: number = 0;

    public reset(): void {
        this._digest[0] = 0x67452301;
        this._digest[1] = 0xefcdab89;
        this._digest[2] = 0x98badcfe;
        this._digest[3] = 0x10325476;
        this._digest[4] = 0x76543210;
        this._digest[5] = 0xfedcba98;
        this._digest[6] = 0x89abcdef;
        this._digest[7] = 0x01234567;
        memset(this._length, 0);
        this._cursor = 0;
        memset(this._buffer, 0);
    }
    
    public update(source: Uint8Array, sourceStart: number = 0, sourceEnd: number = source.length): void {
        const buffer: number = 64 - this._cursor;
        const length: number = sourceEnd - sourceStart;
        let i: number = sourceStart;

        RIPEMD256.__U64_ADD__(this._length, length);

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
            memcpy(RIPEMD256.__PADLEN__, this._buffer, 0, 56 - this._cursor, this._cursor);
            u32enc(this._length, this._buffer, true, 0, 2, 56);
            this._transform(this._buffer);
        } else {
            memcpy(RIPEMD256.__PADLEN__, this._buffer, 0, 64 - this._cursor, this._cursor);
            this._transform(this._buffer);
            u32enc(this._length, RIPEMD256.__PADLEN__, true, 0, 2, 64);
            this._transform(RIPEMD256.__PADLEN__, 8);
            memset(RIPEMD256.__PADLEN__, 0, 64);
        }

        const output: Uint8Array = u32enc(this._digest, new Uint8Array(32), true);
        this.reset();

        return output;
    }

    private _transform(block: Uint8Array, start: number = 0): void {
        let aa: number = this._digest[0];
        let bb: number = this._digest[1];
        let cc: number = this._digest[2];
        let dd: number = this._digest[3];

        let aaa: number = this._digest[4];
        let bbb: number = this._digest[5];
        let ccc: number = this._digest[6];
        let ddd: number = this._digest[7];

        u32dec(block, RIPEMD256.__X__, true, start, start + 64);
        
        /* round 1 */
        aa = RIPEMD256.__FF__(aa, bb, cc, dd, RIPEMD256.__X__[ 0], 11);
        dd = RIPEMD256.__FF__(dd, aa, bb, cc, RIPEMD256.__X__[ 1], 14);
        cc = RIPEMD256.__FF__(cc, dd, aa, bb, RIPEMD256.__X__[ 2], 15);
        bb = RIPEMD256.__FF__(bb, cc, dd, aa, RIPEMD256.__X__[ 3], 12);
        aa = RIPEMD256.__FF__(aa, bb, cc, dd, RIPEMD256.__X__[ 4],  5);
        dd = RIPEMD256.__FF__(dd, aa, bb, cc, RIPEMD256.__X__[ 5],  8);
        cc = RIPEMD256.__FF__(cc, dd, aa, bb, RIPEMD256.__X__[ 6],  7);
        bb = RIPEMD256.__FF__(bb, cc, dd, aa, RIPEMD256.__X__[ 7],  9);
        aa = RIPEMD256.__FF__(aa, bb, cc, dd, RIPEMD256.__X__[ 8], 11);
        dd = RIPEMD256.__FF__(dd, aa, bb, cc, RIPEMD256.__X__[ 9], 13);
        cc = RIPEMD256.__FF__(cc, dd, aa, bb, RIPEMD256.__X__[10], 14);
        bb = RIPEMD256.__FF__(bb, cc, dd, aa, RIPEMD256.__X__[11], 15);
        aa = RIPEMD256.__FF__(aa, bb, cc, dd, RIPEMD256.__X__[12],  6);
        dd = RIPEMD256.__FF__(dd, aa, bb, cc, RIPEMD256.__X__[13],  7);
        cc = RIPEMD256.__FF__(cc, dd, aa, bb, RIPEMD256.__X__[14],  9);
        bb = RIPEMD256.__FF__(bb, cc, dd, aa, RIPEMD256.__X__[15],  8);
        
        /* parallel round 1 */
        aaa = RIPEMD256.__III__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[ 5],  8); 
        ddd = RIPEMD256.__III__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[14],  9);
        ccc = RIPEMD256.__III__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[ 7],  9);
        bbb = RIPEMD256.__III__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[ 0], 11);
        aaa = RIPEMD256.__III__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[ 9], 13);
        ddd = RIPEMD256.__III__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[ 2], 15);
        ccc = RIPEMD256.__III__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[11], 15);
        bbb = RIPEMD256.__III__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[ 4],  5);
        aaa = RIPEMD256.__III__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[13],  7);
        ddd = RIPEMD256.__III__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[ 6],  7);
        ccc = RIPEMD256.__III__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[15],  8);
        bbb = RIPEMD256.__III__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[ 8], 11);
        aaa = RIPEMD256.__III__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[ 1], 14);
        ddd = RIPEMD256.__III__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[10], 14);
        ccc = RIPEMD256.__III__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[ 3], 12);
        bbb = RIPEMD256.__III__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[12],  6);
        
        aa ^= aaa; aaa ^= aa; aa ^= aaa;
        
        /* round 2 */
        aa = RIPEMD256.__GG__(aa, bb, cc, dd, RIPEMD256.__X__[ 7],  7);
        dd = RIPEMD256.__GG__(dd, aa, bb, cc, RIPEMD256.__X__[ 4],  6);
        cc = RIPEMD256.__GG__(cc, dd, aa, bb, RIPEMD256.__X__[13],  8);
        bb = RIPEMD256.__GG__(bb, cc, dd, aa, RIPEMD256.__X__[ 1], 13);
        aa = RIPEMD256.__GG__(aa, bb, cc, dd, RIPEMD256.__X__[10], 11);
        dd = RIPEMD256.__GG__(dd, aa, bb, cc, RIPEMD256.__X__[ 6],  9);
        cc = RIPEMD256.__GG__(cc, dd, aa, bb, RIPEMD256.__X__[15],  7);
        bb = RIPEMD256.__GG__(bb, cc, dd, aa, RIPEMD256.__X__[ 3], 15);
        aa = RIPEMD256.__GG__(aa, bb, cc, dd, RIPEMD256.__X__[12],  7);
        dd = RIPEMD256.__GG__(dd, aa, bb, cc, RIPEMD256.__X__[ 0], 12);
        cc = RIPEMD256.__GG__(cc, dd, aa, bb, RIPEMD256.__X__[ 9], 15);
        bb = RIPEMD256.__GG__(bb, cc, dd, aa, RIPEMD256.__X__[ 5],  9);
        aa = RIPEMD256.__GG__(aa, bb, cc, dd, RIPEMD256.__X__[ 2], 11);
        dd = RIPEMD256.__GG__(dd, aa, bb, cc, RIPEMD256.__X__[14],  7);
        cc = RIPEMD256.__GG__(cc, dd, aa, bb, RIPEMD256.__X__[11], 13);
        bb = RIPEMD256.__GG__(bb, cc, dd, aa, RIPEMD256.__X__[ 8], 12);
        
        /* parallel round 2 */
        aaa = RIPEMD256.__HHH__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[ 6],  9);
        ddd = RIPEMD256.__HHH__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[11], 13);
        ccc = RIPEMD256.__HHH__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[ 3], 15);
        bbb = RIPEMD256.__HHH__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[ 7],  7);
        aaa = RIPEMD256.__HHH__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[ 0], 12);
        ddd = RIPEMD256.__HHH__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[13],  8);
        ccc = RIPEMD256.__HHH__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[ 5],  9);
        bbb = RIPEMD256.__HHH__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[10], 11);
        aaa = RIPEMD256.__HHH__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[14],  7);
        ddd = RIPEMD256.__HHH__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[15],  7);
        ccc = RIPEMD256.__HHH__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[ 8], 12);
        bbb = RIPEMD256.__HHH__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[12],  7);
        aaa = RIPEMD256.__HHH__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[ 4],  6);
        ddd = RIPEMD256.__HHH__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[ 9], 15);
        ccc = RIPEMD256.__HHH__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[ 1], 13);
        bbb = RIPEMD256.__HHH__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[ 2], 11);
        
        bb ^= bbb; bbb ^= bb; bb ^= bbb;
        
        /* round 3 */
        aa = RIPEMD256.__HH__(aa, bb, cc, dd, RIPEMD256.__X__[ 3], 11);
        dd = RIPEMD256.__HH__(dd, aa, bb, cc, RIPEMD256.__X__[10], 13);
        cc = RIPEMD256.__HH__(cc, dd, aa, bb, RIPEMD256.__X__[14],  6);
        bb = RIPEMD256.__HH__(bb, cc, dd, aa, RIPEMD256.__X__[ 4],  7);
        aa = RIPEMD256.__HH__(aa, bb, cc, dd, RIPEMD256.__X__[ 9], 14);
        dd = RIPEMD256.__HH__(dd, aa, bb, cc, RIPEMD256.__X__[15],  9);
        cc = RIPEMD256.__HH__(cc, dd, aa, bb, RIPEMD256.__X__[ 8], 13);
        bb = RIPEMD256.__HH__(bb, cc, dd, aa, RIPEMD256.__X__[ 1], 15);
        aa = RIPEMD256.__HH__(aa, bb, cc, dd, RIPEMD256.__X__[ 2], 14);
        dd = RIPEMD256.__HH__(dd, aa, bb, cc, RIPEMD256.__X__[ 7],  8);
        cc = RIPEMD256.__HH__(cc, dd, aa, bb, RIPEMD256.__X__[ 0], 13);
        bb = RIPEMD256.__HH__(bb, cc, dd, aa, RIPEMD256.__X__[ 6],  6);
        aa = RIPEMD256.__HH__(aa, bb, cc, dd, RIPEMD256.__X__[13],  5);
        dd = RIPEMD256.__HH__(dd, aa, bb, cc, RIPEMD256.__X__[11], 12);
        cc = RIPEMD256.__HH__(cc, dd, aa, bb, RIPEMD256.__X__[ 5],  7);
        bb = RIPEMD256.__HH__(bb, cc, dd, aa, RIPEMD256.__X__[12],  5);
        
        /* parallel round 3 */   
        aaa = RIPEMD256.__GGG__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[15],  9);
        ddd = RIPEMD256.__GGG__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[ 5],  7);
        ccc = RIPEMD256.__GGG__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[ 1], 15);
        bbb = RIPEMD256.__GGG__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[ 3], 11);
        aaa = RIPEMD256.__GGG__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[ 7],  8);
        ddd = RIPEMD256.__GGG__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[14],  6);
        ccc = RIPEMD256.__GGG__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[ 6],  6);
        bbb = RIPEMD256.__GGG__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[ 9], 14);
        aaa = RIPEMD256.__GGG__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[11], 12);
        ddd = RIPEMD256.__GGG__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[ 8], 13);
        ccc = RIPEMD256.__GGG__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[12],  5);
        bbb = RIPEMD256.__GGG__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[ 2], 14);
        aaa = RIPEMD256.__GGG__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[10], 13);
        ddd = RIPEMD256.__GGG__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[ 0], 13);
        ccc = RIPEMD256.__GGG__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[ 4],  7);
        bbb = RIPEMD256.__GGG__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[13],  5);
        
        cc ^= ccc; ccc ^= cc; cc ^= ccc;
        
        /* round 4 */
        aa = RIPEMD256.__II__(aa, bb, cc, dd, RIPEMD256.__X__[ 1], 11);
        dd = RIPEMD256.__II__(dd, aa, bb, cc, RIPEMD256.__X__[ 9], 12);
        cc = RIPEMD256.__II__(cc, dd, aa, bb, RIPEMD256.__X__[11], 14);
        bb = RIPEMD256.__II__(bb, cc, dd, aa, RIPEMD256.__X__[10], 15);
        aa = RIPEMD256.__II__(aa, bb, cc, dd, RIPEMD256.__X__[ 0], 14);
        dd = RIPEMD256.__II__(dd, aa, bb, cc, RIPEMD256.__X__[ 8], 15);
        cc = RIPEMD256.__II__(cc, dd, aa, bb, RIPEMD256.__X__[12],  9);
        bb = RIPEMD256.__II__(bb, cc, dd, aa, RIPEMD256.__X__[ 4],  8);
        aa = RIPEMD256.__II__(aa, bb, cc, dd, RIPEMD256.__X__[13],  9);
        dd = RIPEMD256.__II__(dd, aa, bb, cc, RIPEMD256.__X__[ 3], 14);
        cc = RIPEMD256.__II__(cc, dd, aa, bb, RIPEMD256.__X__[ 7],  5);
        bb = RIPEMD256.__II__(bb, cc, dd, aa, RIPEMD256.__X__[15],  6);
        aa = RIPEMD256.__II__(aa, bb, cc, dd, RIPEMD256.__X__[14],  8);
        dd = RIPEMD256.__II__(dd, aa, bb, cc, RIPEMD256.__X__[ 5],  6);
        cc = RIPEMD256.__II__(cc, dd, aa, bb, RIPEMD256.__X__[ 6],  5);
        bb = RIPEMD256.__II__(bb, cc, dd, aa, RIPEMD256.__X__[ 2], 12);
        
        /* parallel round 4 */
        aaa = RIPEMD256.__FFF__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[ 8], 15);
        ddd = RIPEMD256.__FFF__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[ 6],  5);
        ccc = RIPEMD256.__FFF__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[ 4],  8);
        bbb = RIPEMD256.__FFF__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[ 1], 11);
        aaa = RIPEMD256.__FFF__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[ 3], 14);
        ddd = RIPEMD256.__FFF__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[11], 14);
        ccc = RIPEMD256.__FFF__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[15],  6);
        bbb = RIPEMD256.__FFF__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[ 0], 14);
        aaa = RIPEMD256.__FFF__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[ 5],  6);
        ddd = RIPEMD256.__FFF__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[12],  9);
        ccc = RIPEMD256.__FFF__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[ 2], 12);
        bbb = RIPEMD256.__FFF__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[13],  9);
        aaa = RIPEMD256.__FFF__(aaa, bbb, ccc, ddd, RIPEMD256.__X__[ 9], 12);
        ddd = RIPEMD256.__FFF__(ddd, aaa, bbb, ccc, RIPEMD256.__X__[ 7],  5);
        ccc = RIPEMD256.__FFF__(ccc, ddd, aaa, bbb, RIPEMD256.__X__[10], 15);
        bbb = RIPEMD256.__FFF__(bbb, ccc, ddd, aaa, RIPEMD256.__X__[14],  8);
        
        dd ^= ddd; ddd ^= dd; dd ^= ddd;
        
        this._digest[0] += aa;
        this._digest[1] += bb;
        this._digest[2] += cc;
        this._digest[3] += dd;
        this._digest[4] += aaa;
        this._digest[5] += bbb;
        this._digest[6] += ccc;
        this._digest[7] += ddd;

        memset(RIPEMD256.__X__, 0);
    }
}

export default RIPEMD256;
