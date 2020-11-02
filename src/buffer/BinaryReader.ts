/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import assert from "../assert";
import Reference from "../platform/Reference";
import createSharedUint8Array from "./createSharedUint8Array";
import getBoolean from "./getBoolean";
import getFloat32 from "./getFloat32";
import getFloat64 from "./getFloat64";
import getInt16 from "./getInt16";
import getInt32 from "./getInt32";
import getInt8 from "./getInt8";
import getLong64 from "./getLong64";
import getUint16 from "./getUint16";
import getUint32 from "./getUint32";
import getUint8 from "./getUint8";
import Long64 from "./Long64";
import memmrg from "./memmrg";

class BinaryReader {
    private _chunks: Uint8Array[] = [];
    private _totalChunkSize: number = 0;
    private _littleEndian: boolean;
    private _chunkId: number = 0;
    private _offsetChunkSize: number = 0;
    private _cursor: number = 0;
    private _length: number = 0;
    private _currentReadBuffer: null | Uint8Array = null;
    private _currentReadPosition: Reference<number> = new Reference<number>(0);
    private _currentSavedPosition: number = 0;

    constructor(chunks?: Uint8Array[], littleEndian: boolean = true) {
        this._littleEndian = littleEndian;
        if (chunks !== void 0) {
            for (const data of chunks) { this.append(data); }
        }
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

    public get littleEndian(): boolean {
        return this._littleEndian;
    }

    public set littleEndian(value: boolean) {
        this._littleEndian = value;
    }

    public readBytes(target: Uint8Array, start: number = 0, end: number = target.length): typeof target {
        const length: number = end - start;
        this._ensureReadChunks(this._cursor, end - start);
        memmrg(this._chunks, target, this._chunkId, this._chunks.length, this._cursor - this._offsetChunkSize, start, end);
        this._currentReadPosition.value += length;
        this._finishReadChunks();
        return target;
    }

    public readBoolean(): boolean {
        this._ensureReadBuffer(this._cursor, 1);
        const output: boolean = getBoolean(this._currentReadBuffer!, this._currentReadPosition);
        this._finishReadBuffer();
        return output;
    }

    public readInt8(): number {
        this._ensureReadBuffer(this._cursor, 1);
        const output: number = getInt8(this._currentReadBuffer!, this._currentReadPosition);
        this._finishReadBuffer();
        return output;
    }

    public readInt16(): number {
        this._ensureReadBuffer(this._cursor, 2);
        const output: number = getInt16(this._currentReadBuffer!, this._currentReadPosition, this._littleEndian);
        this._finishReadBuffer();
        return output;
    }

    public readInt32(): number {
        this._ensureReadBuffer(this._cursor, 4);
        const output: number = getInt32(this._currentReadBuffer!, this._currentReadPosition, this._littleEndian);
        this._finishReadBuffer();
        return output;
    }

    public readUint8(): number {
        this._ensureReadBuffer(this._cursor, 1);
        const output: number = getUint8(this._currentReadBuffer!, this._currentReadPosition);
        this._finishReadBuffer();
        return output;
    }

    public readUint16(): number {
        this._ensureReadBuffer(this._cursor, 2);
        const output: number = getUint16(this._currentReadBuffer!, this._currentReadPosition, this._littleEndian);
        this._finishReadBuffer();
        return output;
    }

    public readUint32(): number {
        this._ensureReadBuffer(this._cursor, 4);
        const output: number = getUint32(this._currentReadBuffer!, this._currentReadPosition, this._littleEndian);
        this._finishReadBuffer();
        return output;
    }

    public readFloat32(): number {
        this._ensureReadBuffer(this._cursor, 4);
        const output: number = getFloat32(this._currentReadBuffer!, this._currentReadPosition, this._littleEndian);
        this._finishReadBuffer();
        return output;
    }

    public readFloat64(): number {
        this._ensureReadBuffer(this._cursor, 8);
        const output: number = getFloat64(this._currentReadBuffer!, this._currentReadPosition, this._littleEndian);
        this._finishReadBuffer();
        return output;
    }

    public readLong64(target: Long64 = new Long64(0, 0)): Long64 {
        this._ensureReadBuffer(this._cursor, 8);
        const output: Long64 = getLong64(this._currentReadBuffer!, this._currentReadPosition, this._littleEndian, target);
        this._finishReadBuffer();
        return output;
    }

    public append(data: Uint8Array): void {
        this._chunks.push(data);
        this._length = this._totalChunkSize += data.length;
    }

    private _ensureReadBuffer(cursor: number, length: number): void {
        this._ensureReadChunks(cursor, length);

        if (this._currentReadPosition.value + length > this._currentReadBuffer!.length) {
            this._currentReadBuffer = createSharedUint8Array(Math.max(8, length));
            this._currentReadPosition.value = 0;
            this._currentSavedPosition = 0;

            memmrg(this._chunks, this._currentReadBuffer, this._chunkId, this._chunks.length, cursor - this._offsetChunkSize, 0, length);
        }
    }

    private _finishReadBuffer(): void {
        this._finishReadChunks();
    }

    private _ensureReadChunks(cursor: number, length: number): void {
        assert(cursor >= 0 && cursor + length <= this._length, "offset is out of bounds.");
        this._adjustReadPosition(cursor);

        this._currentReadBuffer = this._chunks[this._chunkId];
        this._currentReadPosition.value = cursor - this._offsetChunkSize;
        this._currentSavedPosition = this._currentReadPosition.value;
    }

    private _finishReadChunks(): void {
        const totalReadAmount: number = this._currentReadPosition.value - this._currentSavedPosition;

        this._currentReadBuffer = null;
        this._currentReadPosition.value = 0;
        this._currentSavedPosition = 0;

        this._moveUpCursorPosition(totalReadAmount);
    }

    private _adjustReadPosition(cursor: number): void {
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

    private _moveUpCursorPosition(value: number): void {
        this._cursor += value;
    }
}

export default BinaryReader;
