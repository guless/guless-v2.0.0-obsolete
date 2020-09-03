/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import UIMediaComponent from "./UIMediaComponent";
import UISelector from "./UISelector";

@UISelector("UIAudioComponent")
class UIAudioComponent extends UIMediaComponent {
    public readonly domElement!: HTMLAudioElement;
    
    constructor(domElement: HTMLAudioElement = document.createElement("audio")) {
        super(domElement);
    }
}

export default UIAudioComponent;
