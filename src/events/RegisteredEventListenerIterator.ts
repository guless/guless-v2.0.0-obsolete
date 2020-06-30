/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import RegisteredEventListener from "./RegisteredEventListener";

class RegisteredEventListenerIterator {
    private _iteratorID: number;
    private _listener: null | RegisteredEventListener;

    constructor(iteratorID: number, listener: null | RegisteredEventListener) {
        this._iteratorID = iteratorID;
        this._listener = listener;
    }

    public remove(listener: RegisteredEventListener): void {
        if (this._listener === listener) {
            this._listener = this._listener.next;
        }
    }

    public next(): null | RegisteredEventListener {
        while (this._listener) {
            const willBeRemoved: RegisteredEventListener = this._listener;
            this.remove(willBeRemoved);

            if (willBeRemoved.iteratorID !== 0 && willBeRemoved.iteratorID <= this._iteratorID) {
                return willBeRemoved;
            }
        }

        return null;
    }
}

export default RegisteredEventListenerIterator;
