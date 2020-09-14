/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import UIElement from "./UIElement";
import UISelector from "./UISelector";
import UIElementCrossOriginAttributeValue from "./UIElementCrossOriginAttributeValue";
import createObjectURL from "../platform/createObjectURL";
import revokeObjectURL from "../platform/revokeObjectURL";

@UISelector("UIImageElement")
class UIImageElement extends UIElement {
    public readonly domElement!: HTMLImageElement;

    private _srcObject: null | string | Blob = null;
    private _srcObjectURL: null | string = null;

    constructor(domElement: HTMLImageElement = document.createElement("img")) {
        super(domElement);
    }

    public get src(): null | string | Blob {
        return this._srcObject;
    }

    public set src(value: null | string | Blob) {
        if (this._srcObjectURL !== null) {
            revokeObjectURL(this._srcObjectURL);
            this._srcObjectURL = null;
        }

        this._srcObject = value;

        if (typeof value === "string") {
            this.domElement.src = value;
        } else if (value === null) {
            this.setAttribute("src", null);
        } else {
            this._srcObjectURL = createObjectURL(value);
            this.domElement.src = this._srcObjectURL;
        }
    }

    public get alt(): string {
        return this.domElement.alt;
    }

    public set alt(value: string) {
        this.domElement.alt = value;
    }

    public get crossOrigin(): null | UIElementCrossOriginAttributeValue {
        return this.domElement.crossOrigin as null | UIElementCrossOriginAttributeValue;;
    }

    public set crossOrigin(value: null | UIElementCrossOriginAttributeValue) {
        this.domElement.crossOrigin = value;
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

    public get naturalWidth(): number {
        return this.domElement.naturalWidth;
    }

    public get naturalHeight(): number {
        return this.domElement.naturalHeight;
    }
}

export default UIImageElement;
