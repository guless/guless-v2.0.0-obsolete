/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const __SHARED_DOM_ELEMENT_MAP__: Record<string, HTMLElement> = Object.create(null);

function createSharedDOMElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
function createSharedDOMElement<K extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K): HTMLElementDeprecatedTagNameMap[K];
function createSharedDOMElement(tagName: string): HTMLElement {
    if (!__SHARED_DOM_ELEMENT_MAP__[tagName]) {
        __SHARED_DOM_ELEMENT_MAP__[tagName] = document.createElement(tagName);
    }
    return __SHARED_DOM_ELEMENT_MAP__[tagName];
}

export default createSharedDOMElement;
