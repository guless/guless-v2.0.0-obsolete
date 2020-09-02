/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import UIAudioComponent from "@/components/UIAudioComponent";
import UIVideoComponent from "@/components/UIVideoComponent";

const audio: UIAudioComponent = new UIAudioComponent();
const video: UIVideoComponent = new UIVideoComponent();

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
