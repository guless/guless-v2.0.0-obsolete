/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function UISelector(name: string): ClassDecorator {
    return (target: Function) => {
        Object.defineProperty(target.prototype, "__CSS_SELECTOR__", { value: name, enumerable: false, writable: false, configurable: false });
    };
}

export default UISelector;
