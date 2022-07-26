const dot = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')
const env = process.env.NODE_ENV || 'dev'

function dotenvHelper() {
    ok(env === 'prod' || env == 'dev', 'A env é invalida')
    const configPath = join(__dirname, '../../config', `.env.${env}`)
    return dot.config({
        path: configPath
    })
}
module.exports = dotenvHelper