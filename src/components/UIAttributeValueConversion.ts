/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class UIAttributeValueConversion {
    public static attributeValueToBoolean(value: null | string): boolean {
        return (value !== null);
    }

    public static booleanToAttributeValue(value: boolean): null | string {
        return (value === true ? "" : null); 
    }
}

export default UIAttributeValueConversion;
