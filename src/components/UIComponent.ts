/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Container from "../dom/Container";
import UIAttributeValueConversion from "./UIAttributeValueConversion";

class UIComponent extends Container {
    private _element: HTMLElement;

    constructor(element: HTMLElement = document.createElement("layer")) {
        super();
        this._element = element;
    }

    public get element(): HTMLElement {
        return this._element;
    }

    public getAttribute(qualifiedName: string): null | string {
        return this._element.getAttribute(qualifiedName);
    }

    public setAttribute(qualifiedName: string, value: null | string): void {
        return value === null ? this._element.removeAttribute(qualifiedName) : this._element.setAttribute(qualifiedName, value);
    }

    public hasAttribute(qualifiedName: string): boolean {
        return this._element.hasAttribute(qualifiedName);
    }

    public getAttributeValueBoolean(qualifiedName: string): boolean {
        return UIAttributeValueConversion.attributeValueToBoolean(this.getAttribute(qualifiedName));
    }

    public setAttributeValueBoolean(qualifiedName: string, value: boolean): void {
        return this.setAttribute(qualifiedName, UIAttributeValueConversion.booleanToAttributeValue(value));
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
