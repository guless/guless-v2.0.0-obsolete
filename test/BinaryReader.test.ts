/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import BinaryReader from "@/buffer/BinaryReader";
import fround from "@/math/fround";

test("binary reader", () => {
    const reader: BinaryReader = new BinaryReader([new Uint8Array([1, 205, 204, 204, 61, 154, 153, 153, 153, 153, 153, 185, 63, 120, 86, 52, 18, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])]);

    expect(reader.length).toBe(33);

    expect(reader.readBoolean()).toBe(true);
    expect(reader.readFloat32()).toBe(fround(0.1));
    expect(reader.readFloat64()).toBe(0.1);
    expect(reader.readUint32()).toBe(0x12345678);

    const bytes: Uint8Array = new Uint8Array(16);
    expect(reader.readBytes(bytes)).toEqual(new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F]));
});

test("read varint", () => {
    const reader: BinaryReader = new BinaryReader([
        new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF]),
        new Uint8Array([0x0F]),
        new Uint8Array([0xFF, 0xFF, 0xFF]),
        new Uint8Array([0xFF, 0x0F]),
        new Uint8Array([0xFF, 0xFF]),
        new Uint8Array([0xFF, 0xFF, 0x0F]),
        new Uint8Array([0xFF]),
        new Uint8Array([0xFF, 0xFF, 0xFF, 0x0F]),
        new Uint8Array([0xFF]),
        new Uint8Array([0xFF]),
        new Uint8Array([0xFF]),
        new Uint8Array([0xFF]),
        new Uint8Array([0x0F]),
    ]);

    expect(reader.readVarint32()).toBe(0xFFFFFFFF);
    expect(reader.readVarint32()).toBe(0xFFFFFFFF);
    expect(reader.readVarint32()).toBe(0xFFFFFFFF);
    expect(reader.readVarint32()).toBe(0xFFFFFFFF);
    expect(reader.readVarint32()).toBe(0xFFFFFFFF);
});
