/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Container from "../dom/Container";

class UIComponent extends Container {
    private _element: HTMLElement;

    constructor(element: HTMLElement = document.createElement("layer")) {
        super();
        this._element = element;
    }

    public get element(): HTMLElement {
        return this._element;
    }

    protected _childHasBeenInserted(node: UIComponent): void {
        this._element.insertBefore(node._element, (node.next as UIComponent)?._element);
        super._childHasBeenInserted(node);
    }

    protected _childHasBeenRemoved(node: UIComponent): void {
        this._element.removeChild(node._element);
        super._childHasBeenRemoved(node);
    }
}

export default UIComponent;