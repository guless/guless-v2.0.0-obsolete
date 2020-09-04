/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import UIElement from "./UIElement";
import UISelector from "./UISelector";
import UIMediaElementReadyState from "./UIMediaElementReadyState";
import UIMediaElementNetworkState from "./UIMediaElementNetworkState";
import UIMediaElementPreload from "./UIMediaElementPreload";
import UIMediaElementCrossOrigin from "./UIMediaElementCrossOrigin";
import MediaEvent from "../events/MediaEvent";
import { SUPPORTED_HTML_MEDIA_ELEMENT_SRC_OBJECT } from "../platform/capabilities";
import createObjectURL from "../platform/createObjectURL";
import revokeObjectURL from "../platform/revokeObjectURL";

@UISelector("UIMediaElement")
abstract class UIMediaElement extends UIElement {
    public readonly domElement!: HTMLMediaElement;

    private _srcObject: null | string | MediaStream | MediaSource | Blob = null;
    private _srcObjectURL: null | string = null;

    constructor(domElement: HTMLMediaElement) {
        super(domElement);
        this._transformMediaEventHandler = this._transformMediaEventHandler.bind(this);

        this.domElement.addEventListener(MediaEvent.ABORT,            this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.CAN_PLAY,         this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.CAN_PLAY_THROUGH, this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.DURATION_CHANGE,  this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.EMPTIED,          this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.ENDED,            this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.ERROR,            this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.LOADED_DATA,      this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.LOADED_METADATA,  this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.LOAD_START,       this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.PAUSE,            this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.PLAY,             this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.PLAYING,          this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.PROGRESS,         this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.RATE_CHANGE,      this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.SEEKED,           this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.SEEKING,          this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.STALLED,          this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.SUSPEND,          this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.TIME_UPDATE,      this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.VOLUME_CHANGE,    this._transformMediaEventHandler, false);
        this.domElement.addEventListener(MediaEvent.WAITING,          this._transformMediaEventHandler, false);
    }

    public get readyState(): UIMediaElementReadyState {
        return this.domElement.readyState as UIMediaElementReadyState;
    }

    public get networkState(): UIMediaElementNetworkState {
        return this.domElement.networkState as UIMediaElementNetworkState;
    }

    public get preload(): UIMediaElementPreload {
        return this.domElement.preload as UIMediaElementPreload;
    }

    public set preload(value: UIMediaElementPreload) {
        this.domElement.preload = value;
    }

    public get crossOrigin(): null | UIMediaElementCrossOrigin {
        return this.domElement.crossOrigin as null | UIMediaElementCrossOrigin;
    }

    public set crossOrigin(value: null | UIMediaElementCrossOrigin) {
        this.domElement.crossOrigin = value;
    }

    public get src(): null | string | MediaStream | MediaSource | Blob {
        return this._srcObject;
    }

    public set src(value: null | string | MediaStream | MediaSource | Blob) {
        if (this._srcObjectURL !== null) {
            revokeObjectURL(this._srcObjectURL);
            this._srcObjectURL = null;
        }

        this._srcObject = value;

        if (SUPPORTED_HTML_MEDIA_ELEMENT_SRC_OBJECT) {
            if (typeof value === "string") {
                if (this.domElement.srcObject) {
                    this.domElement.srcObject = null;
                }
                this.domElement.src = value;
            } else if (value === null || typeof (value as MediaStream).addTrack !== "undefined") {
                if (this.domElement.src) {
                    this.setAttribute("src", null);
                }
                this.domElement.srcObject = value;
            } else {
                this._srcObjectURL = createObjectURL(value);
                if (this.domElement.srcObject) {
                    this.domElement.srcObject = null;
                }
                this.domElement.src = this._srcObjectURL;
            }
        } else {
            if (typeof value === "string") {
                this.domElement.src = value;
            } else if (value === null) {
                this.setAttribute("src", null);
            } else {
                this._srcObjectURL = createObjectURL(value);
                this.domElement.src = this._srcObjectURL;
            }
        }
    }

    public get controls(): boolean {
        return this.domElement.controls;
    }

    public set controls(value: boolean) {
        this.domElement.controls = value;
    }

    public get autoplay(): boolean {
        return this.domElement.autoplay;
    }

    public set autoplay(value: boolean) {
        this.domElement.autoplay = value;
    }

    public get loop(): boolean {
        return this.domElement.loop;
    }

    public set loop(value: boolean) {
        this.domElement.loop = value;
    }

    public get muted(): boolean {
        return this.domElement.muted;
    }

    public set muted(value: boolean) {
        this.domElement.muted = value;
    }

    public get defaultMuted(): boolean {
        return this.domElement.defaultMuted;
    }

    public set defaultMuted(value: boolean) {
        this.domElement.defaultMuted = value;
    }

    public get volume(): number {
        return this.domElement.volume;
    }

    public set volume(value: number) {
        this.domElement.volume = value;
    }

    public get playbackRate(): number {
        return this.domElement.playbackRate;
    }

    public set playbackRate(value: number) {
        this.domElement.playbackRate = value;
    }

    public get defaultPlaybackRate(): number {
        return this.domElement.defaultPlaybackRate;
    }

    public set defaultPlaybackRate(value: number) {
        this.domElement.defaultPlaybackRate = value;
    }

    public get currentTime(): number {
        return this.domElement.currentTime;
    }

    public set currentTime(value: number) {
        this.domElement.currentTime = value;
    }

    public get duration(): number {
        return this.domElement.duration;
    }

    public get buffered(): TimeRanges {
        return this.domElement.buffered;
    }

    public get played(): TimeRanges {
        return this.domElement.played;
    }

    public get seekable(): TimeRanges {
        return this.domElement.seekable;
    }

    public get seeking(): boolean {
        return this.domElement.seeking;
    }

    public get paused(): boolean {
        return this.domElement.paused;
    }

    public get ended(): boolean {
        return this.domElement.ended;
    }

    public get error(): null | MediaError {
        return this.domElement.error;
    }

    public async play(): Promise<void> {
        return this.domElement.play();
    }

    public pause(): void {
        return this.domElement.pause();
    }

    public destroy(): void {
        super.destroy();
        this.domElement.removeEventListener(MediaEvent.ABORT,            this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.CAN_PLAY,         this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.CAN_PLAY_THROUGH, this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.DURATION_CHANGE,  this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.EMPTIED,          this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.ENDED,            this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.ERROR,            this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.LOADED_DATA,      this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.LOADED_METADATA,  this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.LOAD_START,       this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.PAUSE,            this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.PLAY,             this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.PLAYING,          this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.PROGRESS,         this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.RATE_CHANGE,      this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.SEEKED,           this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.SEEKING,          this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.STALLED,          this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.SUSPEND,          this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.TIME_UPDATE,      this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.VOLUME_CHANGE,    this._transformMediaEventHandler, false);
        this.domElement.removeEventListener(MediaEvent.WAITING,          this._transformMediaEventHandler, false);
    }

    private _transformMediaEventHandler(evt: Event): void {
        this.dispatchEvent(new MediaEvent(evt.type));
    }
}

export default UIMediaElement;
