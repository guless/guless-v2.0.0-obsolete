/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const fs = require("fs");
const path = require("path");
const dist = path.resolve(__dirname, "../dist/www/");
const context = path.resolve(__dirname, "../www/");
const mergeWebpackConfiguration = require("webpack-merge");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OnceImporter = require("node-sass-once-importer");
const createDefaultWebpackConfiguration = require("./createDefaultWebpackConfiguration");

function createServerWebpackConfiguration(env = {}, argv = {}) {
    return mergeWebpackConfiguration(createDefaultWebpackConfiguration(env, argv), {
        context,
        devtool: "#inline-source-map",
        entry: {
            "index": ["./index.scss", "./index.ts"],
            "world2d": ["./world2d.scss", "./world2d.ts"],
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
        devServer: {
            host: "www.guless.com",
            // port: 443,
            https: true,
            key: fs.readFileSync("./private/server.key"),
            cert: fs.readFileSync("./private/server.crt"),
            injectClient: false,
            injectHot: false,
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
                            options: {
                                sassOptions: { importer: OnceImporter() },
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [{ from: "./resources/", to: "./resources/", noErrorOnMissing: true }],
            }),
            new HTMLWebpackPlugin({
                chunks: ["index"],
                filename: "index.html",
                title: "Guless",
                template: path.resolve(context, "template.html"),
            }),
            new HTMLWebpackPlugin({
                chunks: ["world2d"],
                filename: "world2d.html",
                title: "World2D Examples - Guless",
                template: path.resolve(context, "template.html"),
            }),
        ],
    });
}

module.exports = createServerWebpackConfiguration;
