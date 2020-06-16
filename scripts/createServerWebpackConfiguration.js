/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0.1 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const path = require("path");
const context = path.resolve(__dirname, "../www/");
const mergeWebpackConfiguration = require("webpack-merge");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const createDefaultWebpackConfiguration = require("./createDefaultWebpackConfiguration");

function createServerWebpackConfiguration(env = {}, argv = {}) {
    return mergeWebpackConfiguration(createDefaultWebpackConfiguration(env, argv), {
        context,
        devtool: "#inline-source-map",
        entry: {
            "main": ["./main.scss", "./main.ts"],
        },
        output: {
            path: context,
            filename: "[name].js",
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "../src/"),
            },
        },
        devServer: {
            contentBase: context,
            https: true,
            host: "0.0.0.0",
            useLocalIp: true,
            disableHostCheck: true,
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
                {
                    test: /\.s?css(?:\?.*)?/i,
                    use: [
                        {
                            loader: "style-loader",
                        },
                        {
                            loader: "css-loader",
                            options: {
                                url: false,
                            },
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                config: { path: path.resolve(context) },
                            },
                        },
                        {
                            loader: "sass-loader",
                        },
                    ],
                },
            ],
        },
        plugins: [
            new HTMLWebpackPlugin({
                chunks: ["main"],
                template: path.resolve(context, "main.html"),
            }),
        ],
    });
}

module.exports = createServerWebpackConfiguration;
