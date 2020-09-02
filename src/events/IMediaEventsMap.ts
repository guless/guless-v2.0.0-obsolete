/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import MediaEvent from "./MediaEvent";

interface IMediaEventsMap {
    [MediaEvent.ABORT]: MediaEvent;
    [MediaEvent.CAN_PLAY]: MediaEvent;
    [MediaEvent.CAN_PLAY_THROUGH]: MediaEvent;
    [MediaEvent.DURATION_CHANGE]: MediaEvent;
    [MediaEvent.EMPTIED]: MediaEvent;
    [MediaEvent.ENDED]: MediaEvent;
    [MediaEvent.ERROR]: MediaEvent;
    [MediaEvent.LOADED_DATA]: MediaEvent;
    [MediaEvent.LOADED_METADATA]: MediaEvent;
    [MediaEvent.LOAD_START]: MediaEvent;
    [MediaEvent.PAUSE]: MediaEvent;
    [MediaEvent.PLAY]: MediaEvent;
    [MediaEvent.PLAYING]: MediaEvent;
    [MediaEvent.PROGRESS]: MediaEvent;
    [MediaEvent.RATE_CHANGE]: MediaEvent;
    [MediaEvent.SEEKED]: MediaEvent;
    [MediaEvent.SEEKING]: MediaEvent;
    [MediaEvent.STALLED]: MediaEvent;
    [MediaEvent.SUSPEND]: MediaEvent;
    [MediaEvent.TIME_UPDATE]: MediaEvent;
    [MediaEvent.VOLUME_CHANGE]: MediaEvent;
    [MediaEvent.WAITING]: MediaEvent;
}

export default IMediaEventsMap;
