/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Event from "./Event";
import IEventListener from "./IEventListener";

class RegisteredEventListener {
    private _version: number = 0;
    private _next: null | RegisteredEventListener = null;
    private _prev: null | RegisteredEventListener = null;
    private _listener: IEventListener;
    private _capture: boolean = false;
    private _context: any;
    private _once: boolean = false;
    private _priority: number = 0;

    constructor(listener: IEventListener, capture: boolean = false, context: any = void 0, once: boolean = false, priority: number = 0) {
        this._listener = listener;
        this._capture  = capture;
        this._context  = context;
        this._once     = once;
        this._priority = priority;
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
            return this._listener.call(this._context !== void 0 ? this._context : event.currentTarget, event);
        }

        return this._listener.handleEvent(event);
    }
}

export default RegisteredEventListener;
