/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import UIMediaElement from "./UIMediaElement";
import UISelector from "./UISelector";

declare interface UIVideoElement {
    readonly domElement: HTMLVideoElement;
}

@UISelector("UIVideoElement")
class UIVideoElement extends UIMediaElement {
    private _playsinline: boolean = false;

    constructor(domElement: HTMLVideoElement = document.createElement("video")) {
        super(domElement);
    }

    public get width(): number {
        return this.domElement.width;
    }

    public set width(value: number) {
        this.domElement.width = value;
    }

    public get height(): number {
        return this.domElement.height;
    }

    public set height(value: number) {
        this.domElement.height = value;
    }

    public get videoWidth(): number {
        return this.domElement.videoWidth;
    }

    public get videoHeight(): number {
        return this.domElement.videoHeight;
    }

    public get poster(): string {
        return this.domElement.poster;
    }

    public set poster(value: string) {
        this.domElement.poster = value;
    }

    public get playsinline(): boolean {
        return this._playsinline;
    }

    public set playsinline(value: boolean) {
        this._playsinline = value;
        this.setAttributeValueBoolean("playsinline", this._playsinline);
        this.setAttributeValueBoolean("webkit-playsinline", this._playsinline);
    }
}

export default UIVideoElement;
