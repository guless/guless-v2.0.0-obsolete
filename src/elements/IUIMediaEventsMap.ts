/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import UIMediaEvent from "./UIMediaEvent";

interface IUIMediaEventsMap {
    [UIMediaEvent.ABORT]: UIMediaEvent;
    [UIMediaEvent.CAN_PLAY]: UIMediaEvent;
    [UIMediaEvent.CAN_PLAY_THROUGH]: UIMediaEvent;
    [UIMediaEvent.DURATION_CHANGE]: UIMediaEvent;
    [UIMediaEvent.EMPTIED]: UIMediaEvent;
    [UIMediaEvent.ENDED]: UIMediaEvent;
    [UIMediaEvent.ERROR]: UIMediaEvent;
    [UIMediaEvent.LOADED_DATA]: UIMediaEvent;
    [UIMediaEvent.LOADED_METADATA]: UIMediaEvent;
    [UIMediaEvent.LOAD_START]: UIMediaEvent;
    [UIMediaEvent.PAUSE]: UIMediaEvent;
    [UIMediaEvent.PLAY]: UIMediaEvent;
    [UIMediaEvent.PLAYING]: UIMediaEvent;
    [UIMediaEvent.PROGRESS]: UIMediaEvent;
    [UIMediaEvent.RATE_CHANGE]: UIMediaEvent;
    [UIMediaEvent.SEEKED]: UIMediaEvent;
    [UIMediaEvent.SEEKING]: UIMediaEvent;
    [UIMediaEvent.STALLED]: UIMediaEvent;
    [UIMediaEvent.SUSPEND]: UIMediaEvent;
    [UIMediaEvent.TIME_UPDATE]: UIMediaEvent;
    [UIMediaEvent.VOLUME_CHANGE]: UIMediaEvent;
    [UIMediaEvent.WAITING]: UIMediaEvent;
}

export default IUIMediaEventsMap;
