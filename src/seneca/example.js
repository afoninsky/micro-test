const route = {
  echo: { role: 'debug', cmd: 'echo' },
  error: { role: 'debug', cmd: 'error' }
}

module.exports = {

  routes: route,

  preload: (seneca, config) => {
    seneca.logger.info('`config.example` value:', config)
    return Promise.resolve()
  },

  seneca: function () {

    this.add(route.echo, (message, done) => {
      done(null, message)
    })

    this.add(route.error, (message, done) => {
      this.emitError(new Error('custom error'), done)
    })

  }
}
