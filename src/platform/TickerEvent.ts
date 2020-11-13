/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import ITickerEventsMap from "./ITickerEventsMap";
import Event from "../events/Event";

class TickerEvent extends Event {
    public static readonly UPDATE = "update";
    private _time: number;

    constructor(type: keyof ITickerEventsMap, time?: number, bubbles?: boolean, cancelable?: boolean);
    constructor(type: string, time?: number, bubbles?: boolean, cancelable?: boolean);
    constructor(type: string, time: number = 0, bubbles: boolean = false, cancelable: boolean = true) {
        super(type, bubbles, cancelable);
        this._time = time;
    }

    public get time(): number {
        return this._time;
    }
}

export default TickerEvent;
