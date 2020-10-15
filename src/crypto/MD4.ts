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

class MD4 implements IHashAlgorithm {
    private static readonly __X__: Uint32Array = allocUint32Array(16);
    private static readonly __P__: Uint8Array = allocUint8Array([
        0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

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
        (a)  = MD4.__ROTL32__((a), (s));
        return a;
    }

    private static __GG__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += MD4.__G__((b), (c), (d)) + (x) + 0x5a827999;
        (a)  = MD4.__ROTL32__((a), (s));
        return a;
    }

    private static __HH__(a: number, b: number, c: number, d: number, x: number, s: number): number {
        (a) += MD4.__H__((b), (c), (d)) + (x) + 0x6ed9eba1;
        (a)  = MD4.__ROTL32__((a), (s));
        return a;
    }

    private static __ROTL32__(x: number, s: number): number {
        return (((x) << (s)) | ((x) >>> (32 - (s))));
    }

    private _digest: Uint32Array = allocUint32Array([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476]);
    private _chksum: Long64 = new Long64(0, 0);
    private _cursor: number = 0;
    private _buffer: Uint8Array = allocUint8Array(64);

    public reset(): void {
        this._digest[0] = 0x67452301;
        this._digest[1] = 0xEFCDAB89;
        this._digest[2] = 0x98BADCFE;
        this._digest[3] = 0x10325476;
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

        this.update(MD4.__P__, 0, padlen);
        this.update(chksum, 0, 8);

        const digest: Uint8Array = encodeUint32(this._digest, allocUint8Array(16), true, 0, 4, 0, 16);
        this.reset();

        return digest;
    }

    private _transform(block: Uint8Array, offset: number = 0): void {
        let a: number = this._digest[0];
        let b: number = this._digest[1];
        let c: number = this._digest[2];
        let d: number = this._digest[3];

        decodeUint32(block, MD4.__X__, true, offset, offset + 64, 0, 16);

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

        this._digest[0] = (a + this._digest[0]) >>> 0;
        this._digest[1] = (b + this._digest[1]) >>> 0;
        this._digest[2] = (c + this._digest[2]) >>> 0;
        this._digest[3] = (d + this._digest[3]) >>> 0;

        memset(MD4.__X__, 0, 0, 16);
    }
}

export default MD4;
