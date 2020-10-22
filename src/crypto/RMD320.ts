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

class RMD320 implements IHashAlgorithm {
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
        (a) += RMD320.__F__((b), (c), (d)) + (x);
        (a)  = RMD320.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __GG__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD320.__G__((b), (c), (d)) + (x) + 0x5a827999;
        (a)  = RMD320.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __HH__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD320.__H__((b), (c), (d)) + (x) + 0x6ed9eba1;
        (a)  = RMD320.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __II__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD320.__I__((b), (c), (d)) + (x) + 0x8f1bbcdc;
        (a)  = RMD320.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __JJ__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD320.__J__((b), (c), (d)) + (x) + 0xa953fd4e;
        (a)  = RMD320.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __FFF__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD320.__F__((b), (c), (d)) + (x);
        (a)  = RMD320.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __GGG__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD320.__G__((b), (c), (d)) + (x) + 0x7a6d76e9;
        (a)  = RMD320.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __HHH__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD320.__H__((b), (c), (d)) + (x) + 0x6d703ef3;
        (a)  = RMD320.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __III__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD320.__I__((b), (c), (d)) + (x) + 0x5c4dd124;
        (a)  = RMD320.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __JJJ__(a: number, b: number, c: number, d: number, e: number, x: number, s: number): number {
        (a) += RMD320.__J__((b), (c), (d)) + (x) + 0x50a28be6;
        (a)  = RMD320.__ROTL32__((a), (s)) + (e);
        return a;
    }

    private static __ROTL32__(x: number, s: number): number {
        return (((x) << (s)) | ((x) >>> (32 - (s))));
    }

    private _digest: Uint32Array = createUint32Array([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0, 0x76543210, 0xFEDCBA98, 0x89ABCDEF, 0x01234567, 0x3C2D1E0F]);
    private _chksum: Long64 = new Long64(0, 0);
    private _cursor: number = 0;
    private _buffer: Uint8Array = createUint8Array(64);

    public reset(): void {
        this._digest[0] = 0x67452301;
        this._digest[1] = 0xEFCDAB89;
        this._digest[2] = 0x98BADCFE;
        this._digest[3] = 0x10325476;
        this._digest[4] = 0xC3D2E1F0;
        this._digest[5] = 0x76543210;
        this._digest[6] = 0xFEDCBA98;
        this._digest[7] = 0x89ABCDEF;
        this._digest[8] = 0x01234567;
        this._digest[9] = 0x3C2D1E0F;
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
        const chksum: Uint8Array = createUint8Array(8)
        setLong64(chksum, this._chksum, 0, true);

        this.update(RMD320.__P__, 0, padlen);
        this.update(chksum, 0, 8);

        const digest: Uint8Array = createUint8Array(40);
        encodeUint32(this._digest, digest, true, 0, 10, 0, 40);
        this.reset();

        return digest;
    }

    private _transform(block: Uint8Array, offset: number = 0): void {
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

        decodeUint32(block, RMD320.__X__, true, offset, offset + 64, 0, 16);

        /* round 1 */
        aa = RMD320.__FF__(aa, bb, cc, dd, ee, RMD320.__X__[ 0], 11); cc = RMD320.__ROTL32__(cc, 10);
        ee = RMD320.__FF__(ee, aa, bb, cc, dd, RMD320.__X__[ 1], 14); bb = RMD320.__ROTL32__(bb, 10);
        dd = RMD320.__FF__(dd, ee, aa, bb, cc, RMD320.__X__[ 2], 15); aa = RMD320.__ROTL32__(aa, 10);
        cc = RMD320.__FF__(cc, dd, ee, aa, bb, RMD320.__X__[ 3], 12); ee = RMD320.__ROTL32__(ee, 10);
        bb = RMD320.__FF__(bb, cc, dd, ee, aa, RMD320.__X__[ 4],  5); dd = RMD320.__ROTL32__(dd, 10);
        aa = RMD320.__FF__(aa, bb, cc, dd, ee, RMD320.__X__[ 5],  8); cc = RMD320.__ROTL32__(cc, 10);
        ee = RMD320.__FF__(ee, aa, bb, cc, dd, RMD320.__X__[ 6],  7); bb = RMD320.__ROTL32__(bb, 10);
        dd = RMD320.__FF__(dd, ee, aa, bb, cc, RMD320.__X__[ 7],  9); aa = RMD320.__ROTL32__(aa, 10);
        cc = RMD320.__FF__(cc, dd, ee, aa, bb, RMD320.__X__[ 8], 11); ee = RMD320.__ROTL32__(ee, 10);
        bb = RMD320.__FF__(bb, cc, dd, ee, aa, RMD320.__X__[ 9], 13); dd = RMD320.__ROTL32__(dd, 10);
        aa = RMD320.__FF__(aa, bb, cc, dd, ee, RMD320.__X__[10], 14); cc = RMD320.__ROTL32__(cc, 10);
        ee = RMD320.__FF__(ee, aa, bb, cc, dd, RMD320.__X__[11], 15); bb = RMD320.__ROTL32__(bb, 10);
        dd = RMD320.__FF__(dd, ee, aa, bb, cc, RMD320.__X__[12],  6); aa = RMD320.__ROTL32__(aa, 10);
        cc = RMD320.__FF__(cc, dd, ee, aa, bb, RMD320.__X__[13],  7); ee = RMD320.__ROTL32__(ee, 10);
        bb = RMD320.__FF__(bb, cc, dd, ee, aa, RMD320.__X__[14],  9); dd = RMD320.__ROTL32__(dd, 10);
        aa = RMD320.__FF__(aa, bb, cc, dd, ee, RMD320.__X__[15],  8); cc = RMD320.__ROTL32__(cc, 10);
        
        /* parallel round 1 */
        aaa = RMD320.__JJJ__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[ 5],  8); ccc = RMD320.__ROTL32__(ccc, 10);
        eee = RMD320.__JJJ__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[14],  9); bbb = RMD320.__ROTL32__(bbb, 10);
        ddd = RMD320.__JJJ__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[ 7],  9); aaa = RMD320.__ROTL32__(aaa, 10);
        ccc = RMD320.__JJJ__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[ 0], 11); eee = RMD320.__ROTL32__(eee, 10);
        bbb = RMD320.__JJJ__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[ 9], 13); ddd = RMD320.__ROTL32__(ddd, 10);
        aaa = RMD320.__JJJ__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[ 2], 15); ccc = RMD320.__ROTL32__(ccc, 10);
        eee = RMD320.__JJJ__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[11], 15); bbb = RMD320.__ROTL32__(bbb, 10);
        ddd = RMD320.__JJJ__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[ 4],  5); aaa = RMD320.__ROTL32__(aaa, 10);
        ccc = RMD320.__JJJ__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[13],  7); eee = RMD320.__ROTL32__(eee, 10);
        bbb = RMD320.__JJJ__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[ 6],  7); ddd = RMD320.__ROTL32__(ddd, 10);
        aaa = RMD320.__JJJ__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[15],  8); ccc = RMD320.__ROTL32__(ccc, 10);
        eee = RMD320.__JJJ__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[ 8], 11); bbb = RMD320.__ROTL32__(bbb, 10);
        ddd = RMD320.__JJJ__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[ 1], 14); aaa = RMD320.__ROTL32__(aaa, 10);
        ccc = RMD320.__JJJ__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[10], 14); eee = RMD320.__ROTL32__(eee, 10);
        bbb = RMD320.__JJJ__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[ 3], 12); ddd = RMD320.__ROTL32__(ddd, 10);
        aaa = RMD320.__JJJ__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[12],  6); ccc = RMD320.__ROTL32__(ccc, 10);

        aa ^= aaa; aaa ^= aa; aa ^= aaa;
        
        /* round 2 */
        ee = RMD320.__GG__(ee, aa, bb, cc, dd, RMD320.__X__[ 7],  7); bb = RMD320.__ROTL32__(bb, 10);
        dd = RMD320.__GG__(dd, ee, aa, bb, cc, RMD320.__X__[ 4],  6); aa = RMD320.__ROTL32__(aa, 10);
        cc = RMD320.__GG__(cc, dd, ee, aa, bb, RMD320.__X__[13],  8); ee = RMD320.__ROTL32__(ee, 10);
        bb = RMD320.__GG__(bb, cc, dd, ee, aa, RMD320.__X__[ 1], 13); dd = RMD320.__ROTL32__(dd, 10);
        aa = RMD320.__GG__(aa, bb, cc, dd, ee, RMD320.__X__[10], 11); cc = RMD320.__ROTL32__(cc, 10);
        ee = RMD320.__GG__(ee, aa, bb, cc, dd, RMD320.__X__[ 6],  9); bb = RMD320.__ROTL32__(bb, 10);
        dd = RMD320.__GG__(dd, ee, aa, bb, cc, RMD320.__X__[15],  7); aa = RMD320.__ROTL32__(aa, 10);
        cc = RMD320.__GG__(cc, dd, ee, aa, bb, RMD320.__X__[ 3], 15); ee = RMD320.__ROTL32__(ee, 10);
        bb = RMD320.__GG__(bb, cc, dd, ee, aa, RMD320.__X__[12],  7); dd = RMD320.__ROTL32__(dd, 10);
        aa = RMD320.__GG__(aa, bb, cc, dd, ee, RMD320.__X__[ 0], 12); cc = RMD320.__ROTL32__(cc, 10);
        ee = RMD320.__GG__(ee, aa, bb, cc, dd, RMD320.__X__[ 9], 15); bb = RMD320.__ROTL32__(bb, 10);
        dd = RMD320.__GG__(dd, ee, aa, bb, cc, RMD320.__X__[ 5],  9); aa = RMD320.__ROTL32__(aa, 10);
        cc = RMD320.__GG__(cc, dd, ee, aa, bb, RMD320.__X__[ 2], 11); ee = RMD320.__ROTL32__(ee, 10);
        bb = RMD320.__GG__(bb, cc, dd, ee, aa, RMD320.__X__[14],  7); dd = RMD320.__ROTL32__(dd, 10);
        aa = RMD320.__GG__(aa, bb, cc, dd, ee, RMD320.__X__[11], 13); cc = RMD320.__ROTL32__(cc, 10);
        ee = RMD320.__GG__(ee, aa, bb, cc, dd, RMD320.__X__[ 8], 12); bb = RMD320.__ROTL32__(bb, 10);
        
        /* parallel round 2 */
        eee = RMD320.__III__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[ 6],  9); bbb = RMD320.__ROTL32__(bbb, 10);
        ddd = RMD320.__III__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[11], 13); aaa = RMD320.__ROTL32__(aaa, 10);
        ccc = RMD320.__III__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[ 3], 15); eee = RMD320.__ROTL32__(eee, 10);
        bbb = RMD320.__III__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[ 7],  7); ddd = RMD320.__ROTL32__(ddd, 10);
        aaa = RMD320.__III__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[ 0], 12); ccc = RMD320.__ROTL32__(ccc, 10);
        eee = RMD320.__III__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[13],  8); bbb = RMD320.__ROTL32__(bbb, 10);
        ddd = RMD320.__III__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[ 5],  9); aaa = RMD320.__ROTL32__(aaa, 10);
        ccc = RMD320.__III__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[10], 11); eee = RMD320.__ROTL32__(eee, 10);
        bbb = RMD320.__III__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[14],  7); ddd = RMD320.__ROTL32__(ddd, 10);
        aaa = RMD320.__III__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[15],  7); ccc = RMD320.__ROTL32__(ccc, 10);
        eee = RMD320.__III__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[ 8], 12); bbb = RMD320.__ROTL32__(bbb, 10);
        ddd = RMD320.__III__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[12],  7); aaa = RMD320.__ROTL32__(aaa, 10);
        ccc = RMD320.__III__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[ 4],  6); eee = RMD320.__ROTL32__(eee, 10);
        bbb = RMD320.__III__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[ 9], 15); ddd = RMD320.__ROTL32__(ddd, 10);
        aaa = RMD320.__III__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[ 1], 13); ccc = RMD320.__ROTL32__(ccc, 10);
        eee = RMD320.__III__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[ 2], 11); bbb = RMD320.__ROTL32__(bbb, 10);

        bb ^= bbb; bbb ^= bb; bb ^= bbb;
        
        /* round 3 */
        dd = RMD320.__HH__(dd, ee, aa, bb, cc, RMD320.__X__[ 3], 11); aa = RMD320.__ROTL32__(aa, 10);
        cc = RMD320.__HH__(cc, dd, ee, aa, bb, RMD320.__X__[10], 13); ee = RMD320.__ROTL32__(ee, 10);
        bb = RMD320.__HH__(bb, cc, dd, ee, aa, RMD320.__X__[14],  6); dd = RMD320.__ROTL32__(dd, 10);
        aa = RMD320.__HH__(aa, bb, cc, dd, ee, RMD320.__X__[ 4],  7); cc = RMD320.__ROTL32__(cc, 10);
        ee = RMD320.__HH__(ee, aa, bb, cc, dd, RMD320.__X__[ 9], 14); bb = RMD320.__ROTL32__(bb, 10);
        dd = RMD320.__HH__(dd, ee, aa, bb, cc, RMD320.__X__[15],  9); aa = RMD320.__ROTL32__(aa, 10);
        cc = RMD320.__HH__(cc, dd, ee, aa, bb, RMD320.__X__[ 8], 13); ee = RMD320.__ROTL32__(ee, 10);
        bb = RMD320.__HH__(bb, cc, dd, ee, aa, RMD320.__X__[ 1], 15); dd = RMD320.__ROTL32__(dd, 10);
        aa = RMD320.__HH__(aa, bb, cc, dd, ee, RMD320.__X__[ 2], 14); cc = RMD320.__ROTL32__(cc, 10);
        ee = RMD320.__HH__(ee, aa, bb, cc, dd, RMD320.__X__[ 7],  8); bb = RMD320.__ROTL32__(bb, 10);
        dd = RMD320.__HH__(dd, ee, aa, bb, cc, RMD320.__X__[ 0], 13); aa = RMD320.__ROTL32__(aa, 10);
        cc = RMD320.__HH__(cc, dd, ee, aa, bb, RMD320.__X__[ 6],  6); ee = RMD320.__ROTL32__(ee, 10);
        bb = RMD320.__HH__(bb, cc, dd, ee, aa, RMD320.__X__[13],  5); dd = RMD320.__ROTL32__(dd, 10);
        aa = RMD320.__HH__(aa, bb, cc, dd, ee, RMD320.__X__[11], 12); cc = RMD320.__ROTL32__(cc, 10);
        ee = RMD320.__HH__(ee, aa, bb, cc, dd, RMD320.__X__[ 5],  7); bb = RMD320.__ROTL32__(bb, 10);
        dd = RMD320.__HH__(dd, ee, aa, bb, cc, RMD320.__X__[12],  5); aa = RMD320.__ROTL32__(aa, 10);
        
        /* parallel round 3 */
        ddd = RMD320.__HHH__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[15],  9); aaa = RMD320.__ROTL32__(aaa, 10);
        ccc = RMD320.__HHH__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[ 5],  7); eee = RMD320.__ROTL32__(eee, 10);
        bbb = RMD320.__HHH__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[ 1], 15); ddd = RMD320.__ROTL32__(ddd, 10);
        aaa = RMD320.__HHH__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[ 3], 11); ccc = RMD320.__ROTL32__(ccc, 10);
        eee = RMD320.__HHH__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[ 7],  8); bbb = RMD320.__ROTL32__(bbb, 10);
        ddd = RMD320.__HHH__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[14],  6); aaa = RMD320.__ROTL32__(aaa, 10);
        ccc = RMD320.__HHH__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[ 6],  6); eee = RMD320.__ROTL32__(eee, 10);
        bbb = RMD320.__HHH__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[ 9], 14); ddd = RMD320.__ROTL32__(ddd, 10);
        aaa = RMD320.__HHH__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[11], 12); ccc = RMD320.__ROTL32__(ccc, 10);
        eee = RMD320.__HHH__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[ 8], 13); bbb = RMD320.__ROTL32__(bbb, 10);
        ddd = RMD320.__HHH__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[12],  5); aaa = RMD320.__ROTL32__(aaa, 10);
        ccc = RMD320.__HHH__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[ 2], 14); eee = RMD320.__ROTL32__(eee, 10);
        bbb = RMD320.__HHH__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[10], 13); ddd = RMD320.__ROTL32__(ddd, 10);
        aaa = RMD320.__HHH__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[ 0], 13); ccc = RMD320.__ROTL32__(ccc, 10);
        eee = RMD320.__HHH__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[ 4],  7); bbb = RMD320.__ROTL32__(bbb, 10);
        ddd = RMD320.__HHH__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[13],  5); aaa = RMD320.__ROTL32__(aaa, 10);

        cc ^= ccc; ccc ^= cc; cc ^= ccc;
        
        /* round 4 */
        cc = RMD320.__II__(cc, dd, ee, aa, bb, RMD320.__X__[ 1], 11); ee = RMD320.__ROTL32__(ee, 10);
        bb = RMD320.__II__(bb, cc, dd, ee, aa, RMD320.__X__[ 9], 12); dd = RMD320.__ROTL32__(dd, 10);
        aa = RMD320.__II__(aa, bb, cc, dd, ee, RMD320.__X__[11], 14); cc = RMD320.__ROTL32__(cc, 10);
        ee = RMD320.__II__(ee, aa, bb, cc, dd, RMD320.__X__[10], 15); bb = RMD320.__ROTL32__(bb, 10);
        dd = RMD320.__II__(dd, ee, aa, bb, cc, RMD320.__X__[ 0], 14); aa = RMD320.__ROTL32__(aa, 10);
        cc = RMD320.__II__(cc, dd, ee, aa, bb, RMD320.__X__[ 8], 15); ee = RMD320.__ROTL32__(ee, 10);
        bb = RMD320.__II__(bb, cc, dd, ee, aa, RMD320.__X__[12],  9); dd = RMD320.__ROTL32__(dd, 10);
        aa = RMD320.__II__(aa, bb, cc, dd, ee, RMD320.__X__[ 4],  8); cc = RMD320.__ROTL32__(cc, 10);
        ee = RMD320.__II__(ee, aa, bb, cc, dd, RMD320.__X__[13],  9); bb = RMD320.__ROTL32__(bb, 10);
        dd = RMD320.__II__(dd, ee, aa, bb, cc, RMD320.__X__[ 3], 14); aa = RMD320.__ROTL32__(aa, 10);
        cc = RMD320.__II__(cc, dd, ee, aa, bb, RMD320.__X__[ 7],  5); ee = RMD320.__ROTL32__(ee, 10);
        bb = RMD320.__II__(bb, cc, dd, ee, aa, RMD320.__X__[15],  6); dd = RMD320.__ROTL32__(dd, 10);
        aa = RMD320.__II__(aa, bb, cc, dd, ee, RMD320.__X__[14],  8); cc = RMD320.__ROTL32__(cc, 10);
        ee = RMD320.__II__(ee, aa, bb, cc, dd, RMD320.__X__[ 5],  6); bb = RMD320.__ROTL32__(bb, 10);
        dd = RMD320.__II__(dd, ee, aa, bb, cc, RMD320.__X__[ 6],  5); aa = RMD320.__ROTL32__(aa, 10);
        cc = RMD320.__II__(cc, dd, ee, aa, bb, RMD320.__X__[ 2], 12); ee = RMD320.__ROTL32__(ee, 10);
        
        /* parallel round 4 */   
        ccc = RMD320.__GGG__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[ 8], 15); eee = RMD320.__ROTL32__(eee, 10);
        bbb = RMD320.__GGG__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[ 6],  5); ddd = RMD320.__ROTL32__(ddd, 10);
        aaa = RMD320.__GGG__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[ 4],  8); ccc = RMD320.__ROTL32__(ccc, 10);
        eee = RMD320.__GGG__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[ 1], 11); bbb = RMD320.__ROTL32__(bbb, 10);
        ddd = RMD320.__GGG__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[ 3], 14); aaa = RMD320.__ROTL32__(aaa, 10);
        ccc = RMD320.__GGG__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[11], 14); eee = RMD320.__ROTL32__(eee, 10);
        bbb = RMD320.__GGG__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[15],  6); ddd = RMD320.__ROTL32__(ddd, 10);
        aaa = RMD320.__GGG__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[ 0], 14); ccc = RMD320.__ROTL32__(ccc, 10);
        eee = RMD320.__GGG__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[ 5],  6); bbb = RMD320.__ROTL32__(bbb, 10);
        ddd = RMD320.__GGG__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[12],  9); aaa = RMD320.__ROTL32__(aaa, 10);
        ccc = RMD320.__GGG__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[ 2], 12); eee = RMD320.__ROTL32__(eee, 10);
        bbb = RMD320.__GGG__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[13],  9); ddd = RMD320.__ROTL32__(ddd, 10);
        aaa = RMD320.__GGG__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[ 9], 12); ccc = RMD320.__ROTL32__(ccc, 10);
        eee = RMD320.__GGG__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[ 7],  5); bbb = RMD320.__ROTL32__(bbb, 10);
        ddd = RMD320.__GGG__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[10], 15); aaa = RMD320.__ROTL32__(aaa, 10);
        ccc = RMD320.__GGG__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[14],  8); eee = RMD320.__ROTL32__(eee, 10);

        dd ^= ddd; ddd ^= dd; dd ^= ddd;
        
        /* round 5 */
        bb = RMD320.__JJ__(bb, cc, dd, ee, aa, RMD320.__X__[ 4],  9); dd = RMD320.__ROTL32__(dd, 10);
        aa = RMD320.__JJ__(aa, bb, cc, dd, ee, RMD320.__X__[ 0], 15); cc = RMD320.__ROTL32__(cc, 10);
        ee = RMD320.__JJ__(ee, aa, bb, cc, dd, RMD320.__X__[ 5],  5); bb = RMD320.__ROTL32__(bb, 10);
        dd = RMD320.__JJ__(dd, ee, aa, bb, cc, RMD320.__X__[ 9], 11); aa = RMD320.__ROTL32__(aa, 10);
        cc = RMD320.__JJ__(cc, dd, ee, aa, bb, RMD320.__X__[ 7],  6); ee = RMD320.__ROTL32__(ee, 10);
        bb = RMD320.__JJ__(bb, cc, dd, ee, aa, RMD320.__X__[12],  8); dd = RMD320.__ROTL32__(dd, 10);
        aa = RMD320.__JJ__(aa, bb, cc, dd, ee, RMD320.__X__[ 2], 13); cc = RMD320.__ROTL32__(cc, 10);
        ee = RMD320.__JJ__(ee, aa, bb, cc, dd, RMD320.__X__[10], 12); bb = RMD320.__ROTL32__(bb, 10);
        dd = RMD320.__JJ__(dd, ee, aa, bb, cc, RMD320.__X__[14],  5); aa = RMD320.__ROTL32__(aa, 10);
        cc = RMD320.__JJ__(cc, dd, ee, aa, bb, RMD320.__X__[ 1], 12); ee = RMD320.__ROTL32__(ee, 10);
        bb = RMD320.__JJ__(bb, cc, dd, ee, aa, RMD320.__X__[ 3], 13); dd = RMD320.__ROTL32__(dd, 10);
        aa = RMD320.__JJ__(aa, bb, cc, dd, ee, RMD320.__X__[ 8], 14); cc = RMD320.__ROTL32__(cc, 10);
        ee = RMD320.__JJ__(ee, aa, bb, cc, dd, RMD320.__X__[11], 11); bb = RMD320.__ROTL32__(bb, 10);
        dd = RMD320.__JJ__(dd, ee, aa, bb, cc, RMD320.__X__[ 6],  8); aa = RMD320.__ROTL32__(aa, 10);
        cc = RMD320.__JJ__(cc, dd, ee, aa, bb, RMD320.__X__[15],  5); ee = RMD320.__ROTL32__(ee, 10);
        bb = RMD320.__JJ__(bb, cc, dd, ee, aa, RMD320.__X__[13],  6); dd = RMD320.__ROTL32__(dd, 10);
        
        /* parallel round 5 */
        bbb = RMD320.__FFF__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[12],  8); ddd = RMD320.__ROTL32__(ddd, 10);
        aaa = RMD320.__FFF__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[15],  5); ccc = RMD320.__ROTL32__(ccc, 10);
        eee = RMD320.__FFF__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[10], 12); bbb = RMD320.__ROTL32__(bbb, 10);
        ddd = RMD320.__FFF__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[ 4],  9); aaa = RMD320.__ROTL32__(aaa, 10);
        ccc = RMD320.__FFF__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[ 1], 12); eee = RMD320.__ROTL32__(eee, 10);
        bbb = RMD320.__FFF__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[ 5],  5); ddd = RMD320.__ROTL32__(ddd, 10);
        aaa = RMD320.__FFF__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[ 8], 14); ccc = RMD320.__ROTL32__(ccc, 10);
        eee = RMD320.__FFF__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[ 7],  6); bbb = RMD320.__ROTL32__(bbb, 10);
        ddd = RMD320.__FFF__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[ 6],  8); aaa = RMD320.__ROTL32__(aaa, 10);
        ccc = RMD320.__FFF__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[ 2], 13); eee = RMD320.__ROTL32__(eee, 10);
        bbb = RMD320.__FFF__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[13],  6); ddd = RMD320.__ROTL32__(ddd, 10);
        aaa = RMD320.__FFF__(aaa, bbb, ccc, ddd, eee, RMD320.__X__[14],  5); ccc = RMD320.__ROTL32__(ccc, 10);
        eee = RMD320.__FFF__(eee, aaa, bbb, ccc, ddd, RMD320.__X__[ 0], 15); bbb = RMD320.__ROTL32__(bbb, 10);
        ddd = RMD320.__FFF__(ddd, eee, aaa, bbb, ccc, RMD320.__X__[ 3], 13); aaa = RMD320.__ROTL32__(aaa, 10);
        ccc = RMD320.__FFF__(ccc, ddd, eee, aaa, bbb, RMD320.__X__[ 9], 11); eee = RMD320.__ROTL32__(eee, 10);
        bbb = RMD320.__FFF__(bbb, ccc, ddd, eee, aaa, RMD320.__X__[11], 11); ddd = RMD320.__ROTL32__(ddd, 10);

        ee ^= eee; eee ^= ee; ee ^= eee;

        this._digest[0] = (this._digest[0] + aa ) >>> 0;
        this._digest[1] = (this._digest[1] + bb ) >>> 0;
        this._digest[2] = (this._digest[2] + cc ) >>> 0;
        this._digest[3] = (this._digest[3] + dd ) >>> 0;
        this._digest[4] = (this._digest[4] + ee ) >>> 0;
        this._digest[5] = (this._digest[5] + aaa) >>> 0;
        this._digest[6] = (this._digest[6] + bbb) >>> 0;
        this._digest[7] = (this._digest[7] + ccc) >>> 0;
        this._digest[8] = (this._digest[8] + ddd) >>> 0;
        this._digest[9] = (this._digest[9] + eee) >>> 0;
        
        memset(RMD320.__X__, 0, 0, 16);
    }
}

export default RMD320;
