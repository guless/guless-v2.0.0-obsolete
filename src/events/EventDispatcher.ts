/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import IEventListener from "./IEventListener";
import IEventListenerOptions from "./IEventListenerOptions";
import IAddEventListenerOptions from "./IAddEventListenerOptions";
import assert from "../assert";
import internal from "../internal";
import RegisteredEventListener from "./RegisteredEventListener";
import RegisteredEventListenerQueue from "./RegisteredEventListenerQueue";
import Event from "./Event";
import EventPhase from "./EventPhase";

class EventDispatcher {
    private _registeredEventListenersMap: Record<string, RegisteredEventListenerQueue> = Object.create(null);

    public addEventListener(type: string, listener: IEventListener, options: boolean | IAddEventListenerOptions = false): void {
        this.removeEventListener(type, listener, options);

        if (!this._registeredEventListenersMap[type]) {
            this._registeredEventListenersMap[type] = new RegisteredEventListenerQueue();
        }

        let capture: boolean = false;
        let context: any = null;
        let once: boolean = false;
        let priority: number = 0;

        if (typeof options === "boolean") {
            capture = options;
        } else {
            if (options.capture  !== void 0) { capture  = options.capture;  }
            if (options.context  !== void 0) { context  = options.context;  }
            if (options.once     !== void 0) { once     = options.once;     }
            if (options.priority !== void 0) { priority = options.priority; }
        }

        return this._registeredEventListenersMap[type].addListener(new RegisteredEventListener(listener, capture, context, once, priority));
    }

    public removeEventListener(type: string, listener: IEventListener, options: boolean | IEventListenerOptions = false): void {
        if (!this._registeredEventListenersMap[type]) {
            return;
        }

        let capture: boolean = false;

        if (typeof options === "boolean") {
            capture = options;
        } else {
            if (options.capture !== void 0) { capture = options.capture; }
        }

        const registeredListener: null | RegisteredEventListener = this._registeredEventListenersMap[type].findListener((registeredListener: RegisteredEventListener) => registeredListener.listener === listener && registeredListener.capture === capture);

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
