/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import RegisteredEventListener from "./RegisteredEventListener";

class RegisteredEventListenerIterator {
    private _iteratorID: number = 0;
    private _listener: null | RegisteredEventListener;

    constructor(listener: null | RegisteredEventListener) {
        this._listener = listener;
    }

    public remove(listener: RegisteredEventListener): void {
        if (this._listener === listener) {
            this._listener = this._listener.next;
        }
    }

    public next(): null | RegisteredEventListener {
        if (this._listener !== null) {
            const willBeRemoved: RegisteredEventListener = this._listener;
            this.remove(willBeRemoved);
            return willBeRemoved;
        }

        return null;
    }
}

export default RegisteredEventListenerIterator;
