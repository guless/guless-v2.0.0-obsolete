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

class RIPEMD128 extends HashAlgorithm {
    private static readonly __PADLEN__: u8vec = u8vec([
        0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
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

    private static __FF__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD128.__F__((b), (c), (d)) + (x);
        (a)  = i32rotl((a), (s));
        return a;
    }

    private static __GG__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD128.__G__((b), (c), (d)) + (x) + 0x5a827999;
        (a)  = i32rotl((a), (s));
        return a;
    }

    private static __HH__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD128.__H__((b), (c), (d)) + (x) + 0x6ed9eba1;
        (a)  = i32rotl((a), (s));
        return a;
    }

    private static __II__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD128.__I__((b), (c), (d)) + (x) + 0x8f1bbcdc;
        (a)  = i32rotl((a), (s));
        return a;
    }

    private static __FFF__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD128.__F__((b), (c), (d)) + (x);
        (a)  = i32rotl((a), (s));
        return a;
    }

    private static __GGG__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD128.__G__((b), (c), (d)) + (x) + 0x6d703ef3;
        (a)  = i32rotl((a), (s));
        return a;
    }
    private static __HHH__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD128.__H__((b), (c), (d)) + (x) + 0x5c4dd124;
        (a)  = i32rotl((a), (s));
        return a;
    }
    private static __III__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RIPEMD128.__I__((b), (c), (d)) + (x) + 0x50a28be6;
        (a)  = i32rotl((a), (s));
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
            const partial: number = buffer & 0x3f;

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
            memcpy(RIPEMD128.__PADLEN__, this._buffer, 0, 56 - this._cursor, this._cursor);
            u64enc(this._length, this._buffer, true, 0, 2, 56);
            this._transform(this._buffer);
        } else {
            memcpy(RIPEMD128.__PADLEN__, this._buffer, 0, 64 - this._cursor, this._cursor);
            this._transform(this._buffer);
            u64enc(this._length, RIPEMD128.__PADLEN__, true, 0, 2, 64);
            this._transform(RIPEMD128.__PADLEN__, 8);
            memset(RIPEMD128.__PADLEN__, 0, 64);
        }

        const output: u8vec = u32enc(this._digest, u8vec(16), true);
        this.reset();

        return output;
    }

    private _transform(block: u8vec, start: number = 0): void {
        let aa: number = this._digest[0];
        let bb: number = this._digest[1];
        let cc: number = this._digest[2];
        let dd: number = this._digest[3];

        let aaa: number = aa;
        let bbb: number = bb;
        let ccc: number = cc;
        let ddd: number = dd;

        u32dec(block, RIPEMD128.__X__, true, start, start + 64);

        /* round 1 */
        aa = RIPEMD128.__FF__(aa, bb, cc, dd, RIPEMD128.__X__[ 0], 11);
        dd = RIPEMD128.__FF__(dd, aa, bb, cc, RIPEMD128.__X__[ 1], 14);
        cc = RIPEMD128.__FF__(cc, dd, aa, bb, RIPEMD128.__X__[ 2], 15);
        bb = RIPEMD128.__FF__(bb, cc, dd, aa, RIPEMD128.__X__[ 3], 12);
        aa = RIPEMD128.__FF__(aa, bb, cc, dd, RIPEMD128.__X__[ 4],  5);
        dd = RIPEMD128.__FF__(dd, aa, bb, cc, RIPEMD128.__X__[ 5],  8);
        cc = RIPEMD128.__FF__(cc, dd, aa, bb, RIPEMD128.__X__[ 6],  7);
        bb = RIPEMD128.__FF__(bb, cc, dd, aa, RIPEMD128.__X__[ 7],  9);
        aa = RIPEMD128.__FF__(aa, bb, cc, dd, RIPEMD128.__X__[ 8], 11);
        dd = RIPEMD128.__FF__(dd, aa, bb, cc, RIPEMD128.__X__[ 9], 13);
        cc = RIPEMD128.__FF__(cc, dd, aa, bb, RIPEMD128.__X__[10], 14);
        bb = RIPEMD128.__FF__(bb, cc, dd, aa, RIPEMD128.__X__[11], 15);
        aa = RIPEMD128.__FF__(aa, bb, cc, dd, RIPEMD128.__X__[12],  6);
        dd = RIPEMD128.__FF__(dd, aa, bb, cc, RIPEMD128.__X__[13],  7);
        cc = RIPEMD128.__FF__(cc, dd, aa, bb, RIPEMD128.__X__[14],  9);
        bb = RIPEMD128.__FF__(bb, cc, dd, aa, RIPEMD128.__X__[15],  8);
                             
        /* round 2 */
        aa = RIPEMD128.__GG__(aa, bb, cc, dd, RIPEMD128.__X__[ 7],  7);
        dd = RIPEMD128.__GG__(dd, aa, bb, cc, RIPEMD128.__X__[ 4],  6);
        cc = RIPEMD128.__GG__(cc, dd, aa, bb, RIPEMD128.__X__[13],  8);
        bb = RIPEMD128.__GG__(bb, cc, dd, aa, RIPEMD128.__X__[ 1], 13);
        aa = RIPEMD128.__GG__(aa, bb, cc, dd, RIPEMD128.__X__[10], 11);
        dd = RIPEMD128.__GG__(dd, aa, bb, cc, RIPEMD128.__X__[ 6],  9);
        cc = RIPEMD128.__GG__(cc, dd, aa, bb, RIPEMD128.__X__[15],  7);
        bb = RIPEMD128.__GG__(bb, cc, dd, aa, RIPEMD128.__X__[ 3], 15);
        aa = RIPEMD128.__GG__(aa, bb, cc, dd, RIPEMD128.__X__[12],  7);
        dd = RIPEMD128.__GG__(dd, aa, bb, cc, RIPEMD128.__X__[ 0], 12);
        cc = RIPEMD128.__GG__(cc, dd, aa, bb, RIPEMD128.__X__[ 9], 15);
        bb = RIPEMD128.__GG__(bb, cc, dd, aa, RIPEMD128.__X__[ 5],  9);
        aa = RIPEMD128.__GG__(aa, bb, cc, dd, RIPEMD128.__X__[ 2], 11);
        dd = RIPEMD128.__GG__(dd, aa, bb, cc, RIPEMD128.__X__[14],  7);
        cc = RIPEMD128.__GG__(cc, dd, aa, bb, RIPEMD128.__X__[11], 13);
        bb = RIPEMD128.__GG__(bb, cc, dd, aa, RIPEMD128.__X__[ 8], 12);

        /* round 3 */
        aa = RIPEMD128.__HH__(aa, bb, cc, dd, RIPEMD128.__X__[ 3], 11);
        dd = RIPEMD128.__HH__(dd, aa, bb, cc, RIPEMD128.__X__[10], 13);
        cc = RIPEMD128.__HH__(cc, dd, aa, bb, RIPEMD128.__X__[14],  6);
        bb = RIPEMD128.__HH__(bb, cc, dd, aa, RIPEMD128.__X__[ 4],  7);
        aa = RIPEMD128.__HH__(aa, bb, cc, dd, RIPEMD128.__X__[ 9], 14);
        dd = RIPEMD128.__HH__(dd, aa, bb, cc, RIPEMD128.__X__[15],  9);
        cc = RIPEMD128.__HH__(cc, dd, aa, bb, RIPEMD128.__X__[ 8], 13);
        bb = RIPEMD128.__HH__(bb, cc, dd, aa, RIPEMD128.__X__[ 1], 15);
        aa = RIPEMD128.__HH__(aa, bb, cc, dd, RIPEMD128.__X__[ 2], 14);
        dd = RIPEMD128.__HH__(dd, aa, bb, cc, RIPEMD128.__X__[ 7],  8);
        cc = RIPEMD128.__HH__(cc, dd, aa, bb, RIPEMD128.__X__[ 0], 13);
        bb = RIPEMD128.__HH__(bb, cc, dd, aa, RIPEMD128.__X__[ 6],  6);
        aa = RIPEMD128.__HH__(aa, bb, cc, dd, RIPEMD128.__X__[13],  5);
        dd = RIPEMD128.__HH__(dd, aa, bb, cc, RIPEMD128.__X__[11], 12);
        cc = RIPEMD128.__HH__(cc, dd, aa, bb, RIPEMD128.__X__[ 5],  7);
        bb = RIPEMD128.__HH__(bb, cc, dd, aa, RIPEMD128.__X__[12],  5);

        /* round 4 */
        aa = RIPEMD128.__II__(aa, bb, cc, dd, RIPEMD128.__X__[ 1], 11);
        dd = RIPEMD128.__II__(dd, aa, bb, cc, RIPEMD128.__X__[ 9], 12);
        cc = RIPEMD128.__II__(cc, dd, aa, bb, RIPEMD128.__X__[11], 14);
        bb = RIPEMD128.__II__(bb, cc, dd, aa, RIPEMD128.__X__[10], 15);
        aa = RIPEMD128.__II__(aa, bb, cc, dd, RIPEMD128.__X__[ 0], 14);
        dd = RIPEMD128.__II__(dd, aa, bb, cc, RIPEMD128.__X__[ 8], 15);
        cc = RIPEMD128.__II__(cc, dd, aa, bb, RIPEMD128.__X__[12],  9);
        bb = RIPEMD128.__II__(bb, cc, dd, aa, RIPEMD128.__X__[ 4],  8);
        aa = RIPEMD128.__II__(aa, bb, cc, dd, RIPEMD128.__X__[13],  9);
        dd = RIPEMD128.__II__(dd, aa, bb, cc, RIPEMD128.__X__[ 3], 14);
        cc = RIPEMD128.__II__(cc, dd, aa, bb, RIPEMD128.__X__[ 7],  5);
        bb = RIPEMD128.__II__(bb, cc, dd, aa, RIPEMD128.__X__[15],  6);
        aa = RIPEMD128.__II__(aa, bb, cc, dd, RIPEMD128.__X__[14],  8);
        dd = RIPEMD128.__II__(dd, aa, bb, cc, RIPEMD128.__X__[ 5],  6);
        cc = RIPEMD128.__II__(cc, dd, aa, bb, RIPEMD128.__X__[ 6],  5);
        bb = RIPEMD128.__II__(bb, cc, dd, aa, RIPEMD128.__X__[ 2], 12);

        /* parallel round 1 */
        aaa = RIPEMD128.__III__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[ 5],  8); 
        ddd = RIPEMD128.__III__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[14],  9);
        ccc = RIPEMD128.__III__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[ 7],  9);
        bbb = RIPEMD128.__III__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[ 0], 11);
        aaa = RIPEMD128.__III__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[ 9], 13);
        ddd = RIPEMD128.__III__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[ 2], 15);
        ccc = RIPEMD128.__III__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[11], 15);
        bbb = RIPEMD128.__III__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[ 4],  5);
        aaa = RIPEMD128.__III__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[13],  7);
        ddd = RIPEMD128.__III__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[ 6],  7);
        ccc = RIPEMD128.__III__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[15],  8);
        bbb = RIPEMD128.__III__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[ 8], 11);
        aaa = RIPEMD128.__III__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[ 1], 14);
        ddd = RIPEMD128.__III__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[10], 14);
        ccc = RIPEMD128.__III__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[ 3], 12);
        bbb = RIPEMD128.__III__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[12],  6);

        /* parallel round 2 */
        aaa = RIPEMD128.__HHH__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[ 6],  9);
        ddd = RIPEMD128.__HHH__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[11], 13);
        ccc = RIPEMD128.__HHH__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[ 3], 15);
        bbb = RIPEMD128.__HHH__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[ 7],  7);
        aaa = RIPEMD128.__HHH__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[ 0], 12);
        ddd = RIPEMD128.__HHH__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[13],  8);
        ccc = RIPEMD128.__HHH__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[ 5],  9);
        bbb = RIPEMD128.__HHH__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[10], 11);
        aaa = RIPEMD128.__HHH__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[14],  7);
        ddd = RIPEMD128.__HHH__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[15],  7);
        ccc = RIPEMD128.__HHH__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[ 8], 12);
        bbb = RIPEMD128.__HHH__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[12],  7);
        aaa = RIPEMD128.__HHH__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[ 4],  6);
        ddd = RIPEMD128.__HHH__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[ 9], 15);
        ccc = RIPEMD128.__HHH__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[ 1], 13);
        bbb = RIPEMD128.__HHH__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[ 2], 11);

        /* parallel round 3 */   
        aaa = RIPEMD128.__GGG__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[15],  9);
        ddd = RIPEMD128.__GGG__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[ 5],  7);
        ccc = RIPEMD128.__GGG__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[ 1], 15);
        bbb = RIPEMD128.__GGG__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[ 3], 11);
        aaa = RIPEMD128.__GGG__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[ 7],  8);
        ddd = RIPEMD128.__GGG__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[14],  6);
        ccc = RIPEMD128.__GGG__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[ 6],  6);
        bbb = RIPEMD128.__GGG__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[ 9], 14);
        aaa = RIPEMD128.__GGG__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[11], 12);
        ddd = RIPEMD128.__GGG__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[ 8], 13);
        ccc = RIPEMD128.__GGG__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[12],  5);
        bbb = RIPEMD128.__GGG__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[ 2], 14);
        aaa = RIPEMD128.__GGG__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[10], 13);
        ddd = RIPEMD128.__GGG__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[ 0], 13);
        ccc = RIPEMD128.__GGG__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[ 4],  7);
        bbb = RIPEMD128.__GGG__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[13],  5);

        /* parallel round 4 */
        aaa = RIPEMD128.__FFF__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[ 8], 15);
        ddd = RIPEMD128.__FFF__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[ 6],  5);
        ccc = RIPEMD128.__FFF__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[ 4],  8);
        bbb = RIPEMD128.__FFF__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[ 1], 11);
        aaa = RIPEMD128.__FFF__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[ 3], 14);
        ddd = RIPEMD128.__FFF__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[11], 14);
        ccc = RIPEMD128.__FFF__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[15],  6);
        bbb = RIPEMD128.__FFF__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[ 0], 14);
        aaa = RIPEMD128.__FFF__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[ 5],  6);
        ddd = RIPEMD128.__FFF__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[12],  9);
        ccc = RIPEMD128.__FFF__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[ 2], 12);
        bbb = RIPEMD128.__FFF__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[13],  9);
        aaa = RIPEMD128.__FFF__(aaa, bbb, ccc, ddd, RIPEMD128.__X__[ 9], 12);
        ddd = RIPEMD128.__FFF__(ddd, aaa, bbb, ccc, RIPEMD128.__X__[ 7],  5);
        ccc = RIPEMD128.__FFF__(ccc, ddd, aaa, bbb, RIPEMD128.__X__[10], 15);
        bbb = RIPEMD128.__FFF__(bbb, ccc, ddd, aaa, RIPEMD128.__X__[14],  8);

        const t: number = u32(this._digest[1] + cc + ddd);
        this._digest[1] = u32(this._digest[2] + dd + aaa);
        this._digest[2] = u32(this._digest[3] + aa + bbb);
        this._digest[3] = u32(this._digest[0] + bb + ccc);
        this._digest[0] = t;

        memset(RIPEMD128.__X__, 0);
    }
}

export default RIPEMD128;
