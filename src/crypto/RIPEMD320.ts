/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import HashAlgorithm from "./HashAlgorithm";
import memcpy from "../buffer/memcpy";
import memset from "../buffer/memset";
import u32dec from "../buffer/u32dec";
import u32enc from "../buffer/u32enc";

class RIPEMD320 extends HashAlgorithm {
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
        (a) += RIPEMD320.__F__((b), (c), (d)) + (x);
        (a)  = RIPEMD320.__ROTATE_LEFT__((a), (s)) + (e);
        return a;
    }

    private static __GG__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD320.__G__((b), (c), (d)) + (x) + 0x5a827999;
        (a)  = RIPEMD320.__ROTATE_LEFT__((a), (s)) + (e);
        return a;
    }

    private static __HH__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD320.__H__((b), (c), (d)) + (x) + 0x6ed9eba1;
        (a)  = RIPEMD320.__ROTATE_LEFT__((a), (s)) + (e);
        return a;
    }

    private static __II__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD320.__I__((b), (c), (d)) + (x) + 0x8f1bbcdc;
        (a)  = RIPEMD320.__ROTATE_LEFT__((a), (s)) + (e);
        return a;
    }

    private static __JJ__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD320.__J__((b), (c), (d)) + (x) + 0xa953fd4e;
        (a)  = RIPEMD320.__ROTATE_LEFT__((a), (s)) + (e);
        return a;
    }

    private static __FFF__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD320.__F__((b), (c), (d)) + (x);
        (a)  = RIPEMD320.__ROTATE_LEFT__((a), (s)) + (e);
        return a;
    }

    private static __GGG__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD320.__G__((b), (c), (d)) + (x) + 0x7a6d76e9;
        (a)  = RIPEMD320.__ROTATE_LEFT__((a), (s)) + (e);
        return a;
    }

    private static __HHH__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD320.__H__((b), (c), (d)) + (x) + 0x6d703ef3;
        (a)  = RIPEMD320.__ROTATE_LEFT__((a), (s)) + (e);
        return a;
    }

    private static __III__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD320.__I__((b), (c), (d)) + (x) + 0x5c4dd124;
        (a)  = RIPEMD320.__ROTATE_LEFT__((a), (s)) + (e);
        return a;
    }

    private static __JJJ__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD320.__J__((b), (c), (d)) + (x) + 0x50a28be6;
        (a)  = RIPEMD320.__ROTATE_LEFT__((a), (s)) + (e);
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

    private _digest: Uint32Array = new Uint32Array([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0, 0x76543210, 0xfedcba98, 0x89abcdef, 0x01234567, 0x3c2d1e0f]);
    private _length: Uint32Array = new Uint32Array(2);
    private _buffer: Uint8Array = new Uint8Array(64);
    private _cursor: number = 0;

    public reset(): void {
        this._digest[0] = 0x67452301;
        this._digest[1] = 0xefcdab89;
        this._digest[2] = 0x98badcfe;
        this._digest[3] = 0x10325476;
        this._digest[4] = 0xc3d2e1f0;
        this._digest[5] = 0x76543210;
        this._digest[6] = 0xfedcba98;
        this._digest[7] = 0x89abcdef;
        this._digest[8] = 0x01234567;
        this._digest[9] = 0x3c2d1e0f;
        memset(this._length, 0);
        this._cursor = 0;
        memset(this._buffer, 0);
    }
    
    public update(source: Uint8Array, sourceStart: number = 0, sourceEnd: number = source.length): void {
        const buffer: number = 64 - this._cursor;
        const length: number = sourceEnd - sourceStart;
        let i: number = sourceStart;

        RIPEMD320.__ADD_LENGTH__(this._length, length);

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
            memcpy(RIPEMD320.__PADLEN__, this._buffer, 0, 56 - this._cursor, this._cursor);
            u32enc(this._length, this._buffer, true, 0, 2, 56);
            this._transform(this._buffer);
        } else {
            memcpy(RIPEMD320.__PADLEN__, this._buffer, 0, 64 - this._cursor, this._cursor);
            this._transform(this._buffer);
            u32enc(this._length, RIPEMD320.__PADLEN__, true, 0, 2, 64);
            this._transform(RIPEMD320.__PADLEN__, 8);
            memset(RIPEMD320.__PADLEN__, 0, 64);
        }

        const output: Uint8Array = u32enc(this._digest, new Uint8Array(40), true);
        this.reset();

        return output;
    }

    private _transform(block: Uint8Array, start: number = 0): void {
        let aa: number = this._digest[0];
        let bb: number = this._digest[1];
        let cc: number = this._digest[2];
        let dd: number = this._digest[3];
        let ee: number = this._digest[4];
        
        let aaa: number = this._digest[5];
        let bbb: number = this._digest[6];
        let ccc: number = this._digest[7];
        let ddd: number = this._digest[8];
        let eee: number = this._digest[9];

        u32dec(block, RIPEMD320.__X__, true, start, start + 64);
        
        /* round 1 */
        aa = RIPEMD320.__FF__(aa, bb, cc, dd, ee, RIPEMD320.__X__[ 0], 11); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        ee = RIPEMD320.__FF__(ee, aa, bb, cc, dd, RIPEMD320.__X__[ 1], 14); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        dd = RIPEMD320.__FF__(dd, ee, aa, bb, cc, RIPEMD320.__X__[ 2], 15); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        cc = RIPEMD320.__FF__(cc, dd, ee, aa, bb, RIPEMD320.__X__[ 3], 12); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        bb = RIPEMD320.__FF__(bb, cc, dd, ee, aa, RIPEMD320.__X__[ 4],  5); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        aa = RIPEMD320.__FF__(aa, bb, cc, dd, ee, RIPEMD320.__X__[ 5],  8); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        ee = RIPEMD320.__FF__(ee, aa, bb, cc, dd, RIPEMD320.__X__[ 6],  7); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        dd = RIPEMD320.__FF__(dd, ee, aa, bb, cc, RIPEMD320.__X__[ 7],  9); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        cc = RIPEMD320.__FF__(cc, dd, ee, aa, bb, RIPEMD320.__X__[ 8], 11); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        bb = RIPEMD320.__FF__(bb, cc, dd, ee, aa, RIPEMD320.__X__[ 9], 13); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        aa = RIPEMD320.__FF__(aa, bb, cc, dd, ee, RIPEMD320.__X__[10], 14); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        ee = RIPEMD320.__FF__(ee, aa, bb, cc, dd, RIPEMD320.__X__[11], 15); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        dd = RIPEMD320.__FF__(dd, ee, aa, bb, cc, RIPEMD320.__X__[12],  6); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        cc = RIPEMD320.__FF__(cc, dd, ee, aa, bb, RIPEMD320.__X__[13],  7); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        bb = RIPEMD320.__FF__(bb, cc, dd, ee, aa, RIPEMD320.__X__[14],  9); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        aa = RIPEMD320.__FF__(aa, bb, cc, dd, ee, RIPEMD320.__X__[15],  8); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        
        /* parallel round 1 */
        aaa = RIPEMD320.__JJJ__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[ 5],  8); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);
        eee = RIPEMD320.__JJJ__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[14],  9); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);
        ddd = RIPEMD320.__JJJ__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[ 7],  9); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);
        ccc = RIPEMD320.__JJJ__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[ 0], 11); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);
        bbb = RIPEMD320.__JJJ__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[ 9], 13); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);
        aaa = RIPEMD320.__JJJ__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[ 2], 15); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);
        eee = RIPEMD320.__JJJ__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[11], 15); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);
        ddd = RIPEMD320.__JJJ__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[ 4],  5); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);
        ccc = RIPEMD320.__JJJ__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[13],  7); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);
        bbb = RIPEMD320.__JJJ__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[ 6],  7); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);
        aaa = RIPEMD320.__JJJ__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[15],  8); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);
        eee = RIPEMD320.__JJJ__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[ 8], 11); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);
        ddd = RIPEMD320.__JJJ__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[ 1], 14); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);
        ccc = RIPEMD320.__JJJ__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[10], 14); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);
        bbb = RIPEMD320.__JJJ__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[ 3], 12); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);
        aaa = RIPEMD320.__JJJ__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[12],  6); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);

        aa ^= aaa; aaa ^= aa; aa ^= aaa;
        
        /* round 2 */
        ee = RIPEMD320.__GG__(ee, aa, bb, cc, dd, RIPEMD320.__X__[ 7],  7); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        dd = RIPEMD320.__GG__(dd, ee, aa, bb, cc, RIPEMD320.__X__[ 4],  6); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        cc = RIPEMD320.__GG__(cc, dd, ee, aa, bb, RIPEMD320.__X__[13],  8); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        bb = RIPEMD320.__GG__(bb, cc, dd, ee, aa, RIPEMD320.__X__[ 1], 13); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        aa = RIPEMD320.__GG__(aa, bb, cc, dd, ee, RIPEMD320.__X__[10], 11); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        ee = RIPEMD320.__GG__(ee, aa, bb, cc, dd, RIPEMD320.__X__[ 6],  9); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        dd = RIPEMD320.__GG__(dd, ee, aa, bb, cc, RIPEMD320.__X__[15],  7); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        cc = RIPEMD320.__GG__(cc, dd, ee, aa, bb, RIPEMD320.__X__[ 3], 15); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        bb = RIPEMD320.__GG__(bb, cc, dd, ee, aa, RIPEMD320.__X__[12],  7); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        aa = RIPEMD320.__GG__(aa, bb, cc, dd, ee, RIPEMD320.__X__[ 0], 12); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        ee = RIPEMD320.__GG__(ee, aa, bb, cc, dd, RIPEMD320.__X__[ 9], 15); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        dd = RIPEMD320.__GG__(dd, ee, aa, bb, cc, RIPEMD320.__X__[ 5],  9); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        cc = RIPEMD320.__GG__(cc, dd, ee, aa, bb, RIPEMD320.__X__[ 2], 11); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        bb = RIPEMD320.__GG__(bb, cc, dd, ee, aa, RIPEMD320.__X__[14],  7); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        aa = RIPEMD320.__GG__(aa, bb, cc, dd, ee, RIPEMD320.__X__[11], 13); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        ee = RIPEMD320.__GG__(ee, aa, bb, cc, dd, RIPEMD320.__X__[ 8], 12); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        
        /* parallel round 2 */
        eee = RIPEMD320.__III__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[ 6],  9); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);
        ddd = RIPEMD320.__III__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[11], 13); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);
        ccc = RIPEMD320.__III__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[ 3], 15); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);
        bbb = RIPEMD320.__III__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[ 7],  7); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);
        aaa = RIPEMD320.__III__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[ 0], 12); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);
        eee = RIPEMD320.__III__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[13],  8); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);
        ddd = RIPEMD320.__III__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[ 5],  9); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);
        ccc = RIPEMD320.__III__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[10], 11); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);
        bbb = RIPEMD320.__III__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[14],  7); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);
        aaa = RIPEMD320.__III__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[15],  7); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);
        eee = RIPEMD320.__III__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[ 8], 12); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);
        ddd = RIPEMD320.__III__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[12],  7); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);
        ccc = RIPEMD320.__III__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[ 4],  6); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);
        bbb = RIPEMD320.__III__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[ 9], 15); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);
        aaa = RIPEMD320.__III__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[ 1], 13); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);
        eee = RIPEMD320.__III__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[ 2], 11); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);

        bb ^= bbb; bbb ^= bb; bb ^= bbb;
        
        /* round 3 */
        dd = RIPEMD320.__HH__(dd, ee, aa, bb, cc, RIPEMD320.__X__[ 3], 11); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        cc = RIPEMD320.__HH__(cc, dd, ee, aa, bb, RIPEMD320.__X__[10], 13); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        bb = RIPEMD320.__HH__(bb, cc, dd, ee, aa, RIPEMD320.__X__[14],  6); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        aa = RIPEMD320.__HH__(aa, bb, cc, dd, ee, RIPEMD320.__X__[ 4],  7); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        ee = RIPEMD320.__HH__(ee, aa, bb, cc, dd, RIPEMD320.__X__[ 9], 14); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        dd = RIPEMD320.__HH__(dd, ee, aa, bb, cc, RIPEMD320.__X__[15],  9); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        cc = RIPEMD320.__HH__(cc, dd, ee, aa, bb, RIPEMD320.__X__[ 8], 13); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        bb = RIPEMD320.__HH__(bb, cc, dd, ee, aa, RIPEMD320.__X__[ 1], 15); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        aa = RIPEMD320.__HH__(aa, bb, cc, dd, ee, RIPEMD320.__X__[ 2], 14); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        ee = RIPEMD320.__HH__(ee, aa, bb, cc, dd, RIPEMD320.__X__[ 7],  8); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        dd = RIPEMD320.__HH__(dd, ee, aa, bb, cc, RIPEMD320.__X__[ 0], 13); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        cc = RIPEMD320.__HH__(cc, dd, ee, aa, bb, RIPEMD320.__X__[ 6],  6); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        bb = RIPEMD320.__HH__(bb, cc, dd, ee, aa, RIPEMD320.__X__[13],  5); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        aa = RIPEMD320.__HH__(aa, bb, cc, dd, ee, RIPEMD320.__X__[11], 12); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        ee = RIPEMD320.__HH__(ee, aa, bb, cc, dd, RIPEMD320.__X__[ 5],  7); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        dd = RIPEMD320.__HH__(dd, ee, aa, bb, cc, RIPEMD320.__X__[12],  5); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        
        /* parallel round 3 */
        ddd = RIPEMD320.__HHH__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[15],  9); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);
        ccc = RIPEMD320.__HHH__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[ 5],  7); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);
        bbb = RIPEMD320.__HHH__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[ 1], 15); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);
        aaa = RIPEMD320.__HHH__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[ 3], 11); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);
        eee = RIPEMD320.__HHH__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[ 7],  8); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);
        ddd = RIPEMD320.__HHH__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[14],  6); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);
        ccc = RIPEMD320.__HHH__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[ 6],  6); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);
        bbb = RIPEMD320.__HHH__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[ 9], 14); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);
        aaa = RIPEMD320.__HHH__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[11], 12); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);
        eee = RIPEMD320.__HHH__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[ 8], 13); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);
        ddd = RIPEMD320.__HHH__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[12],  5); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);
        ccc = RIPEMD320.__HHH__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[ 2], 14); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);
        bbb = RIPEMD320.__HHH__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[10], 13); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);
        aaa = RIPEMD320.__HHH__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[ 0], 13); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);
        eee = RIPEMD320.__HHH__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[ 4],  7); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);
        ddd = RIPEMD320.__HHH__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[13],  5); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);

        cc ^= ccc; ccc ^= cc; cc ^= ccc;
        
        /* round 4 */
        cc = RIPEMD320.__II__(cc, dd, ee, aa, bb, RIPEMD320.__X__[ 1], 11); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        bb = RIPEMD320.__II__(bb, cc, dd, ee, aa, RIPEMD320.__X__[ 9], 12); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        aa = RIPEMD320.__II__(aa, bb, cc, dd, ee, RIPEMD320.__X__[11], 14); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        ee = RIPEMD320.__II__(ee, aa, bb, cc, dd, RIPEMD320.__X__[10], 15); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        dd = RIPEMD320.__II__(dd, ee, aa, bb, cc, RIPEMD320.__X__[ 0], 14); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        cc = RIPEMD320.__II__(cc, dd, ee, aa, bb, RIPEMD320.__X__[ 8], 15); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        bb = RIPEMD320.__II__(bb, cc, dd, ee, aa, RIPEMD320.__X__[12],  9); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        aa = RIPEMD320.__II__(aa, bb, cc, dd, ee, RIPEMD320.__X__[ 4],  8); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        ee = RIPEMD320.__II__(ee, aa, bb, cc, dd, RIPEMD320.__X__[13],  9); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        dd = RIPEMD320.__II__(dd, ee, aa, bb, cc, RIPEMD320.__X__[ 3], 14); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        cc = RIPEMD320.__II__(cc, dd, ee, aa, bb, RIPEMD320.__X__[ 7],  5); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        bb = RIPEMD320.__II__(bb, cc, dd, ee, aa, RIPEMD320.__X__[15],  6); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        aa = RIPEMD320.__II__(aa, bb, cc, dd, ee, RIPEMD320.__X__[14],  8); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        ee = RIPEMD320.__II__(ee, aa, bb, cc, dd, RIPEMD320.__X__[ 5],  6); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        dd = RIPEMD320.__II__(dd, ee, aa, bb, cc, RIPEMD320.__X__[ 6],  5); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        cc = RIPEMD320.__II__(cc, dd, ee, aa, bb, RIPEMD320.__X__[ 2], 12); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        
        /* parallel round 4 */   
        ccc = RIPEMD320.__GGG__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[ 8], 15); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);
        bbb = RIPEMD320.__GGG__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[ 6],  5); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);
        aaa = RIPEMD320.__GGG__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[ 4],  8); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);
        eee = RIPEMD320.__GGG__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[ 1], 11); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);
        ddd = RIPEMD320.__GGG__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[ 3], 14); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);
        ccc = RIPEMD320.__GGG__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[11], 14); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);
        bbb = RIPEMD320.__GGG__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[15],  6); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);
        aaa = RIPEMD320.__GGG__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[ 0], 14); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);
        eee = RIPEMD320.__GGG__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[ 5],  6); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);
        ddd = RIPEMD320.__GGG__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[12],  9); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);
        ccc = RIPEMD320.__GGG__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[ 2], 12); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);
        bbb = RIPEMD320.__GGG__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[13],  9); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);
        aaa = RIPEMD320.__GGG__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[ 9], 12); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);
        eee = RIPEMD320.__GGG__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[ 7],  5); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);
        ddd = RIPEMD320.__GGG__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[10], 15); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);
        ccc = RIPEMD320.__GGG__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[14],  8); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);

        dd ^= ddd; ddd ^= dd; dd ^= ddd;
        
        /* round 5 */
        bb = RIPEMD320.__JJ__(bb, cc, dd, ee, aa, RIPEMD320.__X__[ 4],  9); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        aa = RIPEMD320.__JJ__(aa, bb, cc, dd, ee, RIPEMD320.__X__[ 0], 15); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        ee = RIPEMD320.__JJ__(ee, aa, bb, cc, dd, RIPEMD320.__X__[ 5],  5); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        dd = RIPEMD320.__JJ__(dd, ee, aa, bb, cc, RIPEMD320.__X__[ 9], 11); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        cc = RIPEMD320.__JJ__(cc, dd, ee, aa, bb, RIPEMD320.__X__[ 7],  6); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        bb = RIPEMD320.__JJ__(bb, cc, dd, ee, aa, RIPEMD320.__X__[12],  8); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        aa = RIPEMD320.__JJ__(aa, bb, cc, dd, ee, RIPEMD320.__X__[ 2], 13); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        ee = RIPEMD320.__JJ__(ee, aa, bb, cc, dd, RIPEMD320.__X__[10], 12); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        dd = RIPEMD320.__JJ__(dd, ee, aa, bb, cc, RIPEMD320.__X__[14],  5); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        cc = RIPEMD320.__JJ__(cc, dd, ee, aa, bb, RIPEMD320.__X__[ 1], 12); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        bb = RIPEMD320.__JJ__(bb, cc, dd, ee, aa, RIPEMD320.__X__[ 3], 13); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        aa = RIPEMD320.__JJ__(aa, bb, cc, dd, ee, RIPEMD320.__X__[ 8], 14); cc = RIPEMD320.__ROTATE_LEFT__(cc, 10);
        ee = RIPEMD320.__JJ__(ee, aa, bb, cc, dd, RIPEMD320.__X__[11], 11); bb = RIPEMD320.__ROTATE_LEFT__(bb, 10);
        dd = RIPEMD320.__JJ__(dd, ee, aa, bb, cc, RIPEMD320.__X__[ 6],  8); aa = RIPEMD320.__ROTATE_LEFT__(aa, 10);
        cc = RIPEMD320.__JJ__(cc, dd, ee, aa, bb, RIPEMD320.__X__[15],  5); ee = RIPEMD320.__ROTATE_LEFT__(ee, 10);
        bb = RIPEMD320.__JJ__(bb, cc, dd, ee, aa, RIPEMD320.__X__[13],  6); dd = RIPEMD320.__ROTATE_LEFT__(dd, 10);
        
        /* parallel round 5 */
        bbb = RIPEMD320.__FFF__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[12],  8); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);
        aaa = RIPEMD320.__FFF__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[15],  5); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);
        eee = RIPEMD320.__FFF__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[10], 12); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);
        ddd = RIPEMD320.__FFF__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[ 4],  9); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);
        ccc = RIPEMD320.__FFF__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[ 1], 12); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);
        bbb = RIPEMD320.__FFF__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[ 5],  5); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);
        aaa = RIPEMD320.__FFF__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[ 8], 14); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);
        eee = RIPEMD320.__FFF__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[ 7],  6); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);
        ddd = RIPEMD320.__FFF__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[ 6],  8); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);
        ccc = RIPEMD320.__FFF__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[ 2], 13); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);
        bbb = RIPEMD320.__FFF__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[13],  6); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);
        aaa = RIPEMD320.__FFF__(aaa, bbb, ccc, ddd, eee, RIPEMD320.__X__[14],  5); ccc = RIPEMD320.__ROTATE_LEFT__(ccc, 10);
        eee = RIPEMD320.__FFF__(eee, aaa, bbb, ccc, ddd, RIPEMD320.__X__[ 0], 15); bbb = RIPEMD320.__ROTATE_LEFT__(bbb, 10);
        ddd = RIPEMD320.__FFF__(ddd, eee, aaa, bbb, ccc, RIPEMD320.__X__[ 3], 13); aaa = RIPEMD320.__ROTATE_LEFT__(aaa, 10);
        ccc = RIPEMD320.__FFF__(ccc, ddd, eee, aaa, bbb, RIPEMD320.__X__[ 9], 11); eee = RIPEMD320.__ROTATE_LEFT__(eee, 10);
        bbb = RIPEMD320.__FFF__(bbb, ccc, ddd, eee, aaa, RIPEMD320.__X__[11], 11); ddd = RIPEMD320.__ROTATE_LEFT__(ddd, 10);

        ee ^= eee; eee ^= ee; ee ^= eee;
        
        this._digest[0] += aa;
        this._digest[1] += bb;
        this._digest[2] += cc;
        this._digest[3] += dd;
        this._digest[4] += ee;
        this._digest[5] += aaa;
        this._digest[6] += bbb;
        this._digest[7] += ccc;
        this._digest[8] += ddd;
        this._digest[9] += eee;

        memset(RIPEMD320.__X__, 0);
    }
}

export default RIPEMD320;
