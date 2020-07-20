/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import HashAlgorithm from "./HashAlgorithm";
import memcpy from "../buffer/memcpy";
import memset from "../buffer/memset";
import u32vdec from "../buffer/u32vdec";
import u32venc from "../buffer/u32venc";

class RIPEMD160 extends HashAlgorithm {
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

    private static __J__(x: number, y: number, z: number): number {
        return ((x) ^ ((y) | ~(z)));
    }

    private static __FF__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__F__((b), (c), (d)) + (x);
        (a)  = RIPEMD160.__ROTL__((a), (s)) + (e);
        return a;
    }

    private static __GG__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__G__((b), (c), (d)) + (x) + 0x5a827999;
        (a)  = RIPEMD160.__ROTL__((a), (s)) + (e);
        return a;
    }

    private static __HH__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__H__((b), (c), (d)) + (x) + 0x6ed9eba1;
        (a)  = RIPEMD160.__ROTL__((a), (s)) + (e);
        return a;
    }

    private static __II__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__I__((b), (c), (d)) + (x) + 0x8f1bbcdc;
        (a)  = RIPEMD160.__ROTL__((a), (s)) + (e);
        return a;
    }

    private static __JJ__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__J__((b), (c), (d)) + (x) + 0xa953fd4e;
        (a)  = RIPEMD160.__ROTL__((a), (s)) + (e);
        return a;
    }

    private static __FFF__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__F__((b), (c), (d)) + (x);
        (a)  = RIPEMD160.__ROTL__((a), (s)) + (e);
        return a;
    }

    private static __GGG__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__G__((b), (c), (d)) + (x) + 0x7a6d76e9;
        (a)  = RIPEMD160.__ROTL__((a), (s)) + (e);
        return a;
    }

    private static __HHH__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__H__((b), (c), (d)) + (x) + 0x6d703ef3;
        (a)  = RIPEMD160.__ROTL__((a), (s)) + (e);
        return a;
    }

    private static __III__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__I__((b), (c), (d)) + (x) + 0x5c4dd124;
        (a)  = RIPEMD160.__ROTL__((a), (s)) + (e);
        return a;
    }

    private static __JJJ__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__J__((b), (c), (d)) + (x) + 0x50a28be6;
        (a)  = RIPEMD160.__ROTL__((a), (s)) + (e);
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

    private _digest: Uint32Array = new Uint32Array([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
    private _length: Uint32Array = new Uint32Array(2);
    private _buffer: Uint8Array = new Uint8Array(64);
    private _cursor: number = 0;

    public reset(): void {
        this._digest[0] = 0x67452301;
        this._digest[1] = 0xefcdab89;
        this._digest[2] = 0x98badcfe;
        this._digest[3] = 0x10325476;
        this._digest[4] = 0xc3d2e1f0;
        memset(this._length, 0);
        this._cursor = 0;
        memset(this._buffer, 0);
    }
    
    public update(source: Uint8Array, sourceStart: number = 0, sourceEnd: number = source.length): void {
        const buffer: number = 64 - this._cursor;
        const length: number = sourceEnd - sourceStart;
        let i: number = sourceStart;

        RIPEMD160.__U64_ADD__(this._length, length);

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
            memcpy(RIPEMD160.__PADLEN__, this._buffer, 0, 56 - this._cursor, this._cursor);
            u32venc(this._length, this._buffer, true, 0, 2, 56);
            this._transform(this._buffer);
        } else {
            memcpy(RIPEMD160.__PADLEN__, this._buffer, 0, 64 - this._cursor, this._cursor);
            this._transform(this._buffer);
            u32venc(this._length, RIPEMD160.__PADLEN__, true, 0, 2, 64);
            this._transform(RIPEMD160.__PADLEN__, 8);
            memset(RIPEMD160.__PADLEN__, 0, 64);
        }

        const output: Uint8Array = u32venc(this._digest, new Uint8Array(20), true);
        this.reset();

        return output;
    }

    private _transform(block: Uint8Array, start: number = 0): void {
        let aa: number = this._digest[0];
        let bb: number = this._digest[1];
        let cc: number = this._digest[2];
        let dd: number = this._digest[3];
        let ee: number = this._digest[4];

        let aaa: number = aa;
        let bbb: number = bb;
        let ccc: number = cc;
        let ddd: number = dd;
        let eee: number = ee;

        u32vdec(block, RIPEMD160.__X__, true, start, start + 64);
        
        /* round 1 */
        aa = RIPEMD160.__FF__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 0], 11); cc = RIPEMD160.__ROTL__(cc, 10);
        ee = RIPEMD160.__FF__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 1], 14); bb = RIPEMD160.__ROTL__(bb, 10);
        dd = RIPEMD160.__FF__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 2], 15); aa = RIPEMD160.__ROTL__(aa, 10);
        cc = RIPEMD160.__FF__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 3], 12); ee = RIPEMD160.__ROTL__(ee, 10);
        bb = RIPEMD160.__FF__(bb, cc, dd, ee, aa, RIPEMD160.__X__[ 4],  5); dd = RIPEMD160.__ROTL__(dd, 10);
        aa = RIPEMD160.__FF__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 5],  8); cc = RIPEMD160.__ROTL__(cc, 10);
        ee = RIPEMD160.__FF__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 6],  7); bb = RIPEMD160.__ROTL__(bb, 10);
        dd = RIPEMD160.__FF__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 7],  9); aa = RIPEMD160.__ROTL__(aa, 10);
        cc = RIPEMD160.__FF__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 8], 11); ee = RIPEMD160.__ROTL__(ee, 10);
        bb = RIPEMD160.__FF__(bb, cc, dd, ee, aa, RIPEMD160.__X__[ 9], 13); dd = RIPEMD160.__ROTL__(dd, 10);
        aa = RIPEMD160.__FF__(aa, bb, cc, dd, ee, RIPEMD160.__X__[10], 14); cc = RIPEMD160.__ROTL__(cc, 10);
        ee = RIPEMD160.__FF__(ee, aa, bb, cc, dd, RIPEMD160.__X__[11], 15); bb = RIPEMD160.__ROTL__(bb, 10);
        dd = RIPEMD160.__FF__(dd, ee, aa, bb, cc, RIPEMD160.__X__[12],  6); aa = RIPEMD160.__ROTL__(aa, 10);
        cc = RIPEMD160.__FF__(cc, dd, ee, aa, bb, RIPEMD160.__X__[13],  7); ee = RIPEMD160.__ROTL__(ee, 10);
        bb = RIPEMD160.__FF__(bb, cc, dd, ee, aa, RIPEMD160.__X__[14],  9); dd = RIPEMD160.__ROTL__(dd, 10);
        aa = RIPEMD160.__FF__(aa, bb, cc, dd, ee, RIPEMD160.__X__[15],  8); cc = RIPEMD160.__ROTL__(cc, 10);
        
        /* parallel round 1 */
        aaa = RIPEMD160.__JJJ__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 5],  8); ccc = RIPEMD160.__ROTL__(ccc, 10);
        eee = RIPEMD160.__JJJ__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[14],  9); bbb = RIPEMD160.__ROTL__(bbb, 10);
        ddd = RIPEMD160.__JJJ__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 7],  9); aaa = RIPEMD160.__ROTL__(aaa, 10);
        ccc = RIPEMD160.__JJJ__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 0], 11); eee = RIPEMD160.__ROTL__(eee, 10);
        bbb = RIPEMD160.__JJJ__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 9], 13); ddd = RIPEMD160.__ROTL__(ddd, 10);
        aaa = RIPEMD160.__JJJ__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 2], 15); ccc = RIPEMD160.__ROTL__(ccc, 10);
        eee = RIPEMD160.__JJJ__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[11], 15); bbb = RIPEMD160.__ROTL__(bbb, 10);
        ddd = RIPEMD160.__JJJ__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 4],  5); aaa = RIPEMD160.__ROTL__(aaa, 10);
        ccc = RIPEMD160.__JJJ__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[13],  7); eee = RIPEMD160.__ROTL__(eee, 10);
        bbb = RIPEMD160.__JJJ__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 6],  7); ddd = RIPEMD160.__ROTL__(ddd, 10);
        aaa = RIPEMD160.__JJJ__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[15],  8); ccc = RIPEMD160.__ROTL__(ccc, 10);
        eee = RIPEMD160.__JJJ__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 8], 11); bbb = RIPEMD160.__ROTL__(bbb, 10);
        ddd = RIPEMD160.__JJJ__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 1], 14); aaa = RIPEMD160.__ROTL__(aaa, 10);
        ccc = RIPEMD160.__JJJ__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[10], 14); eee = RIPEMD160.__ROTL__(eee, 10);
        bbb = RIPEMD160.__JJJ__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 3], 12); ddd = RIPEMD160.__ROTL__(ddd, 10);
        aaa = RIPEMD160.__JJJ__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[12],  6); ccc = RIPEMD160.__ROTL__(ccc, 10);
        
        /* round 2 */
        ee = RIPEMD160.__GG__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 7],  7); bb = RIPEMD160.__ROTL__(bb, 10);
        dd = RIPEMD160.__GG__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 4],  6); aa = RIPEMD160.__ROTL__(aa, 10);
        cc = RIPEMD160.__GG__(cc, dd, ee, aa, bb, RIPEMD160.__X__[13],  8); ee = RIPEMD160.__ROTL__(ee, 10);
        bb = RIPEMD160.__GG__(bb, cc, dd, ee, aa, RIPEMD160.__X__[ 1], 13); dd = RIPEMD160.__ROTL__(dd, 10);
        aa = RIPEMD160.__GG__(aa, bb, cc, dd, ee, RIPEMD160.__X__[10], 11); cc = RIPEMD160.__ROTL__(cc, 10);
        ee = RIPEMD160.__GG__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 6],  9); bb = RIPEMD160.__ROTL__(bb, 10);
        dd = RIPEMD160.__GG__(dd, ee, aa, bb, cc, RIPEMD160.__X__[15],  7); aa = RIPEMD160.__ROTL__(aa, 10);
        cc = RIPEMD160.__GG__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 3], 15); ee = RIPEMD160.__ROTL__(ee, 10);
        bb = RIPEMD160.__GG__(bb, cc, dd, ee, aa, RIPEMD160.__X__[12],  7); dd = RIPEMD160.__ROTL__(dd, 10);
        aa = RIPEMD160.__GG__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 0], 12); cc = RIPEMD160.__ROTL__(cc, 10);
        ee = RIPEMD160.__GG__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 9], 15); bb = RIPEMD160.__ROTL__(bb, 10);
        dd = RIPEMD160.__GG__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 5],  9); aa = RIPEMD160.__ROTL__(aa, 10);
        cc = RIPEMD160.__GG__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 2], 11); ee = RIPEMD160.__ROTL__(ee, 10);
        bb = RIPEMD160.__GG__(bb, cc, dd, ee, aa, RIPEMD160.__X__[14],  7); dd = RIPEMD160.__ROTL__(dd, 10);
        aa = RIPEMD160.__GG__(aa, bb, cc, dd, ee, RIPEMD160.__X__[11], 13); cc = RIPEMD160.__ROTL__(cc, 10);
        ee = RIPEMD160.__GG__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 8], 12); bb = RIPEMD160.__ROTL__(bb, 10);
        
        /* parallel round 2 */
        eee = RIPEMD160.__III__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 6],  9); bbb = RIPEMD160.__ROTL__(bbb, 10);
        ddd = RIPEMD160.__III__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[11], 13); aaa = RIPEMD160.__ROTL__(aaa, 10);
        ccc = RIPEMD160.__III__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 3], 15); eee = RIPEMD160.__ROTL__(eee, 10);
        bbb = RIPEMD160.__III__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 7],  7); ddd = RIPEMD160.__ROTL__(ddd, 10);
        aaa = RIPEMD160.__III__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 0], 12); ccc = RIPEMD160.__ROTL__(ccc, 10);
        eee = RIPEMD160.__III__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[13],  8); bbb = RIPEMD160.__ROTL__(bbb, 10);
        ddd = RIPEMD160.__III__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 5],  9); aaa = RIPEMD160.__ROTL__(aaa, 10);
        ccc = RIPEMD160.__III__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[10], 11); eee = RIPEMD160.__ROTL__(eee, 10);
        bbb = RIPEMD160.__III__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[14],  7); ddd = RIPEMD160.__ROTL__(ddd, 10);
        aaa = RIPEMD160.__III__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[15],  7); ccc = RIPEMD160.__ROTL__(ccc, 10);
        eee = RIPEMD160.__III__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 8], 12); bbb = RIPEMD160.__ROTL__(bbb, 10);
        ddd = RIPEMD160.__III__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[12],  7); aaa = RIPEMD160.__ROTL__(aaa, 10);
        ccc = RIPEMD160.__III__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 4],  6); eee = RIPEMD160.__ROTL__(eee, 10);
        bbb = RIPEMD160.__III__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 9], 15); ddd = RIPEMD160.__ROTL__(ddd, 10);
        aaa = RIPEMD160.__III__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 1], 13); ccc = RIPEMD160.__ROTL__(ccc, 10);
        eee = RIPEMD160.__III__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 2], 11); bbb = RIPEMD160.__ROTL__(bbb, 10);
        
        /* round 3 */
        dd = RIPEMD160.__HH__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 3], 11); aa = RIPEMD160.__ROTL__(aa, 10);
        cc = RIPEMD160.__HH__(cc, dd, ee, aa, bb, RIPEMD160.__X__[10], 13); ee = RIPEMD160.__ROTL__(ee, 10);
        bb = RIPEMD160.__HH__(bb, cc, dd, ee, aa, RIPEMD160.__X__[14],  6); dd = RIPEMD160.__ROTL__(dd, 10);
        aa = RIPEMD160.__HH__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 4],  7); cc = RIPEMD160.__ROTL__(cc, 10);
        ee = RIPEMD160.__HH__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 9], 14); bb = RIPEMD160.__ROTL__(bb, 10);
        dd = RIPEMD160.__HH__(dd, ee, aa, bb, cc, RIPEMD160.__X__[15],  9); aa = RIPEMD160.__ROTL__(aa, 10);
        cc = RIPEMD160.__HH__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 8], 13); ee = RIPEMD160.__ROTL__(ee, 10);
        bb = RIPEMD160.__HH__(bb, cc, dd, ee, aa, RIPEMD160.__X__[ 1], 15); dd = RIPEMD160.__ROTL__(dd, 10);
        aa = RIPEMD160.__HH__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 2], 14); cc = RIPEMD160.__ROTL__(cc, 10);
        ee = RIPEMD160.__HH__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 7],  8); bb = RIPEMD160.__ROTL__(bb, 10);
        dd = RIPEMD160.__HH__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 0], 13); aa = RIPEMD160.__ROTL__(aa, 10);
        cc = RIPEMD160.__HH__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 6],  6); ee = RIPEMD160.__ROTL__(ee, 10);
        bb = RIPEMD160.__HH__(bb, cc, dd, ee, aa, RIPEMD160.__X__[13],  5); dd = RIPEMD160.__ROTL__(dd, 10);
        aa = RIPEMD160.__HH__(aa, bb, cc, dd, ee, RIPEMD160.__X__[11], 12); cc = RIPEMD160.__ROTL__(cc, 10);
        ee = RIPEMD160.__HH__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 5],  7); bb = RIPEMD160.__ROTL__(bb, 10);
        dd = RIPEMD160.__HH__(dd, ee, aa, bb, cc, RIPEMD160.__X__[12],  5); aa = RIPEMD160.__ROTL__(aa, 10);
        
        /* parallel round 3 */
        ddd = RIPEMD160.__HHH__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[15],  9); aaa = RIPEMD160.__ROTL__(aaa, 10);
        ccc = RIPEMD160.__HHH__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 5],  7); eee = RIPEMD160.__ROTL__(eee, 10);
        bbb = RIPEMD160.__HHH__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 1], 15); ddd = RIPEMD160.__ROTL__(ddd, 10);
        aaa = RIPEMD160.__HHH__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 3], 11); ccc = RIPEMD160.__ROTL__(ccc, 10);
        eee = RIPEMD160.__HHH__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 7],  8); bbb = RIPEMD160.__ROTL__(bbb, 10);
        ddd = RIPEMD160.__HHH__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[14],  6); aaa = RIPEMD160.__ROTL__(aaa, 10);
        ccc = RIPEMD160.__HHH__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 6],  6); eee = RIPEMD160.__ROTL__(eee, 10);
        bbb = RIPEMD160.__HHH__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 9], 14); ddd = RIPEMD160.__ROTL__(ddd, 10);
        aaa = RIPEMD160.__HHH__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[11], 12); ccc = RIPEMD160.__ROTL__(ccc, 10);
        eee = RIPEMD160.__HHH__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 8], 13); bbb = RIPEMD160.__ROTL__(bbb, 10);
        ddd = RIPEMD160.__HHH__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[12],  5); aaa = RIPEMD160.__ROTL__(aaa, 10);
        ccc = RIPEMD160.__HHH__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 2], 14); eee = RIPEMD160.__ROTL__(eee, 10);
        bbb = RIPEMD160.__HHH__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[10], 13); ddd = RIPEMD160.__ROTL__(ddd, 10);
        aaa = RIPEMD160.__HHH__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 0], 13); ccc = RIPEMD160.__ROTL__(ccc, 10);
        eee = RIPEMD160.__HHH__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 4],  7); bbb = RIPEMD160.__ROTL__(bbb, 10);
        ddd = RIPEMD160.__HHH__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[13],  5); aaa = RIPEMD160.__ROTL__(aaa, 10);
        
        /* round 4 */
        cc = RIPEMD160.__II__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 1], 11); ee = RIPEMD160.__ROTL__(ee, 10);
        bb = RIPEMD160.__II__(bb, cc, dd, ee, aa, RIPEMD160.__X__[ 9], 12); dd = RIPEMD160.__ROTL__(dd, 10);
        aa = RIPEMD160.__II__(aa, bb, cc, dd, ee, RIPEMD160.__X__[11], 14); cc = RIPEMD160.__ROTL__(cc, 10);
        ee = RIPEMD160.__II__(ee, aa, bb, cc, dd, RIPEMD160.__X__[10], 15); bb = RIPEMD160.__ROTL__(bb, 10);
        dd = RIPEMD160.__II__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 0], 14); aa = RIPEMD160.__ROTL__(aa, 10);
        cc = RIPEMD160.__II__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 8], 15); ee = RIPEMD160.__ROTL__(ee, 10);
        bb = RIPEMD160.__II__(bb, cc, dd, ee, aa, RIPEMD160.__X__[12],  9); dd = RIPEMD160.__ROTL__(dd, 10);
        aa = RIPEMD160.__II__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 4],  8); cc = RIPEMD160.__ROTL__(cc, 10);
        ee = RIPEMD160.__II__(ee, aa, bb, cc, dd, RIPEMD160.__X__[13],  9); bb = RIPEMD160.__ROTL__(bb, 10);
        dd = RIPEMD160.__II__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 3], 14); aa = RIPEMD160.__ROTL__(aa, 10);
        cc = RIPEMD160.__II__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 7],  5); ee = RIPEMD160.__ROTL__(ee, 10);
        bb = RIPEMD160.__II__(bb, cc, dd, ee, aa, RIPEMD160.__X__[15],  6); dd = RIPEMD160.__ROTL__(dd, 10);
        aa = RIPEMD160.__II__(aa, bb, cc, dd, ee, RIPEMD160.__X__[14],  8); cc = RIPEMD160.__ROTL__(cc, 10);
        ee = RIPEMD160.__II__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 5],  6); bb = RIPEMD160.__ROTL__(bb, 10);
        dd = RIPEMD160.__II__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 6],  5); aa = RIPEMD160.__ROTL__(aa, 10);
        cc = RIPEMD160.__II__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 2], 12); ee = RIPEMD160.__ROTL__(ee, 10);
        
        /* parallel round 4 */   
        ccc = RIPEMD160.__GGG__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 8], 15); eee = RIPEMD160.__ROTL__(eee, 10);
        bbb = RIPEMD160.__GGG__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 6],  5); ddd = RIPEMD160.__ROTL__(ddd, 10);
        aaa = RIPEMD160.__GGG__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 4],  8); ccc = RIPEMD160.__ROTL__(ccc, 10);
        eee = RIPEMD160.__GGG__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 1], 11); bbb = RIPEMD160.__ROTL__(bbb, 10);
        ddd = RIPEMD160.__GGG__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 3], 14); aaa = RIPEMD160.__ROTL__(aaa, 10);
        ccc = RIPEMD160.__GGG__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[11], 14); eee = RIPEMD160.__ROTL__(eee, 10);
        bbb = RIPEMD160.__GGG__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[15],  6); ddd = RIPEMD160.__ROTL__(ddd, 10);
        aaa = RIPEMD160.__GGG__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 0], 14); ccc = RIPEMD160.__ROTL__(ccc, 10);
        eee = RIPEMD160.__GGG__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 5],  6); bbb = RIPEMD160.__ROTL__(bbb, 10);
        ddd = RIPEMD160.__GGG__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[12],  9); aaa = RIPEMD160.__ROTL__(aaa, 10);
        ccc = RIPEMD160.__GGG__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 2], 12); eee = RIPEMD160.__ROTL__(eee, 10);
        bbb = RIPEMD160.__GGG__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[13],  9); ddd = RIPEMD160.__ROTL__(ddd, 10);
        aaa = RIPEMD160.__GGG__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 9], 12); ccc = RIPEMD160.__ROTL__(ccc, 10);
        eee = RIPEMD160.__GGG__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 7],  5); bbb = RIPEMD160.__ROTL__(bbb, 10);
        ddd = RIPEMD160.__GGG__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[10], 15); aaa = RIPEMD160.__ROTL__(aaa, 10);
        ccc = RIPEMD160.__GGG__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[14],  8); eee = RIPEMD160.__ROTL__(eee, 10);
        
        /* round 5 */
        bb = RIPEMD160.__JJ__(bb, cc, dd, ee, aa, RIPEMD160.__X__[ 4],  9); dd = RIPEMD160.__ROTL__(dd, 10);
        aa = RIPEMD160.__JJ__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 0], 15); cc = RIPEMD160.__ROTL__(cc, 10);
        ee = RIPEMD160.__JJ__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 5],  5); bb = RIPEMD160.__ROTL__(bb, 10);
        dd = RIPEMD160.__JJ__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 9], 11); aa = RIPEMD160.__ROTL__(aa, 10);
        cc = RIPEMD160.__JJ__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 7],  6); ee = RIPEMD160.__ROTL__(ee, 10);
        bb = RIPEMD160.__JJ__(bb, cc, dd, ee, aa, RIPEMD160.__X__[12],  8); dd = RIPEMD160.__ROTL__(dd, 10);
        aa = RIPEMD160.__JJ__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 2], 13); cc = RIPEMD160.__ROTL__(cc, 10);
        ee = RIPEMD160.__JJ__(ee, aa, bb, cc, dd, RIPEMD160.__X__[10], 12); bb = RIPEMD160.__ROTL__(bb, 10);
        dd = RIPEMD160.__JJ__(dd, ee, aa, bb, cc, RIPEMD160.__X__[14],  5); aa = RIPEMD160.__ROTL__(aa, 10);
        cc = RIPEMD160.__JJ__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 1], 12); ee = RIPEMD160.__ROTL__(ee, 10);
        bb = RIPEMD160.__JJ__(bb, cc, dd, ee, aa, RIPEMD160.__X__[ 3], 13); dd = RIPEMD160.__ROTL__(dd, 10);
        aa = RIPEMD160.__JJ__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 8], 14); cc = RIPEMD160.__ROTL__(cc, 10);
        ee = RIPEMD160.__JJ__(ee, aa, bb, cc, dd, RIPEMD160.__X__[11], 11); bb = RIPEMD160.__ROTL__(bb, 10);
        dd = RIPEMD160.__JJ__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 6],  8); aa = RIPEMD160.__ROTL__(aa, 10);
        cc = RIPEMD160.__JJ__(cc, dd, ee, aa, bb, RIPEMD160.__X__[15],  5); ee = RIPEMD160.__ROTL__(ee, 10);
        bb = RIPEMD160.__JJ__(bb, cc, dd, ee, aa, RIPEMD160.__X__[13],  6); dd = RIPEMD160.__ROTL__(dd, 10);
        
        /* parallel round 5 */
        bbb = RIPEMD160.__FFF__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[12],  8); ddd = RIPEMD160.__ROTL__(ddd, 10);
        aaa = RIPEMD160.__FFF__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[15],  5); ccc = RIPEMD160.__ROTL__(ccc, 10);
        eee = RIPEMD160.__FFF__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[10], 12); bbb = RIPEMD160.__ROTL__(bbb, 10);
        ddd = RIPEMD160.__FFF__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 4],  9); aaa = RIPEMD160.__ROTL__(aaa, 10);
        ccc = RIPEMD160.__FFF__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 1], 12); eee = RIPEMD160.__ROTL__(eee, 10);
        bbb = RIPEMD160.__FFF__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 5],  5); ddd = RIPEMD160.__ROTL__(ddd, 10);
        aaa = RIPEMD160.__FFF__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 8], 14); ccc = RIPEMD160.__ROTL__(ccc, 10);
        eee = RIPEMD160.__FFF__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 7],  6); bbb = RIPEMD160.__ROTL__(bbb, 10);
        ddd = RIPEMD160.__FFF__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 6],  8); aaa = RIPEMD160.__ROTL__(aaa, 10);
        ccc = RIPEMD160.__FFF__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 2], 13); eee = RIPEMD160.__ROTL__(eee, 10);
        bbb = RIPEMD160.__FFF__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[13],  6); ddd = RIPEMD160.__ROTL__(ddd, 10);
        aaa = RIPEMD160.__FFF__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[14],  5); ccc = RIPEMD160.__ROTL__(ccc, 10);
        eee = RIPEMD160.__FFF__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 0], 15); bbb = RIPEMD160.__ROTL__(bbb, 10);
        ddd = RIPEMD160.__FFF__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 3], 13); aaa = RIPEMD160.__ROTL__(aaa, 10);
        ccc = RIPEMD160.__FFF__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 9], 11); eee = RIPEMD160.__ROTL__(eee, 10);
        bbb = RIPEMD160.__FFF__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[11], 11); ddd = RIPEMD160.__ROTL__(ddd, 10);
        
        ddd += cc + this._digest[1];
        this._digest[1] = this._digest[2] + dd + eee;
        this._digest[2] = this._digest[3] + ee + aaa;
        this._digest[3] = this._digest[4] + aa + bbb;
        this._digest[4] = this._digest[0] + bb + ccc;
        this._digest[0] = ddd;

        memset(RIPEMD160.__X__, 0);
    }
}

export default RIPEMD160;
