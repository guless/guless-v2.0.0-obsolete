/// For a detailed explanation regarding each configuration property, visit:
/// https://github.com/postcss/postcss-loader
/// https://github.com/postcss/postcss/blob/master/docs/plugins.md
function createPostCSSConfiguration(context) {
    return {
        plugins: {
            "autoprefixer": { overrideBrowserslist: ["defaults"] },
            "cssnano": { preset: "default" },
        },
    };
}

module.exports = createPostCSSConfiguration;
