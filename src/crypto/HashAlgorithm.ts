/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
abstract class HashAlgorithm<T extends number | Uint8Array = Uint8Array> {
    public abstract reset(): void;
    public abstract update(source: Uint8Array, sourceStart?: number, sourceEnd?: number): void;
    public abstract final(): T;
}

export default HashAlgorithm;
