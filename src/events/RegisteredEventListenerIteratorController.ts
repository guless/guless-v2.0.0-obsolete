/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import internal from "../internal";
import RegisteredEventListener from "./RegisteredEventListener";
import RegisteredEventListenerIterator from "./RegisteredEventListenerIterator";

class RegisteredEventListenerIteratorController {
    private _iteratorID: number = 0;
    private _activedIterators: RegisteredEventListenerIterator[] = [];

    public addListener(listener: RegisteredEventListener): void {
        (listener as internal)._iteratorID = ++this._iteratorID;
    }

    public removeListener(listener: RegisteredEventListener): void {
        for (const iterator of this._activedIterators) {
            iterator.remove(listener);
        }

        (listener as internal)._iteratorID = 0;
    }

    public addIterator(iterator: RegisteredEventListenerIterator): void {
        (iterator as internal)._iteratorID = this._iteratorID;
        this._activedIterators.push(iterator);
    }

    public removeIterator(iterator: RegisteredEventListenerIterator): void {
        const index: number = this._activedIterators.lastIndexOf(iterator);

        if (index >= 0) {
            this._activedIterators.splice(index, 1);
        }

        (iterator as internal)._iteratorID = 0;
    }

    public moveToNext(iterator: RegisteredEventListenerIterator): null | RegisteredEventListener {
        for (let current: null | RegisteredEventListener = iterator.next(); current !== null; current = iterator.next()) {
            if ((current as internal)._iteratorID <= (iterator as internal)._iteratorID) {
                return current;
            }
        }

        return null;
    }
}

export default RegisteredEventListenerIteratorController;
