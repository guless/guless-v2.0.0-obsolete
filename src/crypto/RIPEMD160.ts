/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import HashAlgorithm from "./HashAlgorithm";
import { u32 } from "../buffer/ctypes";
import { u8vec, u32vec, u64vec } from "../buffer/ctypes";
import { l64l32, l64h32, l64set } from "../buffer/ctypes";
import { i32rotl } from "../buffer/coperators";
import memcpy from "../buffer/memcpy";
import memset from "../buffer/memset";
import u32dec from "../buffer/u32dec";
import u32enc from "../buffer/u32enc";
import u64enc from "../buffer/u64enc";

class RIPEMD160 extends HashAlgorithm {
    private static readonly __PADLEN__: u8vec = u8vec([
        0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0,
    ]);

    private static readonly __X__: u32vec = u32vec(16);

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
        (a)  = i32rotl((a), (s)) + (e);
        return a;
    }

    private static __GG__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__G__((b), (c), (d)) + (x) + 0x5a827999;
        (a)  = i32rotl((a), (s)) + (e);
        return a;
    }

    private static __HH__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__H__((b), (c), (d)) + (x) + 0x6ed9eba1;
        (a)  = i32rotl((a), (s)) + (e);
        return a;
    }

    private static __II__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__I__((b), (c), (d)) + (x) + 0x8f1bbcdc;
        (a)  = i32rotl((a), (s)) + (e);
        return a;
    }

    private static __JJ__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__J__((b), (c), (d)) + (x) + 0xa953fd4e;
        (a)  = i32rotl((a), (s)) + (e);
        return a;
    }

    private static __FFF__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__F__((b), (c), (d)) + (x);
        (a)  = i32rotl((a), (s)) + (e);
        return a;
    }

    private static __GGG__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__G__((b), (c), (d)) + (x) + 0x7a6d76e9;
        (a)  = i32rotl((a), (s)) + (e);
        return a;
    }

    private static __HHH__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__H__((b), (c), (d)) + (x) + 0x6d703ef3;
        (a)  = i32rotl((a), (s)) + (e);
        return a;
    }

    private static __III__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__I__((b), (c), (d)) + (x) + 0x5c4dd124;
        (a)  = i32rotl((a), (s)) + (e);
        return a;
    }

    private static __JJJ__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RIPEMD160.__J__((b), (c), (d)) + (x) + 0x50a28be6;
        (a)  = i32rotl((a), (s)) + (e);
        return a;
    }

    private static __ADD_LEN__(u: u64vec, v: number): u64vec {
        const lo: number = (v << 3) >>> 0;
        const hi: number = (v >>> 29);
        const l32: u32 = u32(l64l32(u) + lo);
        const h32: u32 = u32(l64h32(u) + hi + (l32 < lo ? 1 : 0));
        return l64set(u, l32, h32);
    }

    private _digest: u32vec = u32vec([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
    private _length: u64vec = u64vec(1);
    private _buffer: u8vec = u8vec(64);
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
    
    public update(source: u8vec, sourceStart: number = 0, sourceEnd: number = source.length): void {
        const buffer: number = 64 - this._cursor;
        const length: number = sourceEnd - sourceStart;
        let i: number = sourceStart;

        RIPEMD160.__ADD_LEN__(this._length, length);

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
            memcpy(RIPEMD160.__PADLEN__, this._buffer, 0, 56 - this._cursor, this._cursor);
            u64enc(this._length, this._buffer, true, 0, 2, 56);
            this._transform(this._buffer);
        } else {
            memcpy(RIPEMD160.__PADLEN__, this._buffer, 0, 64 - this._cursor, this._cursor);
            this._transform(this._buffer);
            u64enc(this._length, RIPEMD160.__PADLEN__, true, 0, 2, 64);
            this._transform(RIPEMD160.__PADLEN__, 8);
            memset(RIPEMD160.__PADLEN__, 0, 64);
        }

        const output: u8vec = u32enc(this._digest, u8vec(20), true);
        this.reset();

        return output;
    }

    private _transform(block: u8vec, start: number = 0): void {
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

        u32dec(block, RIPEMD160.__X__, true, start, start + 64);
        
        /* round 1 */
        aa = RIPEMD160.__FF__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 0], 11); cc = i32rotl(cc, 10);
        ee = RIPEMD160.__FF__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 1], 14); bb = i32rotl(bb, 10);
        dd = RIPEMD160.__FF__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 2], 15); aa = i32rotl(aa, 10);
        cc = RIPEMD160.__FF__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 3], 12); ee = i32rotl(ee, 10);
        bb = RIPEMD160.__FF__(bb, cc, dd, ee, aa, RIPEMD160.__X__[ 4],  5); dd = i32rotl(dd, 10);
        aa = RIPEMD160.__FF__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 5],  8); cc = i32rotl(cc, 10);
        ee = RIPEMD160.__FF__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 6],  7); bb = i32rotl(bb, 10);
        dd = RIPEMD160.__FF__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 7],  9); aa = i32rotl(aa, 10);
        cc = RIPEMD160.__FF__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 8], 11); ee = i32rotl(ee, 10);
        bb = RIPEMD160.__FF__(bb, cc, dd, ee, aa, RIPEMD160.__X__[ 9], 13); dd = i32rotl(dd, 10);
        aa = RIPEMD160.__FF__(aa, bb, cc, dd, ee, RIPEMD160.__X__[10], 14); cc = i32rotl(cc, 10);
        ee = RIPEMD160.__FF__(ee, aa, bb, cc, dd, RIPEMD160.__X__[11], 15); bb = i32rotl(bb, 10);
        dd = RIPEMD160.__FF__(dd, ee, aa, bb, cc, RIPEMD160.__X__[12],  6); aa = i32rotl(aa, 10);
        cc = RIPEMD160.__FF__(cc, dd, ee, aa, bb, RIPEMD160.__X__[13],  7); ee = i32rotl(ee, 10);
        bb = RIPEMD160.__FF__(bb, cc, dd, ee, aa, RIPEMD160.__X__[14],  9); dd = i32rotl(dd, 10);
        aa = RIPEMD160.__FF__(aa, bb, cc, dd, ee, RIPEMD160.__X__[15],  8); cc = i32rotl(cc, 10);
        
        /* parallel round 1 */
        aaa = RIPEMD160.__JJJ__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 5],  8); ccc = i32rotl(ccc, 10);
        eee = RIPEMD160.__JJJ__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[14],  9); bbb = i32rotl(bbb, 10);
        ddd = RIPEMD160.__JJJ__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 7],  9); aaa = i32rotl(aaa, 10);
        ccc = RIPEMD160.__JJJ__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 0], 11); eee = i32rotl(eee, 10);
        bbb = RIPEMD160.__JJJ__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 9], 13); ddd = i32rotl(ddd, 10);
        aaa = RIPEMD160.__JJJ__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 2], 15); ccc = i32rotl(ccc, 10);
        eee = RIPEMD160.__JJJ__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[11], 15); bbb = i32rotl(bbb, 10);
        ddd = RIPEMD160.__JJJ__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 4],  5); aaa = i32rotl(aaa, 10);
        ccc = RIPEMD160.__JJJ__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[13],  7); eee = i32rotl(eee, 10);
        bbb = RIPEMD160.__JJJ__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 6],  7); ddd = i32rotl(ddd, 10);
        aaa = RIPEMD160.__JJJ__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[15],  8); ccc = i32rotl(ccc, 10);
        eee = RIPEMD160.__JJJ__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 8], 11); bbb = i32rotl(bbb, 10);
        ddd = RIPEMD160.__JJJ__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 1], 14); aaa = i32rotl(aaa, 10);
        ccc = RIPEMD160.__JJJ__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[10], 14); eee = i32rotl(eee, 10);
        bbb = RIPEMD160.__JJJ__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 3], 12); ddd = i32rotl(ddd, 10);
        aaa = RIPEMD160.__JJJ__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[12],  6); ccc = i32rotl(ccc, 10);
        
        /* round 2 */
        ee = RIPEMD160.__GG__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 7],  7); bb = i32rotl(bb, 10);
        dd = RIPEMD160.__GG__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 4],  6); aa = i32rotl(aa, 10);
        cc = RIPEMD160.__GG__(cc, dd, ee, aa, bb, RIPEMD160.__X__[13],  8); ee = i32rotl(ee, 10);
        bb = RIPEMD160.__GG__(bb, cc, dd, ee, aa, RIPEMD160.__X__[ 1], 13); dd = i32rotl(dd, 10);
        aa = RIPEMD160.__GG__(aa, bb, cc, dd, ee, RIPEMD160.__X__[10], 11); cc = i32rotl(cc, 10);
        ee = RIPEMD160.__GG__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 6],  9); bb = i32rotl(bb, 10);
        dd = RIPEMD160.__GG__(dd, ee, aa, bb, cc, RIPEMD160.__X__[15],  7); aa = i32rotl(aa, 10);
        cc = RIPEMD160.__GG__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 3], 15); ee = i32rotl(ee, 10);
        bb = RIPEMD160.__GG__(bb, cc, dd, ee, aa, RIPEMD160.__X__[12],  7); dd = i32rotl(dd, 10);
        aa = RIPEMD160.__GG__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 0], 12); cc = i32rotl(cc, 10);
        ee = RIPEMD160.__GG__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 9], 15); bb = i32rotl(bb, 10);
        dd = RIPEMD160.__GG__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 5],  9); aa = i32rotl(aa, 10);
        cc = RIPEMD160.__GG__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 2], 11); ee = i32rotl(ee, 10);
        bb = RIPEMD160.__GG__(bb, cc, dd, ee, aa, RIPEMD160.__X__[14],  7); dd = i32rotl(dd, 10);
        aa = RIPEMD160.__GG__(aa, bb, cc, dd, ee, RIPEMD160.__X__[11], 13); cc = i32rotl(cc, 10);
        ee = RIPEMD160.__GG__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 8], 12); bb = i32rotl(bb, 10);
        
        /* parallel round 2 */
        eee = RIPEMD160.__III__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 6],  9); bbb = i32rotl(bbb, 10);
        ddd = RIPEMD160.__III__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[11], 13); aaa = i32rotl(aaa, 10);
        ccc = RIPEMD160.__III__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 3], 15); eee = i32rotl(eee, 10);
        bbb = RIPEMD160.__III__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 7],  7); ddd = i32rotl(ddd, 10);
        aaa = RIPEMD160.__III__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 0], 12); ccc = i32rotl(ccc, 10);
        eee = RIPEMD160.__III__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[13],  8); bbb = i32rotl(bbb, 10);
        ddd = RIPEMD160.__III__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 5],  9); aaa = i32rotl(aaa, 10);
        ccc = RIPEMD160.__III__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[10], 11); eee = i32rotl(eee, 10);
        bbb = RIPEMD160.__III__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[14],  7); ddd = i32rotl(ddd, 10);
        aaa = RIPEMD160.__III__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[15],  7); ccc = i32rotl(ccc, 10);
        eee = RIPEMD160.__III__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 8], 12); bbb = i32rotl(bbb, 10);
        ddd = RIPEMD160.__III__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[12],  7); aaa = i32rotl(aaa, 10);
        ccc = RIPEMD160.__III__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 4],  6); eee = i32rotl(eee, 10);
        bbb = RIPEMD160.__III__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 9], 15); ddd = i32rotl(ddd, 10);
        aaa = RIPEMD160.__III__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 1], 13); ccc = i32rotl(ccc, 10);
        eee = RIPEMD160.__III__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 2], 11); bbb = i32rotl(bbb, 10);
        
        /* round 3 */
        dd = RIPEMD160.__HH__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 3], 11); aa = i32rotl(aa, 10);
        cc = RIPEMD160.__HH__(cc, dd, ee, aa, bb, RIPEMD160.__X__[10], 13); ee = i32rotl(ee, 10);
        bb = RIPEMD160.__HH__(bb, cc, dd, ee, aa, RIPEMD160.__X__[14],  6); dd = i32rotl(dd, 10);
        aa = RIPEMD160.__HH__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 4],  7); cc = i32rotl(cc, 10);
        ee = RIPEMD160.__HH__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 9], 14); bb = i32rotl(bb, 10);
        dd = RIPEMD160.__HH__(dd, ee, aa, bb, cc, RIPEMD160.__X__[15],  9); aa = i32rotl(aa, 10);
        cc = RIPEMD160.__HH__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 8], 13); ee = i32rotl(ee, 10);
        bb = RIPEMD160.__HH__(bb, cc, dd, ee, aa, RIPEMD160.__X__[ 1], 15); dd = i32rotl(dd, 10);
        aa = RIPEMD160.__HH__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 2], 14); cc = i32rotl(cc, 10);
        ee = RIPEMD160.__HH__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 7],  8); bb = i32rotl(bb, 10);
        dd = RIPEMD160.__HH__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 0], 13); aa = i32rotl(aa, 10);
        cc = RIPEMD160.__HH__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 6],  6); ee = i32rotl(ee, 10);
        bb = RIPEMD160.__HH__(bb, cc, dd, ee, aa, RIPEMD160.__X__[13],  5); dd = i32rotl(dd, 10);
        aa = RIPEMD160.__HH__(aa, bb, cc, dd, ee, RIPEMD160.__X__[11], 12); cc = i32rotl(cc, 10);
        ee = RIPEMD160.__HH__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 5],  7); bb = i32rotl(bb, 10);
        dd = RIPEMD160.__HH__(dd, ee, aa, bb, cc, RIPEMD160.__X__[12],  5); aa = i32rotl(aa, 10);
        
        /* parallel round 3 */
        ddd = RIPEMD160.__HHH__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[15],  9); aaa = i32rotl(aaa, 10);
        ccc = RIPEMD160.__HHH__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 5],  7); eee = i32rotl(eee, 10);
        bbb = RIPEMD160.__HHH__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 1], 15); ddd = i32rotl(ddd, 10);
        aaa = RIPEMD160.__HHH__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 3], 11); ccc = i32rotl(ccc, 10);
        eee = RIPEMD160.__HHH__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 7],  8); bbb = i32rotl(bbb, 10);
        ddd = RIPEMD160.__HHH__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[14],  6); aaa = i32rotl(aaa, 10);
        ccc = RIPEMD160.__HHH__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 6],  6); eee = i32rotl(eee, 10);
        bbb = RIPEMD160.__HHH__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 9], 14); ddd = i32rotl(ddd, 10);
        aaa = RIPEMD160.__HHH__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[11], 12); ccc = i32rotl(ccc, 10);
        eee = RIPEMD160.__HHH__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 8], 13); bbb = i32rotl(bbb, 10);
        ddd = RIPEMD160.__HHH__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[12],  5); aaa = i32rotl(aaa, 10);
        ccc = RIPEMD160.__HHH__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 2], 14); eee = i32rotl(eee, 10);
        bbb = RIPEMD160.__HHH__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[10], 13); ddd = i32rotl(ddd, 10);
        aaa = RIPEMD160.__HHH__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 0], 13); ccc = i32rotl(ccc, 10);
        eee = RIPEMD160.__HHH__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 4],  7); bbb = i32rotl(bbb, 10);
        ddd = RIPEMD160.__HHH__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[13],  5); aaa = i32rotl(aaa, 10);
        
        /* round 4 */
        cc = RIPEMD160.__II__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 1], 11); ee = i32rotl(ee, 10);
        bb = RIPEMD160.__II__(bb, cc, dd, ee, aa, RIPEMD160.__X__[ 9], 12); dd = i32rotl(dd, 10);
        aa = RIPEMD160.__II__(aa, bb, cc, dd, ee, RIPEMD160.__X__[11], 14); cc = i32rotl(cc, 10);
        ee = RIPEMD160.__II__(ee, aa, bb, cc, dd, RIPEMD160.__X__[10], 15); bb = i32rotl(bb, 10);
        dd = RIPEMD160.__II__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 0], 14); aa = i32rotl(aa, 10);
        cc = RIPEMD160.__II__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 8], 15); ee = i32rotl(ee, 10);
        bb = RIPEMD160.__II__(bb, cc, dd, ee, aa, RIPEMD160.__X__[12],  9); dd = i32rotl(dd, 10);
        aa = RIPEMD160.__II__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 4],  8); cc = i32rotl(cc, 10);
        ee = RIPEMD160.__II__(ee, aa, bb, cc, dd, RIPEMD160.__X__[13],  9); bb = i32rotl(bb, 10);
        dd = RIPEMD160.__II__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 3], 14); aa = i32rotl(aa, 10);
        cc = RIPEMD160.__II__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 7],  5); ee = i32rotl(ee, 10);
        bb = RIPEMD160.__II__(bb, cc, dd, ee, aa, RIPEMD160.__X__[15],  6); dd = i32rotl(dd, 10);
        aa = RIPEMD160.__II__(aa, bb, cc, dd, ee, RIPEMD160.__X__[14],  8); cc = i32rotl(cc, 10);
        ee = RIPEMD160.__II__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 5],  6); bb = i32rotl(bb, 10);
        dd = RIPEMD160.__II__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 6],  5); aa = i32rotl(aa, 10);
        cc = RIPEMD160.__II__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 2], 12); ee = i32rotl(ee, 10);
        
        /* parallel round 4 */   
        ccc = RIPEMD160.__GGG__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 8], 15); eee = i32rotl(eee, 10);
        bbb = RIPEMD160.__GGG__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 6],  5); ddd = i32rotl(ddd, 10);
        aaa = RIPEMD160.__GGG__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 4],  8); ccc = i32rotl(ccc, 10);
        eee = RIPEMD160.__GGG__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 1], 11); bbb = i32rotl(bbb, 10);
        ddd = RIPEMD160.__GGG__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 3], 14); aaa = i32rotl(aaa, 10);
        ccc = RIPEMD160.__GGG__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[11], 14); eee = i32rotl(eee, 10);
        bbb = RIPEMD160.__GGG__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[15],  6); ddd = i32rotl(ddd, 10);
        aaa = RIPEMD160.__GGG__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 0], 14); ccc = i32rotl(ccc, 10);
        eee = RIPEMD160.__GGG__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 5],  6); bbb = i32rotl(bbb, 10);
        ddd = RIPEMD160.__GGG__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[12],  9); aaa = i32rotl(aaa, 10);
        ccc = RIPEMD160.__GGG__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 2], 12); eee = i32rotl(eee, 10);
        bbb = RIPEMD160.__GGG__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[13],  9); ddd = i32rotl(ddd, 10);
        aaa = RIPEMD160.__GGG__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 9], 12); ccc = i32rotl(ccc, 10);
        eee = RIPEMD160.__GGG__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 7],  5); bbb = i32rotl(bbb, 10);
        ddd = RIPEMD160.__GGG__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[10], 15); aaa = i32rotl(aaa, 10);
        ccc = RIPEMD160.__GGG__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[14],  8); eee = i32rotl(eee, 10);
        
        /* round 5 */
        bb = RIPEMD160.__JJ__(bb, cc, dd, ee, aa, RIPEMD160.__X__[ 4],  9); dd = i32rotl(dd, 10);
        aa = RIPEMD160.__JJ__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 0], 15); cc = i32rotl(cc, 10);
        ee = RIPEMD160.__JJ__(ee, aa, bb, cc, dd, RIPEMD160.__X__[ 5],  5); bb = i32rotl(bb, 10);
        dd = RIPEMD160.__JJ__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 9], 11); aa = i32rotl(aa, 10);
        cc = RIPEMD160.__JJ__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 7],  6); ee = i32rotl(ee, 10);
        bb = RIPEMD160.__JJ__(bb, cc, dd, ee, aa, RIPEMD160.__X__[12],  8); dd = i32rotl(dd, 10);
        aa = RIPEMD160.__JJ__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 2], 13); cc = i32rotl(cc, 10);
        ee = RIPEMD160.__JJ__(ee, aa, bb, cc, dd, RIPEMD160.__X__[10], 12); bb = i32rotl(bb, 10);
        dd = RIPEMD160.__JJ__(dd, ee, aa, bb, cc, RIPEMD160.__X__[14],  5); aa = i32rotl(aa, 10);
        cc = RIPEMD160.__JJ__(cc, dd, ee, aa, bb, RIPEMD160.__X__[ 1], 12); ee = i32rotl(ee, 10);
        bb = RIPEMD160.__JJ__(bb, cc, dd, ee, aa, RIPEMD160.__X__[ 3], 13); dd = i32rotl(dd, 10);
        aa = RIPEMD160.__JJ__(aa, bb, cc, dd, ee, RIPEMD160.__X__[ 8], 14); cc = i32rotl(cc, 10);
        ee = RIPEMD160.__JJ__(ee, aa, bb, cc, dd, RIPEMD160.__X__[11], 11); bb = i32rotl(bb, 10);
        dd = RIPEMD160.__JJ__(dd, ee, aa, bb, cc, RIPEMD160.__X__[ 6],  8); aa = i32rotl(aa, 10);
        cc = RIPEMD160.__JJ__(cc, dd, ee, aa, bb, RIPEMD160.__X__[15],  5); ee = i32rotl(ee, 10);
        bb = RIPEMD160.__JJ__(bb, cc, dd, ee, aa, RIPEMD160.__X__[13],  6); dd = i32rotl(dd, 10);
        
        /* parallel round 5 */
        bbb = RIPEMD160.__FFF__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[12],  8); ddd = i32rotl(ddd, 10);
        aaa = RIPEMD160.__FFF__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[15],  5); ccc = i32rotl(ccc, 10);
        eee = RIPEMD160.__FFF__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[10], 12); bbb = i32rotl(bbb, 10);
        ddd = RIPEMD160.__FFF__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 4],  9); aaa = i32rotl(aaa, 10);
        ccc = RIPEMD160.__FFF__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 1], 12); eee = i32rotl(eee, 10);
        bbb = RIPEMD160.__FFF__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[ 5],  5); ddd = i32rotl(ddd, 10);
        aaa = RIPEMD160.__FFF__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[ 8], 14); ccc = i32rotl(ccc, 10);
        eee = RIPEMD160.__FFF__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 7],  6); bbb = i32rotl(bbb, 10);
        ddd = RIPEMD160.__FFF__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 6],  8); aaa = i32rotl(aaa, 10);
        ccc = RIPEMD160.__FFF__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 2], 13); eee = i32rotl(eee, 10);
        bbb = RIPEMD160.__FFF__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[13],  6); ddd = i32rotl(ddd, 10);
        aaa = RIPEMD160.__FFF__(aaa, bbb, ccc, ddd, eee, RIPEMD160.__X__[14],  5); ccc = i32rotl(ccc, 10);
        eee = RIPEMD160.__FFF__(eee, aaa, bbb, ccc, ddd, RIPEMD160.__X__[ 0], 15); bbb = i32rotl(bbb, 10);
        ddd = RIPEMD160.__FFF__(ddd, eee, aaa, bbb, ccc, RIPEMD160.__X__[ 3], 13); aaa = i32rotl(aaa, 10);
        ccc = RIPEMD160.__FFF__(ccc, ddd, eee, aaa, bbb, RIPEMD160.__X__[ 9], 11); eee = i32rotl(eee, 10);
        bbb = RIPEMD160.__FFF__(bbb, ccc, ddd, eee, aaa, RIPEMD160.__X__[11], 11); ddd = i32rotl(ddd, 10);
        
        const t: number = u32(this._digest[1] + cc + ddd);
        this._digest[1] = u32(this._digest[2] + dd + eee);
        this._digest[2] = u32(this._digest[3] + ee + aaa);
        this._digest[3] = u32(this._digest[4] + aa + bbb);
        this._digest[4] = u32(this._digest[0] + bb + ccc);
        this._digest[0] = t;

        memset(RIPEMD160.__X__, 0);
    }
}

export default RIPEMD160;
