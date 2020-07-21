/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import HashAlgorithm from "./HashAlgorithm";
import { u8vec } from "../buffer/ctypes";
import memcpy from "../buffer/memcpy";
import memset from "../buffer/memset";

class MD2 extends HashAlgorithm {
    private static readonly __PI_SUBST__: u8vec = u8vec([
        41 , 46 , 67 , 201, 162, 216, 124, 1  , 61 , 54 , 84 , 161, 236, 240, 6  , 19 ,
        98 , 167, 5  , 243, 192, 199, 115, 140, 152, 147, 43 , 217, 188, 76 , 130, 202,
        30 , 155, 87 , 60 , 253, 212, 224, 22 , 103, 66 , 111, 24 , 138, 23 , 229, 18 ,
        190, 78 , 196, 214, 218, 158, 222, 73 , 160, 251, 245, 142, 187, 47 , 238, 122,
        169, 104, 121, 145, 21 , 178, 7  , 63 , 148, 194, 16 , 137, 11 , 34 , 95 , 33 ,
        128, 127, 93 , 154, 90 , 144, 50 , 39 , 53 , 62 , 204, 231, 191, 247, 151, 3  ,
        255, 25 , 48 , 179, 72 , 165, 181, 209, 215, 94 , 146, 42 , 172, 86 , 170, 198,
        79 , 184, 56 , 210, 150, 164, 125, 182, 118, 252, 107, 226, 156, 116, 4  , 241,
        69 , 157, 112, 89 , 100, 113, 135, 32 , 134, 91 , 207, 101, 230, 45 , 168, 2  ,
        27 , 96 , 37 , 173, 174, 176, 185, 246, 28 , 70 , 97 , 105, 52 , 64 , 126, 15 ,
        85 , 71 , 163, 35 , 221, 81 , 175, 58 , 195, 92 , 249, 206, 186, 197, 234, 38 ,
        44 , 83 , 13 , 110, 133, 40 , 132, 9  , 211, 223, 205, 244, 65 , 129, 77 , 82 ,
        106, 220, 55 , 200, 108, 193, 171, 250, 36 , 225, 123, 8  , 12 , 189, 177, 74 ,
        120, 136, 149, 139, 227, 99 , 232, 109, 233, 203, 213, 254, 59 , 0  , 29 , 57 ,
        242, 239, 183, 14 , 102, 88 , 208, 228, 166, 119, 114, 248, 235, 117, 75 , 10 ,
        49 , 68 , 80 , 180, 143, 237, 31 , 26 , 219, 153, 141, 51 , 159, 17 , 131, 20 ,
    ]);

    private static readonly __X__: u8vec = u8vec(32);

    private _digest: u8vec = u8vec(16);
    private _checksum: u8vec = u8vec(16);
    private _buffer: u8vec = u8vec(16);
    private _cursor: number = 0;

    public reset(): void {
        memset(this._digest, 0);
        memset(this._checksum, 0);
        this._cursor = 0;
        memset(this._buffer, 0);
    }

    public update(source: u8vec, sourceStart: number = 0, sourceEnd: number = source.length): void {
        const buffer: number = 16 - this._cursor;
        const length: number = sourceEnd - sourceStart;
        let i: number = sourceStart;

        if (length >= buffer) {
            const partial: number = buffer & 0x0F;

            if (partial !== 0) {
                memcpy(source, this._buffer, 0, partial, this._cursor);
                this._cursor = 0;
                this._transform(this._buffer);
            }

            for (i += partial; i + 16 <= sourceEnd; i += 16) {
                this._transform(source, i);
            }
        }

        memcpy(source, this._buffer, i, sourceEnd, this._cursor);
        this._cursor += sourceEnd - i;
    }

    public final(): u8vec {
        memset(this._buffer, 16 - this._cursor, this._cursor);

        this._transform(this._buffer);
        this._transform(this._checksum);

        const output: u8vec = memcpy(this._digest, u8vec(16));
        this.reset();

        return output;
    }

    private _transform(block: u8vec, start: number = 0): void {
        memcpy(block, MD2.__X__, start, start + 16);

        for (let i: number = 0; i < 16; ++i) {
            MD2.__X__[i + 16] = this._digest[i] ^ block[start + i];
        }

        for (let r: number = 0, t: number = 0; r < 18; ++r) {
            for (let i: number = 0; i < 16; ++i) {
                t = this._digest[i] ^= MD2.__PI_SUBST__[t];
            }
            for (let i: number = 0; i < 32; ++i) {
                t = MD2.__X__[i] ^= MD2.__PI_SUBST__[t];
            }
            t = (t + r) & 0xFF;
        }

        for (let i: number = 0, t: number = this._checksum[15]; i < 16; ++i) {
            t = this._checksum[i] ^= MD2.__PI_SUBST__[block[start + i] ^ t];
        }

        memset(MD2.__X__, 0);
    }
}

export default MD2;
