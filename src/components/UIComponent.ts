/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Container from "../dom/Container";
import UIAttributeValueConversion from "./UIAttributeValueConversion";

class UIComponent extends Container {
    private _domElement: HTMLElement;
    private _cssSelector: string;

    constructor(domElement: HTMLElement = document.createElement("layer"), cssSelector: string = "UIComponent") {
        super();
        this._domElement = domElement;
        this._cssSelector = cssSelector;

        this.classList.add(this._cssSelector);
    }

    public get domElement(): HTMLElement {
        return this._domElement;
    }

    public get cssSelector(): string {
        return this._cssSelector;
    }

    public get style(): CSSStyleDeclaration {
        return this._domElement.style
    }

    public get classList(): DOMTokenList {
        return this._domElement.classList;
    }

    public getAttribute(qualifiedName: string): null | string {
        return this._domElement.getAttribute(qualifiedName);
    }

    public setAttribute(qualifiedName: string, value: null | string): void {
        return value === null ? this._domElement.removeAttribute(qualifiedName) : this._domElement.setAttribute(qualifiedName, value);
    }

    public hasAttribute(qualifiedName: string): boolean {
        return this._domElement.hasAttribute(qualifiedName);
    }

    public removeAttribute(qualifiedName: string): void {
        return this._domElement.removeAttribute(qualifiedName);
    }

    public getAttributeValueBoolean(qualifiedName: string): boolean {
        return UIAttributeValueConversion.attributeValueToBoolean(this.getAttribute(qualifiedName));
    }

    public setAttributeValueBoolean(qualifiedName: string, value: boolean): void {
        return this.setAttribute(qualifiedName, UIAttributeValueConversion.booleanToAttributeValue(value));
    }

    public getAttributeValueNumber(qualifiedName: string): number {
        return UIAttributeValueConversion.attributeValueToNumber(this.getAttribute(qualifiedName));
    }

    public setAttributeValueNumber(qualifiedName: string, value: number): void {
        return this.setAttribute(qualifiedName, UIAttributeValueConversion.numberToAttributeValue(value));
    }

    public destroy(): void {
        this.classList.remove(this._cssSelector);
    }

    protected _updateSubtreeForInsertion(node: UIComponent): void {
        super._updateSubtreeForInsertion(node);
        this._domElement.insertBefore(node._domElement, node.next === null ? null : (node.next as UIComponent)._domElement);
    }

    protected _updateSubtreeForRemoval(node: UIComponent): void {
        super._updateSubtreeForRemoval(node);
        this._domElement.removeChild(node._domElement);
    }
}

export default UIComponent;
