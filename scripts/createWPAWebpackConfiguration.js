/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0.1 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const createServerWebpackConfiguration = require("./createServerWebpackConfiguration");
const createWorkerWebpackConfiguration = require("./createWorkerWebpackConfiguration");

function createWPAWebpackConfiguration(env = {}, argv = {}) {
    return [createServerWebpackConfiguration(env, argv), createWorkerWebpackConfiguration(env, argv)];
}

module.exports = createWPAWebpackConfiguration;
