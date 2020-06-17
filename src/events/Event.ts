/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0.1 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import EventDispatcher from "./EventDispatcher";
import EventPhase from "./EventPhase";

class Event {
    private _type: string;
    private _bubbles: boolean;
    private _cancelable: boolean;
    private _target: null | EventDispatcher = null;
    private _currentTarget: null | EventDispatcher = null;
    private _eventPhase: EventPhase = EventPhase.NONE;
    private _defaultPrevented: boolean = false;
    private _propagationStopped: boolean = false;
    private _immediatePropagationStopped: boolean = false;

    constructor(type: string, bubbles: boolean = false, cancelable: boolean = true) {
        this._type = type;
        this._bubbles = bubbles;
        this._cancelable = cancelable;
    }

    public get type(): string {
        return this._type;
    }

    public get bubbles(): boolean {
        return this._bubbles;
    }

    public get cancelable(): boolean {
        return this._cancelable;
    }

    public get target(): null | EventDispatcher {
        return this._target;
    }

    public get currentTarget(): null | EventDispatcher {
        return this._currentTarget;
    }

    public get eventPhase(): EventPhase {
        return this._eventPhase;
    }

    public get defaultPrevented(): boolean {
        return this._defaultPrevented;
    }

    public get propagationStopped(): boolean {
        return this._propagationStopped;
    }

    public get immediatePropagationStopped(): boolean {
        return this._immediatePropagationStopped;
    }

    public preventDefault(): void {
        this._defaultPrevented = this._cancelable;
    }

    public stopPropagation(): void {
        this._propagationStopped = true;
    }

    public stopImmediatePropagation(): void {
        this._propagationStopped = this._immediatePropagationStopped = true;
    }
}

export default Event;
