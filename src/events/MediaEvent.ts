/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import IMediaEventsMap from "./IMediaEventsMap";
import Event from "./Event";

class MediaEvent extends Event {
    public static readonly ABORT = "abort";
    public static readonly CAN_PLAY = "canplay";
    public static readonly CAN_PLAY_THROUGH = "canplaythrough";
    public static readonly DURATION_CHANGE = "durationchange";
    public static readonly EMPTIED = "emptied";
    public static readonly ENDED = "ended";
    public static readonly ERROR = "error";
    public static readonly LOADED_DATA = "loadeddata";
    public static readonly LOADED_METADATA = "loadedmetadata";
    public static readonly LOAD_START = "loadstart";
    public static readonly PAUSE = "pause";
    public static readonly PLAY = "play";
    public static readonly PLAYING = "playing";
    public static readonly PROGRESS = "progress";
    public static readonly RATE_CHANGE = "ratechange";
    public static readonly SEEKED = "seeked";
    public static readonly SEEKING = "seeking";
    public static readonly STALLED = "stalled";
    public static readonly SUSPEND = "suspend";
    public static readonly TIME_UPDATE = "timeupdate";
    public static readonly VOLUME_CHANGE = "volumechange";
    public static readonly WAITING = "waiting";

    constructor(type: keyof IMediaEventsMap, bubbles?: boolean, cancelable?: boolean);
    constructor(type: string, bubbles?: boolean, cancelable?: boolean);
    constructor(type: string, bubbles: boolean = false, cancelable: boolean = true) {
        super(type, bubbles, cancelable);
    }
}

export default MediaEvent;
