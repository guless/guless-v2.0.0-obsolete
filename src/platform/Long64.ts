/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class Long64 {
    constructor(public l32: number = 0, public h32: number = 0) {}

    public set(l32: number = 0, h32: number = 0): void {
        this.l32 = l32;
        this.h32 = h32;
    }

    public add(l32: number = 0, h32: number = 0): void {
        this.l32 = (this.l32 + l32) >>> 0;
        this.h32 = (this.h32 + h32 + (this.l32 < l32 ? 1 : 0)) >>> 0;
    }
}

export default Long64;
