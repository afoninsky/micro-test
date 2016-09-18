const Promise = require('bluebird')
const Logger = require('./logger')

module.exports = {

	senecaCreateLogger() {
		// https://github.com/senecajs/seneca/blob/master/docs/examples/custom-logger.js
		const customLogger = new Logger(...arguments)
		function SenecaLogger () {}
		SenecaLogger.preload = function () {
			return {
				extend: {
					logger: (context, payload) => {
// [ 'actid', 'msg', 'entry', 'prior', 'gate', 'caller', 'meta', 'client','listen', 'transport', 'kind', 'case', 'duration', 'result', 'level', 'plugin_name', 'plugin_tag', 'pattern', 'seneca', 'when' ]
						customLogger[payload.level](payload)
					}
				}
			}
		}
		return SenecaLogger
	},

  senecaPromisify(seneca) {
    const act = (...data) => {
      const callback = data.pop()
      // emit error from data, temporal workaround:
      // https://github.com/senecajs/seneca/issues/523#issuecomment-245712042
      seneca.act(...data, (err, res) => {
        if (err) { return callback(err) }
        if (res.error) { return callback(new Error(res.error.message || 'Unknown microservice error')) }
        callback(null, res)
      })
    }
    seneca.decorate('actAsync', Promise.promisify(act, {context: seneca}))
    return seneca
  }
}
