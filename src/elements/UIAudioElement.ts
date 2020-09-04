/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import UIMediaElement from "./UIMediaElement";
import UISelector from "./UISelector";

@UISelector("UIAudioElement")
class UIAudioElement extends UIMediaElement {
    public readonly domElement!: HTMLAudioElement;
    
    constructor(domElement: HTMLAudioElement = document.createElement("audio")) {
        super(domElement);
    }
}

export default UIAudioElement;
