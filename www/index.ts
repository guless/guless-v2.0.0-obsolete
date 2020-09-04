/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import UIAudioElement from "@/elements/UIAudioElement";
import UIVideoElement from "@/elements/UIVideoElement";
import UICanvasElement from "@/elements/UICanvasElement";

const audio: UIAudioElement = new UIAudioElement();
const video: UIVideoElement = new UIVideoElement();

audio.controls = true;
audio.autoplay = true;
audio.loop = true;
audio.src = "./resources/media/bunny.mp3";

video.controls = true;
video.autoplay = true;
video.loop = true;
video.width = 320;
video.height = 180;
video.src = "./resources/media/bunny.mp4";

document.body.appendChild(audio.domElement);
document.body.appendChild(video.domElement);

const canvas: UICanvasElement = new UICanvasElement();
const context: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = 320;
canvas.height = 180;
canvas.style.background = "#f8f8f8";

context.save();
context.strokeStyle = "#009000";
context.arc(canvas.width * 0.5, canvas.height * 0.5, 50, 0, Math.PI * 2, false);
context.stroke();
context.restore();

document.body.appendChild(canvas.domElement);
