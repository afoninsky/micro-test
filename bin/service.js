global.Promise = require('bluebird')
require('../src/opbeat')

const config = require('config')
const seneca = require('../src/seneca')
const Logger = require('../src/logger')
const health = require('../src/health')


const log = new Logger(config.log, require('../package'))
health.listen(config.healthcheck.port)

seneca
  .use('../src/plugins/test')
  .listen(config.listen.port)

log.info('Service started')
