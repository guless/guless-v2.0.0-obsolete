/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import IHashAlgorithm from "./IHashAlgorithm";
import createUint8Array from "../buffer/createUint8Array";
import createUint32Array from "../buffer/createUint32Array";
import Long64 from "../platform/Long64";
import memset from "../buffer/memset";
import memcpy from "../buffer/memcpy";
import decodeUint32 from "../buffer/decodeUint32";
import encodeUint32 from "../buffer/encodeUint32";
import setLong64 from "../buffer/setLong64";

class MD5 implements IHashAlgorithm {
    private static readonly __X__: Uint32Array = createUint32Array(16);
    private static readonly __P__: Uint8Array = createUint8Array([
        0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    private static __F__(x: number, y: number, z: number): number {
        return (((x) & (y)) | ((~x) & (z)));
    }

    private static __G__(x: number, y: number, z: number): number {
        return (((x) & (z)) | ((y) & (~z)))
    }

    private static __H__(x: number, y: number, z: number): number {
        return ((x) ^ (y) ^ (z));
    }

    private static __I__(x: number, y: number, z: number): number {
        return ((y) ^ ((x) | (~z)));
    }

    private static __FF__(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
        (a) += MD5.__F__((b), (c), (d)) + (x) + (ac);
        (a)  = MD5.__ROTL32__((a), (s));
        (a) += (b);
        return a;
    }

    private static __GG__(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
        (a) += MD5.__G__((b), (c), (d)) + (x) + (ac);
        (a)  = MD5.__ROTL32__((a), (s));
        (a) += (b);
        return a;
    }

    private static __HH__(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
        (a) += MD5.__H__((b), (c), (d)) + (x) + (ac);
        (a)  = MD5.__ROTL32__((a), (s));
        (a) += (b);
        return a;
    }

    private static __II__(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
        (a) += MD5.__I__((b), (c), (d)) + (x) + (ac);
        (a)  = MD5.__ROTL32__((a), (s));
        (a) += (b);
        return a;
    }

    private static __ROTL32__(x: number, s: number): number {
        return (((x) << (s)) | ((x) >>> (32 - (s))));
    }

    private _digest: Uint32Array = createUint32Array([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476]);
    private _chksum: Long64 = new Long64(0, 0);
    private _cursor: number = 0;
    private _buffer: Uint8Array = createUint8Array(64);

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
        const chksum: Uint8Array = createUint8Array(8);
        setLong64(chksum, this._chksum, 0, true);

        this.update(MD5.__P__, 0, padlen);
        this.update(chksum, 0, 8);

        const digest: Uint8Array = createUint8Array(16);
        encodeUint32(this._digest, digest, true, 0, 4, 0, 16);
        this.reset();

        return digest;
    }

    private _transform(block: Uint8Array, offset: number = 0): void {
        let a: number = this._digest[0];
        let b: number = this._digest[1];
        let c: number = this._digest[2];
        let d: number = this._digest[3];

        decodeUint32(block, MD5.__X__, true, offset, offset + 64, 0, 16);

        /* Round 1 */
        a = MD5.__FF__(a, b, c, d, MD5.__X__[ 0],  7, 0xD76AA478);
        d = MD5.__FF__(d, a, b, c, MD5.__X__[ 1], 12, 0xE8C7B756);
        c = MD5.__FF__(c, d, a, b, MD5.__X__[ 2], 17, 0x242070DB);
        b = MD5.__FF__(b, c, d, a, MD5.__X__[ 3], 22, 0xC1BDCEEE);
        a = MD5.__FF__(a, b, c, d, MD5.__X__[ 4],  7, 0xF57C0FAF);
        d = MD5.__FF__(d, a, b, c, MD5.__X__[ 5], 12, 0x4787C62A);
        c = MD5.__FF__(c, d, a, b, MD5.__X__[ 6], 17, 0xA8304613);
        b = MD5.__FF__(b, c, d, a, MD5.__X__[ 7], 22, 0xFD469501);
        a = MD5.__FF__(a, b, c, d, MD5.__X__[ 8],  7, 0x698098D8);
        d = MD5.__FF__(d, a, b, c, MD5.__X__[ 9], 12, 0x8B44F7AF);
        c = MD5.__FF__(c, d, a, b, MD5.__X__[10], 17, 0xFFFF5BB1);
        b = MD5.__FF__(b, c, d, a, MD5.__X__[11], 22, 0x895CD7BE);
        a = MD5.__FF__(a, b, c, d, MD5.__X__[12],  7, 0x6B901122);
        d = MD5.__FF__(d, a, b, c, MD5.__X__[13], 12, 0xFD987193);
        c = MD5.__FF__(c, d, a, b, MD5.__X__[14], 17, 0xA679438E);
        b = MD5.__FF__(b, c, d, a, MD5.__X__[15], 22, 0x49B40821);

        /* Round 2 */
        a = MD5.__GG__(a, b, c, d, MD5.__X__[ 1],  5, 0xF61E2562);
        d = MD5.__GG__(d, a, b, c, MD5.__X__[ 6],  9, 0xC040B340);
        c = MD5.__GG__(c, d, a, b, MD5.__X__[11], 14, 0x265E5A51);
        b = MD5.__GG__(b, c, d, a, MD5.__X__[ 0], 20, 0xE9B6C7AA);
        a = MD5.__GG__(a, b, c, d, MD5.__X__[ 5],  5, 0xD62F105D);
        d = MD5.__GG__(d, a, b, c, MD5.__X__[10],  9, 0x02441453);
        c = MD5.__GG__(c, d, a, b, MD5.__X__[15], 14, 0xD8A1E681);
        b = MD5.__GG__(b, c, d, a, MD5.__X__[ 4], 20, 0xE7D3FBC8);
        a = MD5.__GG__(a, b, c, d, MD5.__X__[ 9],  5, 0x21E1CDE6);
        d = MD5.__GG__(d, a, b, c, MD5.__X__[14],  9, 0xC33707D6);
        c = MD5.__GG__(c, d, a, b, MD5.__X__[ 3], 14, 0xF4D50D87);
        b = MD5.__GG__(b, c, d, a, MD5.__X__[ 8], 20, 0x455A14ED);
        a = MD5.__GG__(a, b, c, d, MD5.__X__[13],  5, 0xA9E3E905);
        d = MD5.__GG__(d, a, b, c, MD5.__X__[ 2],  9, 0xFCEFA3F8);
        c = MD5.__GG__(c, d, a, b, MD5.__X__[ 7], 14, 0x676F02D9);
        b = MD5.__GG__(b, c, d, a, MD5.__X__[12], 20, 0x8D2A4C8A);

        /* Round 3 */
        a = MD5.__HH__(a, b, c, d, MD5.__X__[ 5],  4, 0xFFFA3942);
        d = MD5.__HH__(d, a, b, c, MD5.__X__[ 8], 11, 0x8771F681);
        c = MD5.__HH__(c, d, a, b, MD5.__X__[11], 16, 0x6D9D6122);
        b = MD5.__HH__(b, c, d, a, MD5.__X__[14], 23, 0xFDE5380C);
        a = MD5.__HH__(a, b, c, d, MD5.__X__[ 1],  4, 0xA4BEEA44);
        d = MD5.__HH__(d, a, b, c, MD5.__X__[ 4], 11, 0x4BDECFA9);
        c = MD5.__HH__(c, d, a, b, MD5.__X__[ 7], 16, 0xF6BB4B60);
        b = MD5.__HH__(b, c, d, a, MD5.__X__[10], 23, 0xBEBFBC70);
        a = MD5.__HH__(a, b, c, d, MD5.__X__[13],  4, 0x289B7EC6);
        d = MD5.__HH__(d, a, b, c, MD5.__X__[ 0], 11, 0xEAA127FA);
        c = MD5.__HH__(c, d, a, b, MD5.__X__[ 3], 16, 0xD4EF3085);
        b = MD5.__HH__(b, c, d, a, MD5.__X__[ 6], 23, 0x04881D05);
        a = MD5.__HH__(a, b, c, d, MD5.__X__[ 9],  4, 0xD9D4D039);
        d = MD5.__HH__(d, a, b, c, MD5.__X__[12], 11, 0xE6DB99E5);
        c = MD5.__HH__(c, d, a, b, MD5.__X__[15], 16, 0x1FA27CF8);
        b = MD5.__HH__(b, c, d, a, MD5.__X__[ 2], 23, 0xC4AC5665);

        /* Round 4 */
        a = MD5.__II__(a, b, c, d, MD5.__X__[ 0],  6, 0xF4292244);
        d = MD5.__II__(d, a, b, c, MD5.__X__[ 7], 10, 0x432AFF97);
        c = MD5.__II__(c, d, a, b, MD5.__X__[14], 15, 0xAB9423A7);
        b = MD5.__II__(b, c, d, a, MD5.__X__[ 5], 21, 0xFC93A039);
        a = MD5.__II__(a, b, c, d, MD5.__X__[12],  6, 0x655B59C3);
        d = MD5.__II__(d, a, b, c, MD5.__X__[ 3], 10, 0x8F0CCC92);
        c = MD5.__II__(c, d, a, b, MD5.__X__[10], 15, 0xFFEFF47D);
        b = MD5.__II__(b, c, d, a, MD5.__X__[ 1], 21, 0x85845DD1);
        a = MD5.__II__(a, b, c, d, MD5.__X__[ 8],  6, 0x6FA87E4F);
        d = MD5.__II__(d, a, b, c, MD5.__X__[15], 10, 0xFE2CE6E0);
        c = MD5.__II__(c, d, a, b, MD5.__X__[ 6], 15, 0xA3014314);
        b = MD5.__II__(b, c, d, a, MD5.__X__[13], 21, 0x4E0811A1);
        a = MD5.__II__(a, b, c, d, MD5.__X__[ 4],  6, 0xF7537E82);
        d = MD5.__II__(d, a, b, c, MD5.__X__[11], 10, 0xBD3AF235);
        c = MD5.__II__(c, d, a, b, MD5.__X__[ 2], 15, 0x2AD7D2BB);
        b = MD5.__II__(b, c, d, a, MD5.__X__[ 9], 21, 0xEB86D391);

        this._digest[0] = (a + this._digest[0]) >>> 0;
        this._digest[1] = (b + this._digest[1]) >>> 0;
        this._digest[2] = (c + this._digest[2]) >>> 0;
        this._digest[3] = (d + this._digest[3]) >>> 0;

        memset(MD5.__X__, 0, 0, 16);
    }
}

export default MD5;
