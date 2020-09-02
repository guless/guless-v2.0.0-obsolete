/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import IMediaErrorEventsMap from "./IMediaErrorEventsMap";
import MediaEvent from "./MediaEvent";

class MediaErrorEvent extends MediaEvent {
    public static readonly ERROR = "error";
    private _error: MediaError;

    constructor(type: keyof IMediaErrorEventsMap, error: MediaError, bubbles?: boolean, cancelable?: boolean);
    constructor(type: string, error: MediaError, bubbles?: boolean, cancelable?: boolean);
    constructor(type: string, error: MediaError, bubbles: boolean = false, cancelable: boolean = true) {
        super(type, bubbles, cancelable);
        this._error = error;
    }

    public get error(): MediaError {
        return this._error;
    }
}

export default MediaErrorEvent;
