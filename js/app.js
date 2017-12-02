const Clipboard = require('clipboard')
const interactions = require('./interactions.js')

// Setup Clipboard
new Clipboard('#clipboard')

// If first launch -> do init stuff
if (!localStorage.getItem("baseCurrency")) {
  localStorage.setItem("baseCurrency", "USD")
}

// If wallet exists -> go to "main" page
if (localStorage.getItem("address")) {
  window.setPage("main")
// Else -> navigate to page "new wallet" page
} else {
  window.setPage("new-wallet")
}
