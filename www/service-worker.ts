/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0.1 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// <reference no-default-lib="true"/>
/// <reference lib="es2015" />
/// <reference lib="webworker" />
const serviceWorker: ServiceWorkerGlobalScope = self as any as ServiceWorkerGlobalScope;

serviceWorker.addEventListener("fetch", (evt: FetchEvent) => {
    /*< empty >*/
});
