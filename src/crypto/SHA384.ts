/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import HashAlgorithm from "./HashAlgorithm";
import { u32, u8vec, u32vec } from "../buffer/types";

class SHA384 extends HashAlgorithm {
    public reset(): void {
        throw new Error("Method not implemented.");
    }
    
    public update(input: u8vec): void {
        throw new Error("Method not implemented.");
    }

    public final(): u8vec {
        throw new Error("Method not implemented.");
    }
}

export default SHA384;
