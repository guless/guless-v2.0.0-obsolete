/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import IHashAlgorithm from "./IHashAlgorithm";
import allocUint8Array from "../buffer/allocUint8Array";
import memset from "../buffer/memset";
import memcpy from "../buffer/memcpy";

class MD2 implements IHashAlgorithm {
    private static readonly __PI_SUBST__: Uint8Array = allocUint8Array([
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

    private static readonly __X__: Uint8Array = allocUint8Array(32);

    private _digest: Uint8Array = allocUint8Array(16);
    private _chksum: Uint8Array = allocUint8Array(16);
    private _cursor: number = 0;
    private _buffer: Uint8Array = allocUint8Array(16);

    public reset(): void {
        memset(this._digest, 0, 0, 16);
        memset(this._chksum, 0, 0, 16);
        this._cursor = 0;
        memset(this._buffer, 0, 0, 16);
    }

    public update(source: Uint8Array, start: number = 0, end: number = source.length): void {
        throw new Error("Method not implemented.");
    }

    public final(): Uint8Array {
        throw new Error("Method not implemented.");
    }

    private _transform(block: Uint8Array, offset: number = 0): void {
        throw new Error("Method not implemented.");
    }
}

export default MD2;
