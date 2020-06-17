/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0.1 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import assert from "../assert";
import internal from "../internal";
import RegisteredEventListener from "./RegisteredEventListener";
import RegisteredEventListenerQueue from "./RegisteredEventListenerQueue";
import Event from "./Event";
import EventPhase from "./EventPhase";
import IEventListener from "./IEventListener";
import IEventListenerOptions from "./IEventListenerOptions";
import IAddEventListenerOptions from "./IAddEventListenerOptions";

class EventDispatcher {
    private _registeredEventListenersMap: Record<string, RegisteredEventListenerQueue> = Object.create(null);

    public addEventListener(type: string, listener: IEventListener, options: boolean | IAddEventListenerOptions = false): void {
        this.removeEventListener(type, listener, options);

        if (!this._registeredEventListenersMap[type]) {
            this._registeredEventListenersMap[type] = new RegisteredEventListenerQueue();
        }

        return this._registeredEventListenersMap[type].addListener(new RegisteredEventListener(listener, options));
    }

    public removeEventListener(type: string, listener: IEventListener, options: boolean | IEventListenerOptions = false): void {
        if (!this._registeredEventListenersMap[type]) {
            return;
        }

        const useCapture: boolean = typeof options === "boolean" ? options : options.capture ?? false;
        const registeredListener: null | RegisteredEventListener = this._registeredEventListenersMap[type].getListener(listener, useCapture);

        if (!registeredListener) {
            return;
        }

        return this._registeredEventListenersMap[type].removeListener(registeredListener);
    }

    public hasEventListener(type: string): boolean {
        if (!this._registeredEventListenersMap[type]) {
            return false;
        }

        return this._registeredEventListenersMap[type].hasListener();
    }

    public dispatchEvent(event: Event): boolean {
        assert(event.eventPhase === EventPhase.NONE, "The event is already being dispatched.");

        (event as internal)._target = this;
        (event as internal)._currentTarget = this;
        (event as internal)._eventPhase = EventPhase.AT_TARGET;

        this._dispatchEventToListeners(event);

        (event as internal)._target = null;
        (event as internal)._currentTarget = null;
        (event as internal)._eventPhase = EventPhase.NONE;

        return !event.defaultPrevented;
    }

    private _dispatchEventToListeners(event: Event): void {
        if (!this._registeredEventListenersMap[event.type]) {
            return;
        }

        return this._registeredEventListenersMap[event.type].dispatchEventToListeners(event);
    }
}

export default EventDispatcher;
