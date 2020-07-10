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

    protected _updateTreeAfterInsertion(node: UIComponent): void {
        super._updateTreeAfterInsertion(node);
        this._element.insertBefore(node._element, node.next === null ? null : (node.next as UIComponent)._element);
    }

    protected _updateTreeAfterRemoval(node: UIComponent): void {
        super._updateTreeAfterRemoval(node);
        this._element.removeChild(node._element);
    }
}

export default UIComponent;
