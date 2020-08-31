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

    public static attributeValueToNumber(value: null | string): number {
        return (value === null ? NaN : parseFloat(value));
    }

    public static numberToAttributeValue(value: number): null | string {
        return (isNaN(value) ? null : "" + value);
    }
}

export default UIAttributeValueConversion;
