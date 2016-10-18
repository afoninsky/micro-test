const { test } = require('ava')

const seneca = require('seneca-extended')({
  logLevel: 'info'
})
const example = require(`${process.env.PWD}/src/example`)

test.before(async () => {
  await seneca.useAsync(example, { custom: 'config' })
})

test('test echo', async t => {
	const res = await seneca.actAsync(example.routes.echo, { some: 'payload'})
	t.is(res.some, 'payload')
})

test('test error', async t => {
	t.throws(seneca.actAsync(example.routes.error), /custom error/)
})
