/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import IHashAlgorithm from "./IHashAlgorithm";
import allocUint8Array from "../buffer/allocUint8Array";
import allocUint32Array from "../buffer/allocUint32Array";
import memset from "../buffer/memset";
import memcpy from "../buffer/memcpy";
import Long64 from "../buffer/Long64";
import decodeUint32 from "../buffer/decodeUint32";
import encodeUint32 from "../buffer/encodeUint32";

class RMD256 implements IHashAlgorithm {
    private static readonly __X__: Uint32Array = allocUint32Array(16);
    private static readonly __P__: Uint8Array = allocUint8Array([
        0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

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
        (a) += RMD256.__F__((b), (c), (d)) + (x);
        (a)  = RMD256.__ROTL32__((a), (s));
        return a;
    }

    private static __GG__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RMD256.__G__((b), (c), (d)) + (x) + 0x5a827999;
        (a)  = RMD256.__ROTL32__((a), (s));
        return a;
    }

    private static __HH__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RMD256.__H__((b), (c), (d)) + (x) + 0x6ed9eba1;
        (a)  = RMD256.__ROTL32__((a), (s));
        return a;
    }

    private static __II__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RMD256.__I__((b), (c), (d)) + (x) + 0x8f1bbcdc;
        (a)  = RMD256.__ROTL32__((a), (s));
        return a;
    }

    private static __FFF__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RMD256.__F__((b), (c), (d)) + (x);
        (a)  = RMD256.__ROTL32__((a), (s));
        return a;
    }

    private static __GGG__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RMD256.__G__((b), (c), (d)) + (x) + 0x6d703ef3;
        (a)  = RMD256.__ROTL32__((a), (s));
        return a;
    }
    private static __HHH__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RMD256.__H__((b), (c), (d)) + (x) + 0x5c4dd124;
        (a)  = RMD256.__ROTL32__((a), (s));
        return a;
    }
    private static __III__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += RMD256.__I__((b), (c), (d)) + (x) + 0x50a28be6;
        (a)  = RMD256.__ROTL32__((a), (s));
        return a;
    }

    private static __ROTL32__(x: number, s: number): number {
        return (((x) << (s)) | ((x) >>> (32 - (s))));
    }

    private _digest: Uint32Array = allocUint32Array([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0x76543210, 0xFEDCBA98, 0x89ABCDEF, 0x01234567]);
    private _chksum: Long64 = new Long64(0, 0);
    private _cursor: number = 0;
    private _buffer: Uint8Array = allocUint8Array(64);

    public reset(): void {
        this._digest[0] = 0x67452301;
        this._digest[1] = 0xEFCDAB89;
        this._digest[2] = 0x98BADCFE;
        this._digest[3] = 0x10325476;
        this._digest[4] = 0x76543210;
        this._digest[5] = 0xFEDCBA98;
        this._digest[6] = 0x89ABCDEF;
        this._digest[7] = 0x01234567;
        this._chksum.set(0, 0);
        this._cursor = 0;
        memset(this._buffer, 0, 0, 64);
    }

    public update(source: Uint8Array, start: number = 0, end: number = source.length): void {
        const buflen: number = 64 - this._cursor;
        const iptlen: number = end - start;

        if (iptlen >= buflen) {
            if ((buflen & 0x3F) !== 0) {
                memcpy(source, this._buffer, start, start + buflen, this._cursor, 64);
                start += buflen;
                this._cursor = 0;
                this._transform(this._buffer, this._cursor);
            }

            for (; start + 64 <= end; start += 64) {
                this._transform(source, start);
            }
        }

        memcpy(source, this._buffer, start, end, this._cursor, 64);
        this._cursor += end - start;
        this._chksum.add(iptlen << 3 >>> 0, iptlen >>> 29);
    }

    public final(): Uint8Array {
        const padlen: number = (this._cursor < 56 ? 56 - this._cursor : 120 - this._cursor);
        const chksum: Uint8Array = this._chksum.toBuffer(allocUint8Array(8), 0, true);

        this.update(RMD256.__P__, 0, padlen);
        this.update(chksum, 0, 8);

        const digest: Uint8Array = encodeUint32(this._digest, allocUint8Array(32), true, 0, 8, 0, 32);
        this.reset();

        return digest;
    }

    private _transform(block: Uint8Array, offset: number = 0): void {
        let aa: number = this._digest[0];
        let bb: number = this._digest[1];
        let cc: number = this._digest[2];
        let dd: number = this._digest[3];

        let aaa: number = this._digest[4];
        let bbb: number = this._digest[5];
        let ccc: number = this._digest[6];
        let ddd: number = this._digest[7];

        decodeUint32(block, RMD256.__X__, true, offset, offset + 64, 0, 16);

        /* round 1 */
        aa = RMD256.__FF__(aa, bb, cc, dd, RMD256.__X__[ 0], 11);
        dd = RMD256.__FF__(dd, aa, bb, cc, RMD256.__X__[ 1], 14);
        cc = RMD256.__FF__(cc, dd, aa, bb, RMD256.__X__[ 2], 15);
        bb = RMD256.__FF__(bb, cc, dd, aa, RMD256.__X__[ 3], 12);
        aa = RMD256.__FF__(aa, bb, cc, dd, RMD256.__X__[ 4],  5);
        dd = RMD256.__FF__(dd, aa, bb, cc, RMD256.__X__[ 5],  8);
        cc = RMD256.__FF__(cc, dd, aa, bb, RMD256.__X__[ 6],  7);
        bb = RMD256.__FF__(bb, cc, dd, aa, RMD256.__X__[ 7],  9);
        aa = RMD256.__FF__(aa, bb, cc, dd, RMD256.__X__[ 8], 11);
        dd = RMD256.__FF__(dd, aa, bb, cc, RMD256.__X__[ 9], 13);
        cc = RMD256.__FF__(cc, dd, aa, bb, RMD256.__X__[10], 14);
        bb = RMD256.__FF__(bb, cc, dd, aa, RMD256.__X__[11], 15);
        aa = RMD256.__FF__(aa, bb, cc, dd, RMD256.__X__[12],  6);
        dd = RMD256.__FF__(dd, aa, bb, cc, RMD256.__X__[13],  7);
        cc = RMD256.__FF__(cc, dd, aa, bb, RMD256.__X__[14],  9);
        bb = RMD256.__FF__(bb, cc, dd, aa, RMD256.__X__[15],  8);
        
        /* parallel round 1 */
        aaa = RMD256.__III__(aaa, bbb, ccc, ddd, RMD256.__X__[ 5],  8); 
        ddd = RMD256.__III__(ddd, aaa, bbb, ccc, RMD256.__X__[14],  9);
        ccc = RMD256.__III__(ccc, ddd, aaa, bbb, RMD256.__X__[ 7],  9);
        bbb = RMD256.__III__(bbb, ccc, ddd, aaa, RMD256.__X__[ 0], 11);
        aaa = RMD256.__III__(aaa, bbb, ccc, ddd, RMD256.__X__[ 9], 13);
        ddd = RMD256.__III__(ddd, aaa, bbb, ccc, RMD256.__X__[ 2], 15);
        ccc = RMD256.__III__(ccc, ddd, aaa, bbb, RMD256.__X__[11], 15);
        bbb = RMD256.__III__(bbb, ccc, ddd, aaa, RMD256.__X__[ 4],  5);
        aaa = RMD256.__III__(aaa, bbb, ccc, ddd, RMD256.__X__[13],  7);
        ddd = RMD256.__III__(ddd, aaa, bbb, ccc, RMD256.__X__[ 6],  7);
        ccc = RMD256.__III__(ccc, ddd, aaa, bbb, RMD256.__X__[15],  8);
        bbb = RMD256.__III__(bbb, ccc, ddd, aaa, RMD256.__X__[ 8], 11);
        aaa = RMD256.__III__(aaa, bbb, ccc, ddd, RMD256.__X__[ 1], 14);
        ddd = RMD256.__III__(ddd, aaa, bbb, ccc, RMD256.__X__[10], 14);
        ccc = RMD256.__III__(ccc, ddd, aaa, bbb, RMD256.__X__[ 3], 12);
        bbb = RMD256.__III__(bbb, ccc, ddd, aaa, RMD256.__X__[12],  6);
        
        aa ^= aaa; aaa ^= aa; aa ^= aaa;
        
        /* round 2 */
        aa = RMD256.__GG__(aa, bb, cc, dd, RMD256.__X__[ 7],  7);
        dd = RMD256.__GG__(dd, aa, bb, cc, RMD256.__X__[ 4],  6);
        cc = RMD256.__GG__(cc, dd, aa, bb, RMD256.__X__[13],  8);
        bb = RMD256.__GG__(bb, cc, dd, aa, RMD256.__X__[ 1], 13);
        aa = RMD256.__GG__(aa, bb, cc, dd, RMD256.__X__[10], 11);
        dd = RMD256.__GG__(dd, aa, bb, cc, RMD256.__X__[ 6],  9);
        cc = RMD256.__GG__(cc, dd, aa, bb, RMD256.__X__[15],  7);
        bb = RMD256.__GG__(bb, cc, dd, aa, RMD256.__X__[ 3], 15);
        aa = RMD256.__GG__(aa, bb, cc, dd, RMD256.__X__[12],  7);
        dd = RMD256.__GG__(dd, aa, bb, cc, RMD256.__X__[ 0], 12);
        cc = RMD256.__GG__(cc, dd, aa, bb, RMD256.__X__[ 9], 15);
        bb = RMD256.__GG__(bb, cc, dd, aa, RMD256.__X__[ 5],  9);
        aa = RMD256.__GG__(aa, bb, cc, dd, RMD256.__X__[ 2], 11);
        dd = RMD256.__GG__(dd, aa, bb, cc, RMD256.__X__[14],  7);
        cc = RMD256.__GG__(cc, dd, aa, bb, RMD256.__X__[11], 13);
        bb = RMD256.__GG__(bb, cc, dd, aa, RMD256.__X__[ 8], 12);
        
        /* parallel round 2 */
        aaa = RMD256.__HHH__(aaa, bbb, ccc, ddd, RMD256.__X__[ 6],  9);
        ddd = RMD256.__HHH__(ddd, aaa, bbb, ccc, RMD256.__X__[11], 13);
        ccc = RMD256.__HHH__(ccc, ddd, aaa, bbb, RMD256.__X__[ 3], 15);
        bbb = RMD256.__HHH__(bbb, ccc, ddd, aaa, RMD256.__X__[ 7],  7);
        aaa = RMD256.__HHH__(aaa, bbb, ccc, ddd, RMD256.__X__[ 0], 12);
        ddd = RMD256.__HHH__(ddd, aaa, bbb, ccc, RMD256.__X__[13],  8);
        ccc = RMD256.__HHH__(ccc, ddd, aaa, bbb, RMD256.__X__[ 5],  9);
        bbb = RMD256.__HHH__(bbb, ccc, ddd, aaa, RMD256.__X__[10], 11);
        aaa = RMD256.__HHH__(aaa, bbb, ccc, ddd, RMD256.__X__[14],  7);
        ddd = RMD256.__HHH__(ddd, aaa, bbb, ccc, RMD256.__X__[15],  7);
        ccc = RMD256.__HHH__(ccc, ddd, aaa, bbb, RMD256.__X__[ 8], 12);
        bbb = RMD256.__HHH__(bbb, ccc, ddd, aaa, RMD256.__X__[12],  7);
        aaa = RMD256.__HHH__(aaa, bbb, ccc, ddd, RMD256.__X__[ 4],  6);
        ddd = RMD256.__HHH__(ddd, aaa, bbb, ccc, RMD256.__X__[ 9], 15);
        ccc = RMD256.__HHH__(ccc, ddd, aaa, bbb, RMD256.__X__[ 1], 13);
        bbb = RMD256.__HHH__(bbb, ccc, ddd, aaa, RMD256.__X__[ 2], 11);
        
        bb ^= bbb; bbb ^= bb; bb ^= bbb;
        
        /* round 3 */
        aa = RMD256.__HH__(aa, bb, cc, dd, RMD256.__X__[ 3], 11);
        dd = RMD256.__HH__(dd, aa, bb, cc, RMD256.__X__[10], 13);
        cc = RMD256.__HH__(cc, dd, aa, bb, RMD256.__X__[14],  6);
        bb = RMD256.__HH__(bb, cc, dd, aa, RMD256.__X__[ 4],  7);
        aa = RMD256.__HH__(aa, bb, cc, dd, RMD256.__X__[ 9], 14);
        dd = RMD256.__HH__(dd, aa, bb, cc, RMD256.__X__[15],  9);
        cc = RMD256.__HH__(cc, dd, aa, bb, RMD256.__X__[ 8], 13);
        bb = RMD256.__HH__(bb, cc, dd, aa, RMD256.__X__[ 1], 15);
        aa = RMD256.__HH__(aa, bb, cc, dd, RMD256.__X__[ 2], 14);
        dd = RMD256.__HH__(dd, aa, bb, cc, RMD256.__X__[ 7],  8);
        cc = RMD256.__HH__(cc, dd, aa, bb, RMD256.__X__[ 0], 13);
        bb = RMD256.__HH__(bb, cc, dd, aa, RMD256.__X__[ 6],  6);
        aa = RMD256.__HH__(aa, bb, cc, dd, RMD256.__X__[13],  5);
        dd = RMD256.__HH__(dd, aa, bb, cc, RMD256.__X__[11], 12);
        cc = RMD256.__HH__(cc, dd, aa, bb, RMD256.__X__[ 5],  7);
        bb = RMD256.__HH__(bb, cc, dd, aa, RMD256.__X__[12],  5);
        
        /* parallel round 3 */   
        aaa = RMD256.__GGG__(aaa, bbb, ccc, ddd, RMD256.__X__[15],  9);
        ddd = RMD256.__GGG__(ddd, aaa, bbb, ccc, RMD256.__X__[ 5],  7);
        ccc = RMD256.__GGG__(ccc, ddd, aaa, bbb, RMD256.__X__[ 1], 15);
        bbb = RMD256.__GGG__(bbb, ccc, ddd, aaa, RMD256.__X__[ 3], 11);
        aaa = RMD256.__GGG__(aaa, bbb, ccc, ddd, RMD256.__X__[ 7],  8);
        ddd = RMD256.__GGG__(ddd, aaa, bbb, ccc, RMD256.__X__[14],  6);
        ccc = RMD256.__GGG__(ccc, ddd, aaa, bbb, RMD256.__X__[ 6],  6);
        bbb = RMD256.__GGG__(bbb, ccc, ddd, aaa, RMD256.__X__[ 9], 14);
        aaa = RMD256.__GGG__(aaa, bbb, ccc, ddd, RMD256.__X__[11], 12);
        ddd = RMD256.__GGG__(ddd, aaa, bbb, ccc, RMD256.__X__[ 8], 13);
        ccc = RMD256.__GGG__(ccc, ddd, aaa, bbb, RMD256.__X__[12],  5);
        bbb = RMD256.__GGG__(bbb, ccc, ddd, aaa, RMD256.__X__[ 2], 14);
        aaa = RMD256.__GGG__(aaa, bbb, ccc, ddd, RMD256.__X__[10], 13);
        ddd = RMD256.__GGG__(ddd, aaa, bbb, ccc, RMD256.__X__[ 0], 13);
        ccc = RMD256.__GGG__(ccc, ddd, aaa, bbb, RMD256.__X__[ 4],  7);
        bbb = RMD256.__GGG__(bbb, ccc, ddd, aaa, RMD256.__X__[13],  5);
        
        cc ^= ccc; ccc ^= cc; cc ^= ccc;
        
        /* round 4 */
        aa = RMD256.__II__(aa, bb, cc, dd, RMD256.__X__[ 1], 11);
        dd = RMD256.__II__(dd, aa, bb, cc, RMD256.__X__[ 9], 12);
        cc = RMD256.__II__(cc, dd, aa, bb, RMD256.__X__[11], 14);
        bb = RMD256.__II__(bb, cc, dd, aa, RMD256.__X__[10], 15);
        aa = RMD256.__II__(aa, bb, cc, dd, RMD256.__X__[ 0], 14);
        dd = RMD256.__II__(dd, aa, bb, cc, RMD256.__X__[ 8], 15);
        cc = RMD256.__II__(cc, dd, aa, bb, RMD256.__X__[12],  9);
        bb = RMD256.__II__(bb, cc, dd, aa, RMD256.__X__[ 4],  8);
        aa = RMD256.__II__(aa, bb, cc, dd, RMD256.__X__[13],  9);
        dd = RMD256.__II__(dd, aa, bb, cc, RMD256.__X__[ 3], 14);
        cc = RMD256.__II__(cc, dd, aa, bb, RMD256.__X__[ 7],  5);
        bb = RMD256.__II__(bb, cc, dd, aa, RMD256.__X__[15],  6);
        aa = RMD256.__II__(aa, bb, cc, dd, RMD256.__X__[14],  8);
        dd = RMD256.__II__(dd, aa, bb, cc, RMD256.__X__[ 5],  6);
        cc = RMD256.__II__(cc, dd, aa, bb, RMD256.__X__[ 6],  5);
        bb = RMD256.__II__(bb, cc, dd, aa, RMD256.__X__[ 2], 12);
        
        /* parallel round 4 */
        aaa = RMD256.__FFF__(aaa, bbb, ccc, ddd, RMD256.__X__[ 8], 15);
        ddd = RMD256.__FFF__(ddd, aaa, bbb, ccc, RMD256.__X__[ 6],  5);
        ccc = RMD256.__FFF__(ccc, ddd, aaa, bbb, RMD256.__X__[ 4],  8);
        bbb = RMD256.__FFF__(bbb, ccc, ddd, aaa, RMD256.__X__[ 1], 11);
        aaa = RMD256.__FFF__(aaa, bbb, ccc, ddd, RMD256.__X__[ 3], 14);
        ddd = RMD256.__FFF__(ddd, aaa, bbb, ccc, RMD256.__X__[11], 14);
        ccc = RMD256.__FFF__(ccc, ddd, aaa, bbb, RMD256.__X__[15],  6);
        bbb = RMD256.__FFF__(bbb, ccc, ddd, aaa, RMD256.__X__[ 0], 14);
        aaa = RMD256.__FFF__(aaa, bbb, ccc, ddd, RMD256.__X__[ 5],  6);
        ddd = RMD256.__FFF__(ddd, aaa, bbb, ccc, RMD256.__X__[12],  9);
        ccc = RMD256.__FFF__(ccc, ddd, aaa, bbb, RMD256.__X__[ 2], 12);
        bbb = RMD256.__FFF__(bbb, ccc, ddd, aaa, RMD256.__X__[13],  9);
        aaa = RMD256.__FFF__(aaa, bbb, ccc, ddd, RMD256.__X__[ 9], 12);
        ddd = RMD256.__FFF__(ddd, aaa, bbb, ccc, RMD256.__X__[ 7],  5);
        ccc = RMD256.__FFF__(ccc, ddd, aaa, bbb, RMD256.__X__[10], 15);
        bbb = RMD256.__FFF__(bbb, ccc, ddd, aaa, RMD256.__X__[14],  8);
        
        dd ^= ddd; ddd ^= dd; dd ^= ddd;

        this._digest[0] = (this._digest[0] + aa ) >>> 0;
        this._digest[1] = (this._digest[1] + bb ) >>> 0;
        this._digest[2] = (this._digest[2] + cc ) >>> 0;
        this._digest[3] = (this._digest[3] + dd ) >>> 0;
        this._digest[4] = (this._digest[4] + aaa) >>> 0;
        this._digest[5] = (this._digest[5] + bbb) >>> 0;
        this._digest[6] = (this._digest[6] + ccc) >>> 0;
        this._digest[7] = (this._digest[7] + ddd) >>> 0;
        
        memset(RMD256.__X__, 0, 0, 16);
    }
}

export default RMD256;
