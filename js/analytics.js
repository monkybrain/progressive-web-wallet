const analytics = require('universal-ga')

analytics.initialize('UA-110452092-1')

module.exports.sendEvent = function(category, action) {
  analytics.event(category, action)
}
