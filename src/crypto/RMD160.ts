/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import IHashAlgorithm from "./IHashAlgorithm";
import createUint8Array from "../buffer/createUint8Array";
import createUint32Array from "../buffer/createUint32Array";
import memset from "../buffer/memset";
import memcpy from "../buffer/memcpy";
import decodeUint32 from "../buffer/decodeUint32";
import encodeUint32 from "../buffer/encodeUint32";
import Long64 from "../buffer/Long64";
import setLong64 from "../buffer/setLong64";

class RMD160 implements IHashAlgorithm {
    private static readonly __X__: Uint32Array = createUint32Array(16);
    private static readonly __P__: Uint8Array = createUint8Array([
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

    private static __J__(x: number, y: number, z: number): number {
        return ((x) ^ ((y) | ~(z)));
    }

    private static __FF__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD160.__F__((b), (c), (d)) + (x);
        (a)  = RMD160.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __GG__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD160.__G__((b), (c), (d)) + (x) + 0x5a827999;
        (a)  = RMD160.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __HH__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD160.__H__((b), (c), (d)) + (x) + 0x6ed9eba1;
        (a)  = RMD160.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __II__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD160.__I__((b), (c), (d)) + (x) + 0x8f1bbcdc;
        (a)  = RMD160.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __JJ__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD160.__J__((b), (c), (d)) + (x) + 0xa953fd4e;
        (a)  = RMD160.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __FFF__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD160.__F__((b), (c), (d)) + (x);
        (a)  = RMD160.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __GGG__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD160.__G__((b), (c), (d)) + (x) + 0x7a6d76e9;
        (a)  = RMD160.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __HHH__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD160.__H__((b), (c), (d)) + (x) + 0x6d703ef3;
        (a)  = RMD160.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __III__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD160.__I__((b), (c), (d)) + (x) + 0x5c4dd124;
        (a)  = RMD160.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __JJJ__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD160.__J__((b), (c), (d)) + (x) + 0x50a28be6;
        (a)  = RMD160.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __ROTL32__(x: number, s: number): number {
        return (((x) << (s)) | ((x) >>> (32 - (s))));
    }

    private _digest: Uint32Array = createUint32Array([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
    private _chksum: Long64 = new Long64(0, 0);
    private _cursor: number = 0;
    private _buffer: Uint8Array = createUint8Array(64);

    public reset(): void {
        this._digest[0] = 0x67452301;
        this._digest[1] = 0xEFCDAB89;
        this._digest[2] = 0x98BADCFE;
        this._digest[3] = 0x10325476;
        this._digest[4] = 0xC3D2E1F0;
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
        const chksum: Uint8Array = createUint8Array(8);
        setLong64(chksum, this._chksum, 0, true);

        this.update(RMD160.__P__, 0, padlen);
        this.update(chksum, 0, 8);

        const digest: Uint8Array = createUint8Array(20);
        encodeUint32(this._digest, digest, true, 0, 5, 0, 20);
        this.reset();

        return digest;
    }

    private _transform(block: Uint8Array, offset: number = 0): void {
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

        decodeUint32(block, RMD160.__X__, true, offset, offset + 64, 0, 16);

        /* round 1 */
        aa = RMD160.__FF__(aa, bb, cc, dd, ee, RMD160.__X__[ 0], 11); cc = RMD160.__ROTL32__(cc, 10);
        ee = RMD160.__FF__(ee, aa, bb, cc, dd, RMD160.__X__[ 1], 14); bb = RMD160.__ROTL32__(bb, 10);
        dd = RMD160.__FF__(dd, ee, aa, bb, cc, RMD160.__X__[ 2], 15); aa = RMD160.__ROTL32__(aa, 10);
        cc = RMD160.__FF__(cc, dd, ee, aa, bb, RMD160.__X__[ 3], 12); ee = RMD160.__ROTL32__(ee, 10);
        bb = RMD160.__FF__(bb, cc, dd, ee, aa, RMD160.__X__[ 4],  5); dd = RMD160.__ROTL32__(dd, 10);
        aa = RMD160.__FF__(aa, bb, cc, dd, ee, RMD160.__X__[ 5],  8); cc = RMD160.__ROTL32__(cc, 10);
        ee = RMD160.__FF__(ee, aa, bb, cc, dd, RMD160.__X__[ 6],  7); bb = RMD160.__ROTL32__(bb, 10);
        dd = RMD160.__FF__(dd, ee, aa, bb, cc, RMD160.__X__[ 7],  9); aa = RMD160.__ROTL32__(aa, 10);
        cc = RMD160.__FF__(cc, dd, ee, aa, bb, RMD160.__X__[ 8], 11); ee = RMD160.__ROTL32__(ee, 10);
        bb = RMD160.__FF__(bb, cc, dd, ee, aa, RMD160.__X__[ 9], 13); dd = RMD160.__ROTL32__(dd, 10);
        aa = RMD160.__FF__(aa, bb, cc, dd, ee, RMD160.__X__[10], 14); cc = RMD160.__ROTL32__(cc, 10);
        ee = RMD160.__FF__(ee, aa, bb, cc, dd, RMD160.__X__[11], 15); bb = RMD160.__ROTL32__(bb, 10);
        dd = RMD160.__FF__(dd, ee, aa, bb, cc, RMD160.__X__[12],  6); aa = RMD160.__ROTL32__(aa, 10);
        cc = RMD160.__FF__(cc, dd, ee, aa, bb, RMD160.__X__[13],  7); ee = RMD160.__ROTL32__(ee, 10);
        bb = RMD160.__FF__(bb, cc, dd, ee, aa, RMD160.__X__[14],  9); dd = RMD160.__ROTL32__(dd, 10);
        aa = RMD160.__FF__(aa, bb, cc, dd, ee, RMD160.__X__[15],  8); cc = RMD160.__ROTL32__(cc, 10);
        
        /* parallel round 1 */
        aaa = RMD160.__JJJ__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[ 5],  8); ccc = RMD160.__ROTL32__(ccc, 10);
        eee = RMD160.__JJJ__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[14],  9); bbb = RMD160.__ROTL32__(bbb, 10);
        ddd = RMD160.__JJJ__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[ 7],  9); aaa = RMD160.__ROTL32__(aaa, 10);
        ccc = RMD160.__JJJ__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[ 0], 11); eee = RMD160.__ROTL32__(eee, 10);
        bbb = RMD160.__JJJ__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[ 9], 13); ddd = RMD160.__ROTL32__(ddd, 10);
        aaa = RMD160.__JJJ__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[ 2], 15); ccc = RMD160.__ROTL32__(ccc, 10);
        eee = RMD160.__JJJ__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[11], 15); bbb = RMD160.__ROTL32__(bbb, 10);
        ddd = RMD160.__JJJ__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[ 4],  5); aaa = RMD160.__ROTL32__(aaa, 10);
        ccc = RMD160.__JJJ__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[13],  7); eee = RMD160.__ROTL32__(eee, 10);
        bbb = RMD160.__JJJ__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[ 6],  7); ddd = RMD160.__ROTL32__(ddd, 10);
        aaa = RMD160.__JJJ__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[15],  8); ccc = RMD160.__ROTL32__(ccc, 10);
        eee = RMD160.__JJJ__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[ 8], 11); bbb = RMD160.__ROTL32__(bbb, 10);
        ddd = RMD160.__JJJ__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[ 1], 14); aaa = RMD160.__ROTL32__(aaa, 10);
        ccc = RMD160.__JJJ__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[10], 14); eee = RMD160.__ROTL32__(eee, 10);
        bbb = RMD160.__JJJ__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[ 3], 12); ddd = RMD160.__ROTL32__(ddd, 10);
        aaa = RMD160.__JJJ__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[12],  6); ccc = RMD160.__ROTL32__(ccc, 10);
        
        /* round 2 */
        ee = RMD160.__GG__(ee, aa, bb, cc, dd, RMD160.__X__[ 7],  7); bb = RMD160.__ROTL32__(bb, 10);
        dd = RMD160.__GG__(dd, ee, aa, bb, cc, RMD160.__X__[ 4],  6); aa = RMD160.__ROTL32__(aa, 10);
        cc = RMD160.__GG__(cc, dd, ee, aa, bb, RMD160.__X__[13],  8); ee = RMD160.__ROTL32__(ee, 10);
        bb = RMD160.__GG__(bb, cc, dd, ee, aa, RMD160.__X__[ 1], 13); dd = RMD160.__ROTL32__(dd, 10);
        aa = RMD160.__GG__(aa, bb, cc, dd, ee, RMD160.__X__[10], 11); cc = RMD160.__ROTL32__(cc, 10);
        ee = RMD160.__GG__(ee, aa, bb, cc, dd, RMD160.__X__[ 6],  9); bb = RMD160.__ROTL32__(bb, 10);
        dd = RMD160.__GG__(dd, ee, aa, bb, cc, RMD160.__X__[15],  7); aa = RMD160.__ROTL32__(aa, 10);
        cc = RMD160.__GG__(cc, dd, ee, aa, bb, RMD160.__X__[ 3], 15); ee = RMD160.__ROTL32__(ee, 10);
        bb = RMD160.__GG__(bb, cc, dd, ee, aa, RMD160.__X__[12],  7); dd = RMD160.__ROTL32__(dd, 10);
        aa = RMD160.__GG__(aa, bb, cc, dd, ee, RMD160.__X__[ 0], 12); cc = RMD160.__ROTL32__(cc, 10);
        ee = RMD160.__GG__(ee, aa, bb, cc, dd, RMD160.__X__[ 9], 15); bb = RMD160.__ROTL32__(bb, 10);
        dd = RMD160.__GG__(dd, ee, aa, bb, cc, RMD160.__X__[ 5],  9); aa = RMD160.__ROTL32__(aa, 10);
        cc = RMD160.__GG__(cc, dd, ee, aa, bb, RMD160.__X__[ 2], 11); ee = RMD160.__ROTL32__(ee, 10);
        bb = RMD160.__GG__(bb, cc, dd, ee, aa, RMD160.__X__[14],  7); dd = RMD160.__ROTL32__(dd, 10);
        aa = RMD160.__GG__(aa, bb, cc, dd, ee, RMD160.__X__[11], 13); cc = RMD160.__ROTL32__(cc, 10);
        ee = RMD160.__GG__(ee, aa, bb, cc, dd, RMD160.__X__[ 8], 12); bb = RMD160.__ROTL32__(bb, 10);
        
        /* parallel round 2 */
        eee = RMD160.__III__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[ 6],  9); bbb = RMD160.__ROTL32__(bbb, 10);
        ddd = RMD160.__III__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[11], 13); aaa = RMD160.__ROTL32__(aaa, 10);
        ccc = RMD160.__III__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[ 3], 15); eee = RMD160.__ROTL32__(eee, 10);
        bbb = RMD160.__III__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[ 7],  7); ddd = RMD160.__ROTL32__(ddd, 10);
        aaa = RMD160.__III__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[ 0], 12); ccc = RMD160.__ROTL32__(ccc, 10);
        eee = RMD160.__III__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[13],  8); bbb = RMD160.__ROTL32__(bbb, 10);
        ddd = RMD160.__III__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[ 5],  9); aaa = RMD160.__ROTL32__(aaa, 10);
        ccc = RMD160.__III__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[10], 11); eee = RMD160.__ROTL32__(eee, 10);
        bbb = RMD160.__III__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[14],  7); ddd = RMD160.__ROTL32__(ddd, 10);
        aaa = RMD160.__III__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[15],  7); ccc = RMD160.__ROTL32__(ccc, 10);
        eee = RMD160.__III__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[ 8], 12); bbb = RMD160.__ROTL32__(bbb, 10);
        ddd = RMD160.__III__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[12],  7); aaa = RMD160.__ROTL32__(aaa, 10);
        ccc = RMD160.__III__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[ 4],  6); eee = RMD160.__ROTL32__(eee, 10);
        bbb = RMD160.__III__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[ 9], 15); ddd = RMD160.__ROTL32__(ddd, 10);
        aaa = RMD160.__III__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[ 1], 13); ccc = RMD160.__ROTL32__(ccc, 10);
        eee = RMD160.__III__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[ 2], 11); bbb = RMD160.__ROTL32__(bbb, 10);
        
        /* round 3 */
        dd = RMD160.__HH__(dd, ee, aa, bb, cc, RMD160.__X__[ 3], 11); aa = RMD160.__ROTL32__(aa, 10);
        cc = RMD160.__HH__(cc, dd, ee, aa, bb, RMD160.__X__[10], 13); ee = RMD160.__ROTL32__(ee, 10);
        bb = RMD160.__HH__(bb, cc, dd, ee, aa, RMD160.__X__[14],  6); dd = RMD160.__ROTL32__(dd, 10);
        aa = RMD160.__HH__(aa, bb, cc, dd, ee, RMD160.__X__[ 4],  7); cc = RMD160.__ROTL32__(cc, 10);
        ee = RMD160.__HH__(ee, aa, bb, cc, dd, RMD160.__X__[ 9], 14); bb = RMD160.__ROTL32__(bb, 10);
        dd = RMD160.__HH__(dd, ee, aa, bb, cc, RMD160.__X__[15],  9); aa = RMD160.__ROTL32__(aa, 10);
        cc = RMD160.__HH__(cc, dd, ee, aa, bb, RMD160.__X__[ 8], 13); ee = RMD160.__ROTL32__(ee, 10);
        bb = RMD160.__HH__(bb, cc, dd, ee, aa, RMD160.__X__[ 1], 15); dd = RMD160.__ROTL32__(dd, 10);
        aa = RMD160.__HH__(aa, bb, cc, dd, ee, RMD160.__X__[ 2], 14); cc = RMD160.__ROTL32__(cc, 10);
        ee = RMD160.__HH__(ee, aa, bb, cc, dd, RMD160.__X__[ 7],  8); bb = RMD160.__ROTL32__(bb, 10);
        dd = RMD160.__HH__(dd, ee, aa, bb, cc, RMD160.__X__[ 0], 13); aa = RMD160.__ROTL32__(aa, 10);
        cc = RMD160.__HH__(cc, dd, ee, aa, bb, RMD160.__X__[ 6],  6); ee = RMD160.__ROTL32__(ee, 10);
        bb = RMD160.__HH__(bb, cc, dd, ee, aa, RMD160.__X__[13],  5); dd = RMD160.__ROTL32__(dd, 10);
        aa = RMD160.__HH__(aa, bb, cc, dd, ee, RMD160.__X__[11], 12); cc = RMD160.__ROTL32__(cc, 10);
        ee = RMD160.__HH__(ee, aa, bb, cc, dd, RMD160.__X__[ 5],  7); bb = RMD160.__ROTL32__(bb, 10);
        dd = RMD160.__HH__(dd, ee, aa, bb, cc, RMD160.__X__[12],  5); aa = RMD160.__ROTL32__(aa, 10);
        
        /* parallel round 3 */
        ddd = RMD160.__HHH__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[15],  9); aaa = RMD160.__ROTL32__(aaa, 10);
        ccc = RMD160.__HHH__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[ 5],  7); eee = RMD160.__ROTL32__(eee, 10);
        bbb = RMD160.__HHH__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[ 1], 15); ddd = RMD160.__ROTL32__(ddd, 10);
        aaa = RMD160.__HHH__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[ 3], 11); ccc = RMD160.__ROTL32__(ccc, 10);
        eee = RMD160.__HHH__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[ 7],  8); bbb = RMD160.__ROTL32__(bbb, 10);
        ddd = RMD160.__HHH__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[14],  6); aaa = RMD160.__ROTL32__(aaa, 10);
        ccc = RMD160.__HHH__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[ 6],  6); eee = RMD160.__ROTL32__(eee, 10);
        bbb = RMD160.__HHH__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[ 9], 14); ddd = RMD160.__ROTL32__(ddd, 10);
        aaa = RMD160.__HHH__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[11], 12); ccc = RMD160.__ROTL32__(ccc, 10);
        eee = RMD160.__HHH__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[ 8], 13); bbb = RMD160.__ROTL32__(bbb, 10);
        ddd = RMD160.__HHH__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[12],  5); aaa = RMD160.__ROTL32__(aaa, 10);
        ccc = RMD160.__HHH__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[ 2], 14); eee = RMD160.__ROTL32__(eee, 10);
        bbb = RMD160.__HHH__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[10], 13); ddd = RMD160.__ROTL32__(ddd, 10);
        aaa = RMD160.__HHH__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[ 0], 13); ccc = RMD160.__ROTL32__(ccc, 10);
        eee = RMD160.__HHH__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[ 4],  7); bbb = RMD160.__ROTL32__(bbb, 10);
        ddd = RMD160.__HHH__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[13],  5); aaa = RMD160.__ROTL32__(aaa, 10);
        
        /* round 4 */
        cc = RMD160.__II__(cc, dd, ee, aa, bb, RMD160.__X__[ 1], 11); ee = RMD160.__ROTL32__(ee, 10);
        bb = RMD160.__II__(bb, cc, dd, ee, aa, RMD160.__X__[ 9], 12); dd = RMD160.__ROTL32__(dd, 10);
        aa = RMD160.__II__(aa, bb, cc, dd, ee, RMD160.__X__[11], 14); cc = RMD160.__ROTL32__(cc, 10);
        ee = RMD160.__II__(ee, aa, bb, cc, dd, RMD160.__X__[10], 15); bb = RMD160.__ROTL32__(bb, 10);
        dd = RMD160.__II__(dd, ee, aa, bb, cc, RMD160.__X__[ 0], 14); aa = RMD160.__ROTL32__(aa, 10);
        cc = RMD160.__II__(cc, dd, ee, aa, bb, RMD160.__X__[ 8], 15); ee = RMD160.__ROTL32__(ee, 10);
        bb = RMD160.__II__(bb, cc, dd, ee, aa, RMD160.__X__[12],  9); dd = RMD160.__ROTL32__(dd, 10);
        aa = RMD160.__II__(aa, bb, cc, dd, ee, RMD160.__X__[ 4],  8); cc = RMD160.__ROTL32__(cc, 10);
        ee = RMD160.__II__(ee, aa, bb, cc, dd, RMD160.__X__[13],  9); bb = RMD160.__ROTL32__(bb, 10);
        dd = RMD160.__II__(dd, ee, aa, bb, cc, RMD160.__X__[ 3], 14); aa = RMD160.__ROTL32__(aa, 10);
        cc = RMD160.__II__(cc, dd, ee, aa, bb, RMD160.__X__[ 7],  5); ee = RMD160.__ROTL32__(ee, 10);
        bb = RMD160.__II__(bb, cc, dd, ee, aa, RMD160.__X__[15],  6); dd = RMD160.__ROTL32__(dd, 10);
        aa = RMD160.__II__(aa, bb, cc, dd, ee, RMD160.__X__[14],  8); cc = RMD160.__ROTL32__(cc, 10);
        ee = RMD160.__II__(ee, aa, bb, cc, dd, RMD160.__X__[ 5],  6); bb = RMD160.__ROTL32__(bb, 10);
        dd = RMD160.__II__(dd, ee, aa, bb, cc, RMD160.__X__[ 6],  5); aa = RMD160.__ROTL32__(aa, 10);
        cc = RMD160.__II__(cc, dd, ee, aa, bb, RMD160.__X__[ 2], 12); ee = RMD160.__ROTL32__(ee, 10);
        
        /* parallel round 4 */   
        ccc = RMD160.__GGG__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[ 8], 15); eee = RMD160.__ROTL32__(eee, 10);
        bbb = RMD160.__GGG__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[ 6],  5); ddd = RMD160.__ROTL32__(ddd, 10);
        aaa = RMD160.__GGG__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[ 4],  8); ccc = RMD160.__ROTL32__(ccc, 10);
        eee = RMD160.__GGG__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[ 1], 11); bbb = RMD160.__ROTL32__(bbb, 10);
        ddd = RMD160.__GGG__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[ 3], 14); aaa = RMD160.__ROTL32__(aaa, 10);
        ccc = RMD160.__GGG__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[11], 14); eee = RMD160.__ROTL32__(eee, 10);
        bbb = RMD160.__GGG__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[15],  6); ddd = RMD160.__ROTL32__(ddd, 10);
        aaa = RMD160.__GGG__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[ 0], 14); ccc = RMD160.__ROTL32__(ccc, 10);
        eee = RMD160.__GGG__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[ 5],  6); bbb = RMD160.__ROTL32__(bbb, 10);
        ddd = RMD160.__GGG__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[12],  9); aaa = RMD160.__ROTL32__(aaa, 10);
        ccc = RMD160.__GGG__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[ 2], 12); eee = RMD160.__ROTL32__(eee, 10);
        bbb = RMD160.__GGG__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[13],  9); ddd = RMD160.__ROTL32__(ddd, 10);
        aaa = RMD160.__GGG__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[ 9], 12); ccc = RMD160.__ROTL32__(ccc, 10);
        eee = RMD160.__GGG__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[ 7],  5); bbb = RMD160.__ROTL32__(bbb, 10);
        ddd = RMD160.__GGG__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[10], 15); aaa = RMD160.__ROTL32__(aaa, 10);
        ccc = RMD160.__GGG__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[14],  8); eee = RMD160.__ROTL32__(eee, 10);
        
        /* round 5 */
        bb = RMD160.__JJ__(bb, cc, dd, ee, aa, RMD160.__X__[ 4],  9); dd = RMD160.__ROTL32__(dd, 10);
        aa = RMD160.__JJ__(aa, bb, cc, dd, ee, RMD160.__X__[ 0], 15); cc = RMD160.__ROTL32__(cc, 10);
        ee = RMD160.__JJ__(ee, aa, bb, cc, dd, RMD160.__X__[ 5],  5); bb = RMD160.__ROTL32__(bb, 10);
        dd = RMD160.__JJ__(dd, ee, aa, bb, cc, RMD160.__X__[ 9], 11); aa = RMD160.__ROTL32__(aa, 10);
        cc = RMD160.__JJ__(cc, dd, ee, aa, bb, RMD160.__X__[ 7],  6); ee = RMD160.__ROTL32__(ee, 10);
        bb = RMD160.__JJ__(bb, cc, dd, ee, aa, RMD160.__X__[12],  8); dd = RMD160.__ROTL32__(dd, 10);
        aa = RMD160.__JJ__(aa, bb, cc, dd, ee, RMD160.__X__[ 2], 13); cc = RMD160.__ROTL32__(cc, 10);
        ee = RMD160.__JJ__(ee, aa, bb, cc, dd, RMD160.__X__[10], 12); bb = RMD160.__ROTL32__(bb, 10);
        dd = RMD160.__JJ__(dd, ee, aa, bb, cc, RMD160.__X__[14],  5); aa = RMD160.__ROTL32__(aa, 10);
        cc = RMD160.__JJ__(cc, dd, ee, aa, bb, RMD160.__X__[ 1], 12); ee = RMD160.__ROTL32__(ee, 10);
        bb = RMD160.__JJ__(bb, cc, dd, ee, aa, RMD160.__X__[ 3], 13); dd = RMD160.__ROTL32__(dd, 10);
        aa = RMD160.__JJ__(aa, bb, cc, dd, ee, RMD160.__X__[ 8], 14); cc = RMD160.__ROTL32__(cc, 10);
        ee = RMD160.__JJ__(ee, aa, bb, cc, dd, RMD160.__X__[11], 11); bb = RMD160.__ROTL32__(bb, 10);
        dd = RMD160.__JJ__(dd, ee, aa, bb, cc, RMD160.__X__[ 6],  8); aa = RMD160.__ROTL32__(aa, 10);
        cc = RMD160.__JJ__(cc, dd, ee, aa, bb, RMD160.__X__[15],  5); ee = RMD160.__ROTL32__(ee, 10);
        bb = RMD160.__JJ__(bb, cc, dd, ee, aa, RMD160.__X__[13],  6); dd = RMD160.__ROTL32__(dd, 10);
        
        /* parallel round 5 */
        bbb = RMD160.__FFF__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[12],  8); ddd = RMD160.__ROTL32__(ddd, 10);
        aaa = RMD160.__FFF__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[15],  5); ccc = RMD160.__ROTL32__(ccc, 10);
        eee = RMD160.__FFF__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[10], 12); bbb = RMD160.__ROTL32__(bbb, 10);
        ddd = RMD160.__FFF__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[ 4],  9); aaa = RMD160.__ROTL32__(aaa, 10);
        ccc = RMD160.__FFF__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[ 1], 12); eee = RMD160.__ROTL32__(eee, 10);
        bbb = RMD160.__FFF__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[ 5],  5); ddd = RMD160.__ROTL32__(ddd, 10);
        aaa = RMD160.__FFF__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[ 8], 14); ccc = RMD160.__ROTL32__(ccc, 10);
        eee = RMD160.__FFF__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[ 7],  6); bbb = RMD160.__ROTL32__(bbb, 10);
        ddd = RMD160.__FFF__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[ 6],  8); aaa = RMD160.__ROTL32__(aaa, 10);
        ccc = RMD160.__FFF__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[ 2], 13); eee = RMD160.__ROTL32__(eee, 10);
        bbb = RMD160.__FFF__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[13],  6); ddd = RMD160.__ROTL32__(ddd, 10);
        aaa = RMD160.__FFF__(aaa, bbb, ccc, ddd, eee, RMD160.__X__[14],  5); ccc = RMD160.__ROTL32__(ccc, 10);
        eee = RMD160.__FFF__(eee, aaa, bbb, ccc, ddd, RMD160.__X__[ 0], 15); bbb = RMD160.__ROTL32__(bbb, 10);
        ddd = RMD160.__FFF__(ddd, eee, aaa, bbb, ccc, RMD160.__X__[ 3], 13); aaa = RMD160.__ROTL32__(aaa, 10);
        ccc = RMD160.__FFF__(ccc, ddd, eee, aaa, bbb, RMD160.__X__[ 9], 11); eee = RMD160.__ROTL32__(eee, 10);
        bbb = RMD160.__FFF__(bbb, ccc, ddd, eee, aaa, RMD160.__X__[11], 11); ddd = RMD160.__ROTL32__(ddd, 10);

        const t: number = this._digest[0];

        this._digest[0] = (this._digest[1] + cc + ddd) >>> 0;
        this._digest[1] = (this._digest[2] + dd + eee) >>> 0;
        this._digest[2] = (this._digest[3] + ee + aaa) >>> 0;
        this._digest[3] = (this._digest[4] + aa + bbb) >>> 0;
        this._digest[4] = (t + bb + ccc) >>> 0;
        
        memset(RMD160.__X__, 0, 0, 16);
    }
}

export default RMD160;
