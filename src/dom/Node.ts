/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import assert from "../assert";
import internal from "../internal";
import EventDispatcher from "../events/EventDispatcher";
import Container from "./Container";
import Event from "../events/Event";
import EventPhase from "../events/EventPhase";

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
        const path: Node[] = this._calculateEventPath(event);

        (event as internal)._target = this;

        this._dispatchEventAtCapturing(event, path) && 
        this._dispatchEventAtTarget   (event, path) && 
        this._dispatchEventAtBubbling (event, path);

        (event as internal)._target = null;
        (event as internal)._currentTarget = null;
        (event as internal)._eventPhase = EventPhase.NONE;

        return !event.defaultPrevented;
    }

    private _calculateEventPath(event: Event): Node[] {
        const eventPath: Node[] = [];
        for (let current: null | Node = this; current !== null; current = current.parent) {
            eventPath.push(current);
        }
        return eventPath;
    }

    private _dispatchEventAtCapturing(event: Event, path: Node[]): boolean {
        for (let l: number = path.length - 1; l >= 1 && !event.propagationStopped; --l) {
            (event as internal)._eventPhase = EventPhase.CAPTURING_PHASE;
            (event as internal)._currentTarget = path[l];
            (path[l] as internal)._dispatchEventToListeners(event);
        }

        return !event.propagationStopped;
    }

    private _dispatchEventAtTarget(event: Event, path: Node[]): boolean {
        if (path.length > 0) {
            (event as internal)._eventPhase = EventPhase.AT_TARGET;
            (event as internal)._currentTarget = path[0];
            (path[0] as internal)._dispatchEventToListeners(event);
        }

        return !event.propagationStopped;
    }

    private _dispatchEventAtBubbling(event: Event, path: Node[]): boolean {
        if (!event.bubbles) {
            return !event.propagationStopped;
        }

        for (let i: number = 1; i < path.length && !event.propagationStopped; ++i) {
            (event as internal)._eventPhase = EventPhase.BUBBLING_PHASE;
            (event as internal)._currentTarget = path[i];
            (path[i] as internal)._dispatchEventToListeners(event);
        }

        return !event.propagationStopped;
    }
}

export default Node;
