/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import HashAlgorithm from "./HashAlgorithm";
import { u32, u8vec, u32vec, i32rotl } from "../buffer/ctypes";
import memcpy from "../buffer/memcpy";
import memset from "../buffer/memset";
import u32dec from "../buffer/u32dec";
import u32enc from "../buffer/u32enc";

class SHA1 extends HashAlgorithm {
    private static readonly __PADLEN__: u8vec = u8vec([
        0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0   , 0, 0, 0, 0, 0, 0, 0,
    ]);

    private static readonly __X__: u32vec = u32vec(80);

    private static __U64BE_ADD__(u: u32vec, v: number): u32vec {
        const lo: number = (v << 3) >>> 0;
        const hi: number = (v >>> 29);
        u[1] = (u[1] + lo) >>> 0;
        u[0] = (u[0] + hi + (u[1] < lo ? 1 : 0)) >>> 0;
        return u;
    }

    private _digest: u32vec = u32vec([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
    private _length: u32vec = u32vec(2);
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

    public final(): u8vec {
        if (this._cursor < 56) {
            memcpy(SHA1.__PADLEN__, this._buffer, 0, 56 - this._cursor, this._cursor);
            u32enc(this._length, this._buffer, false, 0, 2, 56);
            this._transform(this._buffer);
        } else {
            memcpy(SHA1.__PADLEN__, this._buffer, 0, 64 - this._cursor, this._cursor);
            this._transform(this._buffer);
            u32enc(this._length, SHA1.__PADLEN__, false, 0, 2, 64);
            this._transform(SHA1.__PADLEN__, 8);
            memset(SHA1.__PADLEN__, 0, 64);
        }

        const output: u8vec = u32enc(this._digest, u8vec(20), false);
        this.reset();

        return output;
    }

    private _transform(block: u8vec, start: number = 0): void {
        let a: number = this._digest[0];
        let b: number = this._digest[1];
        let c: number = this._digest[2];
        let d: number = this._digest[3];
        let e: number = this._digest[4];

        u32dec(block, SHA1.__X__, false, start, start + 64);

        for (let i: number = 16; i < 80; ++i) {
            SHA1.__X__[i] = i32rotl(SHA1.__X__[i - 3] ^ SHA1.__X__[i - 8] ^ SHA1.__X__[i - 14] ^ SHA1.__X__[i - 16], 1);
        }

        for (let i: number = 0, t: number; i < 20; ++i) {
            t = i32rotl(a, 5) + ((b & c) | ((~b) & d)) + e + SHA1.__X__[i] + 0x5a827999;
            e = d;
            d = c;
            c = i32rotl(b, 30);
            b = a;
            a = t;
        }

        for (let i: number = 20, t: number; i < 40; ++i) {
            t = i32rotl(a, 5) + (b ^ c ^ d) + e + SHA1.__X__[i] + 0x6ed9eba1;
            e = d;
            d = c;
            c = i32rotl(b, 30);
            b = a;
            a = t;
        }

        for (let i: number = 40, t: number; i < 60; ++i) {
            t = i32rotl(a, 5) + ((b & c) | (b & d) | (c & d)) + e + SHA1.__X__[i] + 0x8f1bbcdc;
            e = d;
            d = c;
            c = i32rotl(b, 30);
            b = a;
            a = t;
        }

        for (let i: number = 60, t: number; i < 80; ++i) {
            t = i32rotl(a, 5) + (b ^ c ^ d) + e + SHA1.__X__[i] + 0xca62c1d6;
            e = d;
            d = c;
            c = i32rotl(b, 30);
            b = a;
            a = t;
        }

        this._digest[0] = u32(this._digest[0] + a);
        this._digest[1] = u32(this._digest[1] + b);
        this._digest[2] = u32(this._digest[2] + c);
        this._digest[3] = u32(this._digest[3] + d);
        this._digest[4] = u32(this._digest[4] + e);

        memset(SHA1.__X__, 0);
    }
}

export default SHA1;
