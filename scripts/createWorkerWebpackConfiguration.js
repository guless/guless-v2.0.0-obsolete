/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const path = require("path");
const dist = path.resolve(__dirname, "../www/dist/");
const context = path.resolve(__dirname, "../www/");
const mergeWebpackConfiguration = require("webpack-merge");
const createDefaultWebpackConfiguration = require("./createDefaultWebpackConfiguration");

function createWorkerWebpackConfiguration(env = {}, argv = {}) {
    return mergeWebpackConfiguration(createDefaultWebpackConfiguration(env, argv), {
        context,
        devtool: argv.mode !== "development" ? false : "inline-source-map",
        target: "webworker",
        entry: {
            "service-worker": "./service-worker.ts",
        },
        output: {
            path: dist,
            filename: "[name].js",
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "../src/"),
            },
        },
        module: {
            rules: [
                {
                    test: /\.tsx?(?:\?.*)?$/i,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                configFile: path.resolve(context, "tsconfig.json"),
                            },
                        },
                    ],
                },
            ],
        },
    });
}

module.exports = createWorkerWebpackConfiguration;
