/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { u8vec } from "../buffer/ctypes";

abstract class HashAlgorithm<T extends number | u8vec = u8vec> {
    public abstract reset(): void;
    public abstract update(source: u8vec, sourceStart?: number, sourceEnd?: number): void;
    public abstract final(): T;
}

export default HashAlgorithm;
