const config = require('config')
const { test } = require('ava')
const seneca = require('../../src/seneca')
const Logger = require('../../src/logger')
const health = require('../../src/health')
const axios = require('axios')
const pkg = require('../../package')

let healthInsance

const request = axios.create({
  baseURL: `http://localhost:${config.healthcheck.port}`,
})

test.before('run seneca / healthcheck', () => {
  healthInsance = health.listen(config.healthcheck.port)
  seneca.listen(config.listen.port)
})

test.after.cb.always('stop seneca', t => {
  seneca.close(t.end)
})

test.after.cb.always('stop healthcheck', t => {
  if (!healthInsance) { return t.end() }
  healthInsance.close(t.end)
})

test('ensure healthcheck is working', t => {
  return request.get('/_ah/health').then(res => {
    t.is(res.data.name, pkg.name)
  })
})

test('log something', () => {
  // mute stdout
  const write = process.stdout.write
  process.stdout.write = () => {}

  const log = new Logger({
    stdout: { level: 'debug' },
    logstash: { level: 'info' }
  }, pkg)

  return request.get('/').catch(result => {
    log.debug('some message')
    log.debug(result.response) // test serialize response
    log.debug(result.response.request) // test serialize request
    log.debug(new Error('error')) // test serialize error
  }).finally(() => {
    process.stdout.write = write
  })
})
