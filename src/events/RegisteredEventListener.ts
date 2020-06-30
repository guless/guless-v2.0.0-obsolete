/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Event from "./Event";
import IEventListener from "./IEventListener";
import IAddEventListenerOptions from "./IAddEventListenerOptions";

class RegisteredEventListener {
    private _iteratorID: number = 0;
    private _next: null | RegisteredEventListener = null;
    private _prev: null | RegisteredEventListener = null;
    private _listener: IEventListener;
    private _capture: boolean;
    private _context: any;
    private _once: boolean;
    private _priority: number;

    constructor(listener: IEventListener, options: boolean | IAddEventListenerOptions) {
        this._listener = listener;
        if (typeof options === "boolean") {
            this._capture = options;
            this._context = null;
            this._once = false;
            this._priority = 0;
        } else {
            this._capture = options.capture ?? false;
            this._context = options.context ?? null;
            this._once = options.once ?? false;
            this._priority = options.priority ?? 0;
        }
    }

    public get iteratorID(): number {
        return this._iteratorID;
    }

    public get next(): null | RegisteredEventListener {
        return this._next;
    }

    public get prev(): null | RegisteredEventListener {
        return this._prev;
    }

    public get listener(): IEventListener {
        return this._listener;
    }

    public get capture(): boolean {
        return this._capture;
    }

    public get context(): any {
        return this._context;
    }

    public get once(): boolean {
        return this._once;
    }

    public get priority(): number {
        return this._priority;
    }

    public handleEvent(event: Event): void {
        if (typeof this._listener === "function") {
            return this._listener.call(this._context ?? event.currentTarget, event);
        }

        return this._listener.handleEvent(event);
    }
}

export default RegisteredEventListener;
