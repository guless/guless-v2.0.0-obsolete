/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import BinaryWriter from "@/buffer/BinaryWriter";
import memmrg from "@/buffer/memmrg";

test("writer", () => {
    const writer: BinaryWriter = new BinaryWriter();

    writer.writeBoolean(true);
    writer.writeFloat32(0.1);
    writer.writeFloat64(0.1);
    writer.writeUint32(0x12345678);
    writer.writeBytes(new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F]));

    expect(writer.cursor).toBe(33);
    expect(writer.length).toBe(33);

    const totalWriteAmount: number = writer.length;
    const emittedBuffer: Uint8Array = new Uint8Array(totalWriteAmount);

    memmrg(writer.flush(), emittedBuffer);
    expect(emittedBuffer).toEqual(new Uint8Array([1, 205, 204, 204, 61, 154, 153, 153, 153, 153, 153, 185, 63, 120, 86, 52, 18, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));
});
