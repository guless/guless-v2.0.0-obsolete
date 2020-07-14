/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import HashAlgorithm from "./HashAlgorithm";

class SHA256 extends HashAlgorithm {
    public reset(): void {
        throw new Error("Method not implemented.");
    }
    
    public update(input: Uint8Array): void {
        throw new Error("Method not implemented.");
    }

    public final(): Uint8Array {
        throw new Error("Method not implemented.");
    }
}

export default SHA256;
