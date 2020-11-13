/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import Container from "../dom/Container";
import UISelector from "./UISelector";
import UIAttributeValueConversion from "./UIAttributeValueConversion";

@UISelector("UIElement")
class UIElement extends Container {
    constructor(public readonly domElement: HTMLElement = document.createElement("layer")) {
        super();
        this.classList.add((this as internal).__CSS_SELECTOR__);
    }

    public get style(): CSSStyleDeclaration {
        return this.domElement.style
    }

    public get classList(): DOMTokenList {
        return this.domElement.classList;
    }

    public getAttribute(qualifiedName: string): null | string {
        return this.domElement.getAttribute(qualifiedName);
    }

    public setAttribute(qualifiedName: string, value: null | string): void {
        return value === null ? this.domElement.removeAttribute(qualifiedName) : this.domElement.setAttribute(qualifiedName, value);
    }

    public hasAttribute(qualifiedName: string): boolean {
        return this.domElement.hasAttribute(qualifiedName);
    }

    public removeAttribute(qualifiedName: string): void {
        return this.domElement.removeAttribute(qualifiedName);
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

    protected _updateSubtreeForInsertion(node: UIElement): void {
        super._updateSubtreeForInsertion(node);
        this.domElement.insertBefore(node.domElement, node.next === null ? null : (node.next as UIElement).domElement);
    }

    protected _updateSubtreeForRemoval(node: UIElement): void {
        super._updateSubtreeForRemoval(node);
        this.domElement.removeChild(node.domElement);
    }
}

export default UIElement;
