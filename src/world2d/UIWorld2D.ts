/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import UICanvasElement from "../elements/UICanvasElement";
import UISelector from "../elements/UISelector";

@UISelector("UIWorld2D")
class UIWorld2D extends UICanvasElement {
    constructor(domElement: HTMLCanvasElement = document.createElement("canvas")) {
        super(domElement);
    }
}

export default UIWorld2D;
