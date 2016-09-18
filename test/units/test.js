const { test } = require('ava')
const seneca = require('../../src/seneca')

seneca.use('../../src/plugins/test')

test('emit not existing route', t => {
  return seneca.actAsync('role:test,cmd:nosuch').catch(err => {
    t.regex(err.message, /No matching action pattern found/)
  })
})

test('ensure echo returned', t => {
  const payload = { some: 'data' }
  return seneca.actAsync('role:test,cmd:echo', payload).then(res => {
    t.is(res.some, payload.some)
  })
})
