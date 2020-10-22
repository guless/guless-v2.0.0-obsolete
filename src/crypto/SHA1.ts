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

class SHA1 implements IHashAlgorithm {
    private static readonly __X__: Uint32Array = createUint32Array(80);
    private static readonly __P__: Uint8Array = createUint8Array([
        0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

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
        setLong64(chksum, this._chksum, 0, false);

        this.update(SHA1.__P__, 0, padlen);
        this.update(chksum, 0, 8);

        const digest: Uint8Array = createUint8Array(20);
        encodeUint32(this._digest, digest, false, 0, 5, 0, 20);
        this.reset();

        return digest;
    }

    private _transform(block: Uint8Array, offset: number = 0): void {
        let a: number = this._digest[0];
        let b: number = this._digest[1];
        let c: number = this._digest[2];
        let d: number = this._digest[3];
        let e: number = this._digest[4];

        decodeUint32(block, SHA1.__X__, false, offset, offset + 64, 0, 16);

        for (let i: number = 16; i < 80; ++i) {
            SHA1.__X__[i] = SHA1.__ROTL32__(SHA1.__X__[i - 3] ^ SHA1.__X__[i - 8] ^ SHA1.__X__[i - 14] ^ SHA1.__X__[i - 16], 1);
        }

        for (let i: number = 0, t: number; i < 20; ++i) {
            t = SHA1.__ROTL32__(a, 5) + ((b & c) | ((~b) & d)) + e + SHA1.__X__[i] + 0x5A827999;
            e = d;
            d = c;
            c = SHA1.__ROTL32__(b, 30);
            b = a;
            a = t;
        }

        for (let i: number = 20, t: number; i < 40; ++i) {
            t = SHA1.__ROTL32__(a, 5) + (b ^ c ^ d) + e + SHA1.__X__[i] + 0x6ED9EBA1;
            e = d;
            d = c;
            c = SHA1.__ROTL32__(b, 30);
            b = a;
            a = t;
        }

        for (let i: number = 40, t: number; i < 60; ++i) {
            t = SHA1.__ROTL32__(a, 5) + ((b & c) | (b & d) | (c & d)) + e + SHA1.__X__[i] + 0x8F1BBCDC;
            e = d;
            d = c;
            c = SHA1.__ROTL32__(b, 30);
            b = a;
            a = t;
        }

        for (let i: number = 60, t: number; i < 80; ++i) {
            t = SHA1.__ROTL32__(a, 5) + (b ^ c ^ d) + e + SHA1.__X__[i] + 0xCA62C1D6;
            e = d;
            d = c;
            c = SHA1.__ROTL32__(b, 30);
            b = a;
            a = t;
        }

        this._digest[0] = (a + this._digest[0]) >>> 0;
        this._digest[1] = (b + this._digest[1]) >>> 0;
        this._digest[2] = (c + this._digest[2]) >>> 0;
        this._digest[3] = (d + this._digest[3]) >>> 0;
        this._digest[4] = (e + this._digest[4]) >>> 0;

        memset(SHA1.__X__, 0, 0, 80);
    }
}

export default SHA1;
