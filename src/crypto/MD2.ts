/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import HashAlgorithm from "./HashAlgorithm";
import memset from "../buffer/memset";
import memcpy from "../buffer/memcpy";

class MD2 extends HashAlgorithm {
    private static readonly __PI_SUBST__: Uint8Array = new Uint8Array([
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

    private _digest: Uint8Array = new Uint8Array(48); /*< state(16) + block(16) + state^block(16) >*/
    private _checksum: Uint8Array = new Uint8Array(16);
    private _buffer: Uint8Array = new Uint8Array(16);
    private _cursor: number = 0;

    public reset(): void {
        this._cursor = 0;
        memset(this._digest, 0);
        memset(this._checksum, 0);
    }

    public update(input: Uint8Array): void {
        const partial: number = 16 - this._cursor;

        if (input.length < partial) {
            memcpy(input, this._buffer, 0, input.length, this._cursor);
            this._cursor += input.length;
            return;
        }

        if (partial !== 16) {
            memcpy(input, this._buffer, 0, partial, this._cursor);
            this._transform(this._buffer);
            this._transform(input, partial);
        } else {
            this._transform(input);
        }

        this._cursor = (this._cursor + input.length) & 0x0F;
        memcpy(input, this._buffer, input.length - this._cursor);
    }

    public final(): Uint8Array {
        memset(this._buffer, 16 - this._cursor, this._cursor);

        this._transform(this._buffer);
        this._transform(this._checksum);

        const output: Uint8Array = memcpy(this._digest, new Uint8Array(16));
        this.reset();

        return output;
    }

    private _transform(block: Uint8Array, start: number = 0, end: number = block.length): void {
        for (let i: number = start; i + 16 <= end; i += 16) {
            memcpy(block, this._digest, i, i + 16, 16);

            for (let k: number = 0; k < 16; ++k) {
                this._digest[k + 32] = this._digest[k] ^ block[i + k];
            }

            for (let r: number = 0, t: number = 0; r < 18; ++r) {
                for (let k: number = 0; k < 48; ++k) {
                    t = this._digest[k] ^= MD2.__PI_SUBST__[t];
                }
                t = (t + r) & 0xFF;
            }

            for (let k: number = 0, t: number = this._checksum[15]; k < 16; ++k) {
                t = this._checksum[k] ^= MD2.__PI_SUBST__[block[i + k] ^ t];
            }

            memset(this._digest, 0, 16);
        }
    }
}

export default MD2;
