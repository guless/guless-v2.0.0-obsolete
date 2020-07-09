/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import assert from "../assert";
import internal from "../internal";
import RegisteredEventListener from "./RegisteredEventListener";
import RegisteredEventListenerIterator from "./RegisteredEventListenerIterator";

class RegisteredEventListenerManager {
    private _globalVersion: number = 0;
    private _activeIterators: RegisteredEventListenerIterator[] = [];

    public updateForInsertion(listener: RegisteredEventListener): void {
        (listener as internal)._version = ++this._globalVersion;
    }

    public updateForRemoval(listener: RegisteredEventListener): void {
        for (const iterator of this._activeIterators) {
            iterator.remove(listener);
        }

        (listener as internal)._version = 0;
    }

    public addIterator(iterator: RegisteredEventListenerIterator): void {
        (iterator as internal)._version = this._globalVersion;
        this._activeIterators.push(iterator);
    }

    public removeIterator(iterator: RegisteredEventListenerIterator): void {
        (iterator as internal)._version = 0;

        if (iterator === this._activeIterators[this._activeIterators.length - 1]) {
            this._activeIterators.pop();
        } else {
            const index: number = this._activeIterators.lastIndexOf(iterator);
            assert(index >= 0, "The iterator is not active or is controlled by another manager.");
            this._activeIterators.splice(index, 1);
        }
    }
}

export default RegisteredEventListenerManager;
