/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import HashAlgorithm from "./HashAlgorithm";
import memcpy from "../buffer/memcpy";
import memset from "../buffer/memset";
import u32vdec from "../buffer/u32vdec";
import u32venc from "../buffer/u32venc";

class SHA1 extends HashAlgorithm {
    private static readonly __PADLEN__: Uint8Array = new Uint8Array([
        0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0,
    ]);

    private static readonly __X__: Uint32Array = new Uint32Array(80);

    private static __ROTL__(x: number, n: number): number {
        return (((x) << (n)) | ((x) >>> (32 - (n))));
    }

    private static __U64BE_ADD__(u: Uint32Array, v: number): Uint32Array {
        const lo: number = (v << 3) >>> 0;
        const hi: number = (v >>> 29);
        u[1] = (u[1] + lo) >>> 0;
        u[0] = (u[0] + hi + (u[1] < lo ? 1 : 0)) >>> 0;
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

        SHA1.__U64BE_ADD__(this._length, length);

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
            memcpy(SHA1.__PADLEN__, this._buffer, 0, 56 - this._cursor, this._cursor);
            u32venc(this._length, this._buffer, false, 0, 2, 56);
            this._transform(this._buffer);
        } else {
            memcpy(SHA1.__PADLEN__, this._buffer, 0, 64 - this._cursor, this._cursor);
            this._transform(this._buffer);
            u32venc(this._length, SHA1.__PADLEN__, false, 0, 2, 64);
            this._transform(SHA1.__PADLEN__, 8);
            memset(SHA1.__PADLEN__, 0, 64);
        }

        const output: Uint8Array = u32venc(this._digest, new Uint8Array(20), false);
        this.reset();

        return output;
    }

    private _transform(block: Uint8Array, start: number = 0): void {
        let a: number = this._digest[0];
        let b: number = this._digest[1];
        let c: number = this._digest[2];
        let d: number = this._digest[3];
        let e: number = this._digest[4];

        u32vdec(block, SHA1.__X__, false, start, start + 64);

        for (let i: number = 16; i < 80; ++i) {
            SHA1.__X__[i] = SHA1.__ROTL__(SHA1.__X__[i - 3] ^ SHA1.__X__[i - 8] ^ SHA1.__X__[i - 14] ^ SHA1.__X__[i - 16], 1);
        }

        for (let i: number = 0, t: number; i < 20; ++i) {
            t = SHA1.__ROTL__(a, 5) + ((b & c) | ((~b) & d)) + e + SHA1.__X__[i] + 0x5a827999;
            e = d;
            d = c;
            c = SHA1.__ROTL__(b, 30);
            b = a;
            a = t;
        }

        for (let i: number = 20, t: number; i < 40; ++i) {
            t = SHA1.__ROTL__(a, 5) + (b ^ c ^ d) + e + SHA1.__X__[i] + 0x6ed9eba1;
            e = d;
            d = c;
            c = SHA1.__ROTL__(b, 30);
            b = a;
            a = t;
        }

        for (let i: number = 40, t: number; i < 60; ++i) {
            t = SHA1.__ROTL__(a, 5) + ((b & c) | (b & d) | (c & d)) + e + SHA1.__X__[i] + 0x8f1bbcdc;
            e = d;
            d = c;
            c = SHA1.__ROTL__(b, 30);
            b = a;
            a = t;
        }

        for (let i: number = 60, t: number; i < 80; ++i) {
            t = SHA1.__ROTL__(a, 5) + (b ^ c ^ d) + e + SHA1.__X__[i] + 0xca62c1d6;
            e = d;
            d = c;
            c = SHA1.__ROTL__(b, 30);
            b = a;
            a = t;
        }

        this._digest[0] += a;
        this._digest[1] += b;
        this._digest[2] += c;
        this._digest[3] += d;
        this._digest[4] += e;

        memset(SHA1.__X__, 0);
    }
}

export default SHA1;
