/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import EventDispatcher from "../events/EventDispatcher";
import Container from "./Container";

class Node extends EventDispatcher {
    private _parent: null | Container = null;
    private _next: null | Node = null;
    private _prev: null | Node = null;

    public get parent(): null | Container {
        return this._parent;
    }

    public get next(): null | Node {
        return this._next;
    }

    public get prev(): null | Node {
        return this._prev;
    }
}

export default Node;
