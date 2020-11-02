/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Reference from "../platform/Reference";
import createUint8Array from "./createUint8Array";
import memseg from "./memseg";
import memcut from "./memcut";
import Long64 from "./Long64";
import setBoolean from "./setBoolean";
import setInt8 from "./setInt8";
import setInt16 from "./setInt16";
import setInt32 from "./setInt32";
import setUint8 from "./setUint8";
import setUint16 from "./setUint16";
import setUint32 from "./setUint32";
import setFloat32 from "./setFloat32";
import setFloat64 from "./setFloat64";
import setLong64 from "./setLong64";

class BinaryWriter {
    public static readonly MIN_CHUNK_SIZE: number = 4;
    public static readonly MAX_CHUNK_SIZE: number = 16384;

    private static __SWAP_BUFFER__: null | Uint8Array = null;
    private static createSwapBuffer(length: number): Uint8Array {
        if (BinaryWriter.__SWAP_BUFFER__ === null || BinaryWriter.__SWAP_BUFFER__.length < length) {
            BinaryWriter.__SWAP_BUFFER__ = createUint8Array(length);
        }
        return BinaryWriter.__SWAP_BUFFER__;
    }

    private _chunks: Uint8Array[] = [];
    private _totalChunkSize: number = 0;
    private _littleEndian: boolean;
    private _minChunkSize: number;
    private _maxChunkSize: number;
    private _chunkId: number = 0;
    private _offsetChunkSize: number = 0;
    private _cursor: number = 0;
    private _length: number = 0;
    private _currentWriteBuffer: null | Uint8Array = null;
    private _currentWritePosition: Reference<number> = new Reference<number>(0);
    private _currentSavedPosition: number = 0;
    private _currentWriteToCursor: number = 0;
    private _currentWriteToSwapBuffer: boolean = false;

    constructor(littleEndian: boolean = true, minChunkSize: number = BinaryWriter.MIN_CHUNK_SIZE, maxChunkSize: number = BinaryWriter.MAX_CHUNK_SIZE) {
        this._littleEndian = littleEndian;
        this._minChunkSize = minChunkSize;
        this._maxChunkSize = maxChunkSize;
    }

    public get cursor(): number {
        return this._cursor;
    }

    public set cursor(value: number) {
        this._cursor = value;
    }

    public get length(): number {
        return this._length;
    }

    public set length(value: number) {
        this._length = value;
        this._ensureCapacity(this._length);
    }

    public get littleEndian(): boolean {
        return this._littleEndian;
    }

    public set littleEndian(value: boolean) {
        this._littleEndian = value;
    }

    public writeBytes(source: Uint8Array, start: number = 0, end: number = source.length): void {
        this._ensureWriteChunks(this._cursor, end - start);
        memseg(source, this._chunks, start, end, this._chunkId, this._chunks.length, this._cursor - this._offsetChunkSize);
        this._currentWritePosition.value += end - start;
        this._finishWriteChunks();
    }

    public writeBoolean(value: boolean): void {
        this._ensureWriteBuffer(this._cursor, 1);
        setBoolean(this._currentWriteBuffer!, value, this._currentWritePosition);
        this._finishWriteBuffer();
    }

    public writeInt8(value: number): void {
        this._ensureWriteBuffer(this._cursor, 1);
        setInt8(this._currentWriteBuffer!, value, this._currentWritePosition);
        this._finishWriteBuffer();
    }

    public writeInt16(value: number): void {
        this._ensureWriteBuffer(this._cursor, 2);
        setInt16(this._currentWriteBuffer!, value, this._currentWritePosition, this._littleEndian);
        this._finishWriteBuffer();
    }

    public writeInt32(value: number): void {
        this._ensureWriteBuffer(this._cursor, 4);
        setInt32(this._currentWriteBuffer!, value, this._currentWritePosition, this._littleEndian);
        this._finishWriteBuffer();
    }

    public writeUint8(value: number): void {
        this._ensureWriteBuffer(this._cursor, 1);
        setUint8(this._currentWriteBuffer!, value, this._currentWritePosition);
        this._finishWriteBuffer();
    }

    public writeUint16(value: number): void {
        this._ensureWriteBuffer(this._cursor, 2);
        setUint16(this._currentWriteBuffer!, value, this._currentWritePosition, this._littleEndian);
        this._finishWriteBuffer();
    }

    public writeUint32(value: number): void {
        this._ensureWriteBuffer(this._cursor, 4);
        setUint32(this._currentWriteBuffer!, value, this._currentWritePosition, this._littleEndian);
        this._finishWriteBuffer();
    }

    public writeFloat32(value: number): void {
        this._ensureWriteBuffer(this._cursor, 4);
        setFloat32(this._currentWriteBuffer!, value, this._currentWritePosition, this._littleEndian);
        this._finishWriteBuffer();
    }

    public writeFloat64(value: number): void {
        this._ensureWriteBuffer(this._cursor, 8);
        setFloat64(this._currentWriteBuffer!, value, this._currentWritePosition, this._littleEndian);
        this._finishWriteBuffer();
    }

    public writeLong64(value: Long64): void {
        this._ensureWriteBuffer(this._cursor, 8);
        setLong64(this._currentWriteBuffer!, value, this._currentWritePosition, this._littleEndian);
        this._finishWriteBuffer();
    }

    public flush(): Uint8Array[] {
        this._shrinkCapacity(this._length);

        const emittedChunks: Uint8Array[] = this._chunks;
        this._chunkId = 0;
        this._offsetChunkSize = 0;
        this._cursor = 0;
        this._length = 0;
        this._chunks = [];
        this._totalChunkSize = 0;
        return emittedChunks;
    }

    private _moveUpCursorPosition(value: number): void {
        this._cursor += value;
        this._length = Math.max(this._length, this._cursor);
    }

    private _adjustWritePosition(cursor: number): void {
        if (cursor >= this._offsetChunkSize) {
            while ((this._chunkId + 1 < this._chunks.length) && (cursor >= this._offsetChunkSize + this._chunks[this._chunkId].length)) {
                this._offsetChunkSize += this._chunks[this._chunkId].length;
                this._chunkId++;
            }
        } else {
            while ((this._chunkId > 0) && (cursor < this._offsetChunkSize)) {
                this._chunkId--;
                this._offsetChunkSize -= this._chunks[this._chunkId].length;
            }
        }
    }

    private _ensureWriteChunks(cursor: number, length: number): void {
        this._ensureCapacity(cursor + length);
        this._adjustWritePosition(cursor);

        this._currentWriteBuffer = this._chunks[this._chunkId];
        this._currentWritePosition.value = cursor - this._offsetChunkSize;
        this._currentSavedPosition = this._currentWritePosition.value;
    }

    private _finishWriteChunks(): void {
        const totalWriteAmount: number = this._currentWritePosition.value - this._currentSavedPosition;

        this._currentWriteBuffer = null;
        this._currentWritePosition.value = 0;
        this._currentSavedPosition = 0;

        this._moveUpCursorPosition(totalWriteAmount);
    }

    private _ensureWriteBuffer(cursor: number, length: number): void {
        this._ensureWriteChunks(cursor, length);

        if (this._currentWritePosition.value + length > this._currentWriteBuffer!.length) {
            this._currentWriteToCursor = cursor;
            this._currentWriteToSwapBuffer = true;
            this._currentWriteBuffer = BinaryWriter.createSwapBuffer(Math.max(8, length));
            this._currentWritePosition.value = 0;
            this._currentSavedPosition = 0;
        }
    }

    private _finishWriteBuffer(): void {
        if (this._currentWriteToSwapBuffer) {
            memseg(this._currentWriteBuffer!, this._chunks, this._currentSavedPosition, this._currentWritePosition.value, this._chunkId, this._chunks.length, this._currentWriteToCursor - this._offsetChunkSize);
            this._currentWriteToCursor = 0;
            this._currentWriteToSwapBuffer = false;
        }

        this._finishWriteChunks();
    }

    private _ensureCapacity(length: number): void {
        if (this._totalChunkSize < length) {
            const neededChunkSize: number = this._totalChunkSize + this._roundUpChunkSize(length);

            while (this._totalChunkSize < neededChunkSize) {
                const data: Uint8Array = createUint8Array(this._limitChunkSize(neededChunkSize - this._totalChunkSize));
                this._chunks.push(data);
                this._totalChunkSize += data.length;
            }
        }
    }

    private _shrinkCapacity(length: number): void {
        if (this._totalChunkSize > length) {
            for (let i: number = this._chunks.length - 1; i >= 0; --i) {
                const data: Uint8Array = this._chunks[i];
                this._totalChunkSize -= data.length;

                if (this._totalChunkSize <= length) {
                    this._chunks.splice(i);

                    if (this._totalChunkSize < length) {
                        this._chunks.push(memcut(data, length - this._totalChunkSize));
                        this._totalChunkSize = length;
                    }
                    break;
                }
            }
        }
    }

    private _roundUpChunkSize(value: number): number {
        return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
    }

    private _limitChunkSize(value: number): number {
        return Math.max(this._minChunkSize, Math.min(value, this._maxChunkSize));
    }
}

export default BinaryWriter;
