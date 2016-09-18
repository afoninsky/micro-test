/**
 * Test plugin for example and testing purposes
 */

module.exports = function() {
  this.add('role:test,cmd:echo', (message, done) => {
    done(null, message)
  })
  return 'test'
}
