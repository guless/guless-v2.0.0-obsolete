/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function createDefaultWebpackConfiguration(env = {}, argv = {}) {
    return {
        resolve: {
            extensions: [
                ".tsx",
                ".ts",
                ".wasm",
                ".mjs",
                ".js",
                ".json",
            ],
        },
    };
}

module.exports = createDefaultWebpackConfiguration;
