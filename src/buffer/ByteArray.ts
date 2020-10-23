/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import assert from "../assert";
import memslc from "./memslc";
import createUint8Array from "./createUint8Array";

class ByteArray {
    private _littleEndian: boolean;
    private _fixed: boolean;
    private _minChunkSize: number;
    private _maxChunkSize: number;
    private _chunks: Uint8Array[] = [];
    private _totalChunkSize: number = 0;
    private _length: number = 0;
    
    constructor(chunks?: Uint8Array[], littleEndian: boolean = true, fixed: boolean = true, minChunkSize: number = 4, maxChunkSize: number = 16384) {
        this._littleEndian = littleEndian;
        this._fixed = fixed;
        this._minChunkSize = minChunkSize;
        this._maxChunkSize = maxChunkSize;

        if (chunks !== void 0) {
            for (const data of chunks) { this.append(data); }
        }
    }

    public get length(): number {
        return this._length;
    }

    public set length(value: number) {
        assert(!this._fixed, "Unable to set length of a fixed byte array.");
        this._increaseCapacity(value);
        this._length = value;
    }

    public append(data: Uint8Array): void {
        this._truncateCapacity(this._length);

        this._chunks.push(data);
        this._length += data.length;
        this._totalChunkSize += data.length;
    }

    public flush(): Uint8Array[] {
        this._truncateCapacity(this._length);

        const chunks: Uint8Array[] = this._chunks;
        this._chunks = [];
        this._totalChunkSize = 0;
        this._length = 0;
        return chunks;
    }

    private _increaseCapacity(value: number): void {
        while (this._totalChunkSize + this._maxChunkSize <= value) {
            this._chunks.push(createUint8Array(this._maxChunkSize));
            this._totalChunkSize += this._maxChunkSize;
        }

        if (this._totalChunkSize < value) {
            const chunkSize: number = this._roundChunkSize(value);
            
            this._chunks.push(createUint8Array(chunkSize));
            this._totalChunkSize += chunkSize;
        }
    }

    private _truncateCapacity(value: number): void {
        for (let i: number = this._chunks.length - 1; i >= 0 && this._totalChunkSize > value; --i) {
            const data: Uint8Array = this._chunks[i];
            this._totalChunkSize -= data.length;

            if (this._totalChunkSize <= value) {
                this._chunks.splice(i);

                if (this._totalChunkSize !== value) {
                    this._chunks.push(memslc(data, 0, value - this._totalChunkSize));
                    this._totalChunkSize = value;
                }
                break;
            }
        }
    }

    private _roundChunkSize(value: number): number {
        const e: number = Math.ceil(Math.log(value) / Math.LN2);
        const n: number = Math.pow(2, e);

        return Math.max(this._minChunkSize, Math.min(n, this._maxChunkSize));
    }
}

export default ByteArray;
