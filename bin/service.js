#!/usr/bin/env node

/**
 * Basic microservice launcher sample
 */

if (module.parent) { throw new Error('Im not a module, please launch me directly. Thank you') }

const { loadPlugins } = require('seneca-extended/src/utils')
const pluginsDir = `${__dirname}/../src/seneca`
const config = require('config')
const seneca = require('seneca-extended')({
  logLevel: 'info'
})

loadPlugins(seneca, pluginsDir, config).then(loaded => {
  if(!loaded.length) {
    throw new Error(`no services found in ${pluginsDir} directory`)
  }

  // log errors into opbeat
  if (config.opbeat) {
    require('../src/opbeat')
  }

  // run http transport
  if (config.listen && config.listen.port) {
    seneca.listen(config.listen.port)
  }

  // run healthcheck server
  if (config.health && config.health.port) {
    require('../src/health').listen(config.health.port)
  }

  seneca.logger.info(`Services started: ${loaded.join(', ')}`)

}).catch(err => {
  seneca.logger.error(err)
  process.exit(1)
})
