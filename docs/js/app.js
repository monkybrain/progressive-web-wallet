const Clipboard = require('clipboard')
const interactions = require('./interactions.js')
const ui = require('./ui.js')

// Generate cache
cache = {
  nonce: 0
}

// Setup Clipboard
new Clipboard('#clipboard')

if (localStorage.getItem("privateKey")) {
  window.setPage("main")
}
