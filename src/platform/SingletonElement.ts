/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class SingletonElement {
    private static readonly __ELEMENT_MAP__: Record<string, HTMLElement> = Object.create(null);

    public static create<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
    public static create<K extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K): HTMLElementDeprecatedTagNameMap[K];
    public static create(tagName: string): HTMLElement;
    public static create(tagName: string): HTMLElement {
        if (!SingletonElement.contains(tagName)) {
            SingletonElement.register(tagName, document.createElement(tagName));
        }
        return SingletonElement.__ELEMENT_MAP__[tagName];
    }

    public static contains<K extends keyof HTMLElementTagNameMap>(tagName: K): boolean;
    public static contains<K extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K): boolean;
    public static contains(tagName: string): boolean;
    public static contains(tagName: string): boolean {
        return !!SingletonElement.__ELEMENT_MAP__[tagName];
    }

    public static register<K extends keyof HTMLElementTagNameMap>(tagName: K, element: HTMLElement): void;
    public static register<K extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K, element: HTMLElement): void;
    public static register(tagName: string, element: HTMLElement): void;
    public static register(tagName: string, element: HTMLElement): void {
        SingletonElement.__ELEMENT_MAP__[tagName] = element;
    }
}

export default SingletonElement;
