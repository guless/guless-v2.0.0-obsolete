/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import assert from "../assert";
import EventDispatcher from "../events/EventDispatcher";
import IAddEventListenerOptions from "../events/IAddEventListenerOptions";
import IEventListener from "../events/IEventListener";
import IEventListenerOptions from "../events/IEventListenerOptions";
import cancelAnimationFrame from "./cancelAnimationFrame";
import ITickerEventsMap from "./ITickerEventsMap";
import requestAnimationFrame from "./requestAnimationFrame";
import TickerEvent from "./TickerEvent";

declare interface Ticker {
    addEventListener<K extends keyof ITickerEventsMap>(type: K, listener: (this: Ticker, event: ITickerEventsMap[K]) => void, options?: boolean | IAddEventListenerOptions): void;
    addEventListener(type: string, listener: IEventListener, options?: boolean | IAddEventListenerOptions): void;
    removeEventListener<K extends keyof ITickerEventsMap>(type: K, listener: (this: Ticker, event: ITickerEventsMap[K]) => void, options?: boolean | IEventListenerOptions): void;
    removeEventListener(type: string, listener: IEventListener, options?: boolean | IEventListenerOptions): void;
}

class Ticker extends EventDispatcher {
    private static __TIME_ORIGIN__: null | number = null;

    private _paused: boolean = true;
    private _requestId: number = 0;

    constructor() {
        super();
        this._dispatchEventUpdate = this._dispatchEventUpdate.bind(this);
    }

    public get paused(): boolean {
        return this._paused;
    }

    public start(): void {
        assert(this._paused === true, "Invalid status.");
        this._paused = false;
        this._requestId = requestAnimationFrame(this._dispatchEventUpdate);
    }

    public pause(): void {
        assert(this._paused === false, "Invalid status.");
        this._paused = true;
        cancelAnimationFrame(this._requestId);
    }

    private _dispatchEventUpdate(time: number): void {
        if (Ticker.__TIME_ORIGIN__ === null) {
            Ticker.__TIME_ORIGIN__ = time;
        }
        time = time - Ticker.__TIME_ORIGIN__;
        this.dispatchEvent(new TickerEvent(TickerEvent.UPDATE, time, false, true));
        if (!this._paused) {
            this._requestId = requestAnimationFrame(this._dispatchEventUpdate);
        }
    }
}

export default Ticker;
