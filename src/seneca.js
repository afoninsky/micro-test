/**
 * Seneca microservice instance with additional setup
 */
require('babel-core/register')

const config = require('config')
const { senecaCreateLogger, senecaPromisify } = require('../src/utils')

const seneca = require('seneca')({
  internal: {
    logger: senecaCreateLogger(config.log, require('../package'))
  }
})

module.exports = senecaPromisify(seneca)
