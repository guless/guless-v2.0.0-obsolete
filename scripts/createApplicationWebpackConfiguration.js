/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2020 ☜Samlv9☞ and other contributors
/// @MIT-LICENSE | 6.0 | https://developers.guless.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const createServerWebpackConfiguration = require("./createServerWebpackConfiguration");
const createWorkerWebpackConfiguration = require("./createWorkerWebpackConfiguration");

function createApplicationWebpackConfiguration(env = {}, argv = {}) {
    return [createServerWebpackConfiguration(env, argv), createWorkerWebpackConfiguration(env, argv)];
}

module.exports = createApplicationWebpackConfiguration;
