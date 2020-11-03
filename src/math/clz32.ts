/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { SUPPORTED_MATH_CLZ32 } from "../platform/capabilities/supported-math-clz32";

function createMathCLZ32(): typeof Math.clz32 {
    if (SUPPORTED_MATH_CLZ32) {
        return Math.clz32.bind(Math);
    }
    
    return function clz32(x: number): number {
        x = x >>> 0;
        if (x === 0) {
            return 32;
        }
        return 31 - ((Math.log(x) / Math.LN2) | 0); 
    };
}

export default createMathCLZ32();
