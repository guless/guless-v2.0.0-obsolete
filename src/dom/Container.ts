/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import assert from "../assert";
import internal from "../internal";
import Node from "./Node";

class Container extends Node {
    private _head: null | Node = null;
    private _tail: null | Node = null;

    public get head(): null | Node {
        return this._head;
    }

    public get tail(): null | Node {
        return this._tail;
    }

    public addChild(node: Node, before: null | Node = null): void {
        if (node.parent !== null) {
            node.parent.removeChild(node);
        }

        if (node.parent !== null) {
            return;
        }

        assert(before === null || before.parent === this, "The before to be referenced is not a child of this container.");
        this._childWillBeInserted(node);

        (node as internal)._parent = this;

        const prev: null | Node = before !== null ? before.prev : this._tail;
        const next: null | Node = before !== null ? before : null;

        if (prev !== null) { (prev as internal)._next = node; (node as internal)._prev = prev; }
        if (next !== null) { (next as internal)._prev = node; (node as internal)._next = next; }

        if (this._head === next) { this._head = node; }
        if (this._tail === prev) { this._tail = node; }

        this._updateSubtreeForInsertion(node);
    }

    public removeChild(node: Node): void {
        assert(node.parent === this, "The node to be removed is not a child of this container.");
        this._childWillBeRemoved(node);

        (node as internal)._parent = null;

        const prev: null | Node = node.prev;
        const next: null | Node = node.next;

        if (prev !== null) { (prev as internal)._next = next; (node as internal)._prev = null; }
        if (next !== null) { (next as internal)._prev = prev; (node as internal)._next = null; }

        if (this._head === node) { this._head = next; }
        if (this._tail === node) { this._tail = prev; }
        
        this._updateSubtreeForRemoval(node);
    }

    protected _childWillBeInserted(node: Node): void {
        /*< empty >*/
    }

    protected _childWillBeRemoved(node: Node): void {
        /*< empty >*/
    }

    protected _updateSubtreeForInsertion(node: Node): void {
        /*< empty >*/
    }

    protected _updateSubtreeForRemoval(node: Node): void {
        /*< empty >*/
    }
}

export default Container;
