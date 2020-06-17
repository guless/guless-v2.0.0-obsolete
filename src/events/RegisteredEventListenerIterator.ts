/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0.1 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import RegisteredEventListener from "./RegisteredEventListener";

class RegisteredEventListenerIterator {
    private _head: null | RegisteredEventListener;
    private _tail: null | RegisteredEventListener;

    constructor(head: null | RegisteredEventListener, tail: null | RegisteredEventListener) {
        this._head = head;
        this._tail = tail;
    }

    public get next(): null | RegisteredEventListener {
        if (this._head !== null) {
            const willBeRemoved: RegisteredEventListener = this._head;
            this.remove(willBeRemoved);
            return willBeRemoved;
        }

        return this._head;
    }

    public get prev(): null | RegisteredEventListener {
        if (this._tail !== null) {
            const willBeRemoved: RegisteredEventListener = this._tail;
            this.remove(willBeRemoved);
            return willBeRemoved;
        }

        return this._tail;
    }

    public remove(node: RegisteredEventListener): void {
        const head: null | RegisteredEventListener = this._head;
        const tail: null | RegisteredEventListener = this._tail;

        if (head === node) { this._head = tail === node ? null : node.next; }
        if (tail === node) { this._tail = head === node ? null : node.prev; }
    }
}

export default RegisteredEventListenerIterator;
