global.Promise = require('bluebird')
const seneca = require('../src/seneca')
const config = require('config')
const Logger = require('../src/logger')
const health = require('../src/health')

require('../src/opbeat')

const log = new Logger(config.log, require('../package'))

health.listen(config.healthcheck.port)

seneca
  .use('../src/plugins/test')
  .listen(config.listen.port)

log.info('Service started')
