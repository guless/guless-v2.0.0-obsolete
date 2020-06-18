/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0.1 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import assert from "../assert";
import internal from "../internal";
import Event from "../events/Event";
import EventPhase from "../events/EventPhase";
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

    public dispatchEvent(event: Event): boolean {
        assert(event.eventPhase === EventPhase.NONE, "The event is already being dispatched.");
        const ancestors: Container[] = [];

        for (let target: null | Container = this.parent; target !== null; target = target.parent) {
            ancestors.push(target);
        }

        (event as internal)._target = this;

        /// (1) CAPTURING_PHASE
        (event as internal)._eventPhase = EventPhase.CAPTURING_PHASE;

        for (let l: number = ancestors.length - 1; l >= 0 && !event.propagationStopped; --l) {
            (event as internal)._currentTarget = ancestors[l];
            (ancestors[l] as internal)._dispatchEventToListeners(event);
        }

        if (event.propagationStopped) {
            (event as internal)._target = null;
            (event as internal)._currentTarget = null;
            (event as internal)._eventPhase = EventPhase.NONE;
            return false;
        }

        /// (2) AT_TARGET
        (event as internal)._eventPhase = EventPhase.AT_TARGET;
        (event as internal)._currentTarget = this;
        (this as internal)._dispatchEventToListeners(event);

        if (event.propagationStopped || !event.bubbles) {
            (event as internal)._target = null;
            (event as internal)._currentTarget = null;
            (event as internal)._eventPhase = EventPhase.NONE;
            return !event.defaultPrevented;
        }

        /// (3) BUBBLING_PHASE
        (event as internal)._eventPhase = EventPhase.BUBBLING_PHASE;

        for (let i: number = 0; i < ancestors.length && !event.propagationStopped; ++i) {
            (event as internal)._currentTarget = ancestors[i];
            (ancestors[i] as internal)._dispatchEventToListeners(event);
        }

        (event as internal)._target = null;
        (event as internal)._currentTarget = null;
        (event as internal)._eventPhase = EventPhase.NONE;

        return !event.defaultPrevented;
    }
}

export default Node;
