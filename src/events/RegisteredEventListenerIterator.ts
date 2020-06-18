/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0.1 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import RegisteredEventListener from "./RegisteredEventListener";

class RegisteredEventListenerIterator {
    private static __ITERATE_ID__: number = 0;
    private static __ACTIVED_ITERATORS__: RegisteredEventListenerIterator[] = [];

    public static nodeWillBeInserted(listener: RegisteredEventListener): void {
        RegisteredEventListenerIterator.setIterateID(listener, ++RegisteredEventListenerIterator.__ITERATE_ID__);
    }

    public static nodeWillBeRemoved(listener: RegisteredEventListener): void {
        for (const iterator of RegisteredEventListenerIterator.__ACTIVED_ITERATORS__) {
            iterator.remove(listener);
        }

        RegisteredEventListenerIterator.setIterateID(listener, 0);
    }

    private static getIterateID(listener: RegisteredEventListener): number {
        return (listener as internal)["__ITERATE_ID__"] || 0;
    }

    private static setIterateID(listener: RegisteredEventListener, value: number): void {
        (listener as internal)["__ITERATE_ID__"] = value;
    }

    private static init(iterator: RegisteredEventListenerIterator): void {
        RegisteredEventListenerIterator.__ACTIVED_ITERATORS__.push(iterator);
    }

    private static dispose(iterator: RegisteredEventListenerIterator): void {
        const lastIndex: number = RegisteredEventListenerIterator.__ACTIVED_ITERATORS__.lastIndexOf(iterator);

        if (lastIndex >= 0) {
            RegisteredEventListenerIterator.__ACTIVED_ITERATORS__.splice(lastIndex, 1);
        }
    }

    private _listener: null | RegisteredEventListener;
    private _iterateID: number = 0;

    constructor(listener: null | RegisteredEventListener) {
        this._listener = listener;
        this._iterateID = RegisteredEventListenerIterator.__ITERATE_ID__;
    }

    public next(): null | RegisteredEventListener {
        while (this._listener) {
            const willBeRemoved: RegisteredEventListener = this._listener;
            this.remove(willBeRemoved);

            if (RegisteredEventListenerIterator.getIterateID(willBeRemoved) !== 0 && RegisteredEventListenerIterator.getIterateID(willBeRemoved) <= this._iterateID) {
                return willBeRemoved;
            }
        }

        return null;
    }

    public remove(listener: RegisteredEventListener): void {
        if (this._listener === listener) {
            this._listener = this._listener.next;
        }
    }

    public init(): void {
        RegisteredEventListenerIterator.init(this);
    }

    public dispose(): void {
        RegisteredEventListenerIterator.dispose(this);
    }
}

export default RegisteredEventListenerIterator;
