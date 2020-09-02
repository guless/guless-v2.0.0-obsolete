/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import UIMediaComponent from "./UIMediaComponent";

class UIAudioComponent extends UIMediaComponent {
    public readonly domElement!: HTMLAudioElement;
    
    constructor(domElement: HTMLAudioElement = document.createElement("audio"), cssSelector: string = "UIAudioComponent") {
        super(domElement, cssSelector);
    }
}

export default UIAudioComponent;
