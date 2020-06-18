/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/**
 * For a detailed explanation regarding each configuration property, visit:
 * @see https://github.com/postcss/postcss-loader
 * @see https://github.com/postcss/postcss/blob/master/docs/plugins.md
 */
function createPostCSSConfiguration(context) {
    return {
        plugins: {
            "autoprefixer": { overrideBrowserslist: ["defaults"] },
            "cssnano": { preset: "default" },
        },
    };
}

module.exports = createPostCSSConfiguration;
