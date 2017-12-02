var wallet = require('./wallet.js')

module.exports = function(self) {
  self.addEventListener("message", (e) => {
    if (e.data.command === "generate") {
      let result = wallet.generate(e.data.password)
      self.postMessage(result)
    }
  })
}
