/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import RegisteredEventListener from "./RegisteredEventListener";

class RegisteredEventListenerIterator {
    private _version: number = 0;
    private _reference: null | RegisteredEventListener;

    constructor(listener: null | RegisteredEventListener) {
        this._reference = listener;
    }

    public remove(listener: RegisteredEventListener): void {
        if (this._reference === listener) {
            this._reference = this._reference.next;
        }
    }

    public next(): null | RegisteredEventListener {
        while (this._reference !== null) {
            const candidate: RegisteredEventListener = this._reference;
            this.remove(candidate);

            if ((candidate as internal)._version <= this._version) {
                return candidate;
            }
        }

        return null;
    }
}

export default RegisteredEventListenerIterator;
