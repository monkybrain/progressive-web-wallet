const wallet = require('./wallet.js')
const ui = require('./ui.js')
const spinner = require('./spinner.js')
const tx = require('./tx.js')
const faucet = require('./faucet.js')
const scanner = require('./scanner.js')
const clipboard = require('./clipboard.js')
const analytics = require('./analytics.js')
const webworkify = require('webworkify')
const worker = webworkify(require('./worker.js'))

/* GENERAL */

window.init = function() {

  // If no base currency set -> set base currency
  if (!localStorage.getItem("baseCurrency")) {
    localStorage.setItem("baseCurrency", "USD")
  }

  // If wallet already created -> go to "main" page
  if (localStorage.getItem("address") && localStorage.getItem("encryptedKey")) {
    window.setPage("main")
  // Else -> go to "new wallet" page
  } else {
    window.setPage("new-wallet")
  }

  // Stop spinner
  spinner.stop()

  // Send analytics
  analytics.sendEvent('app', 'launch')
}

window.setPage = function(page) {

  // Hide all content divs
  elements = Array.from(document.getElementsByClassName("content"))
  elements.map((el) => hide(el))

  // Show selected div
  show(document.getElementById("content-" + page))

  if (page === "main") {
    ui.refresh()
  }

}

/* GENERATE WALLET */

window.generateWallet = function() {

  // Get password
  var password = document.getElementById("input-new-password").value

  // Start spinner
  spinner.start()

  // Add web worker event listener
  worker.addEventListener('message', (e) => {

    // Remove web worker event listener
    worker.removeEventListener('message', this)

    // Store encrypted private key and address in localStorage
    localStorage.setItem("encryptedKey", e.data.encryptedKey)
    localStorage.setItem("address", e.data.address)

    // Go to "main" page
    setPage('main')

    // Stop spinner
    spinner.stop()

    // Send analytics event
    analytics.sendEvent('wallet', 'generate')
  })

  // Post password to address generating web worker
  worker.postMessage({command: "generate", password: password})
}

/* GET ETHER */
window.getEther = function() {

  // Start spinner
  spinner.start()

  // Get address
  let address = localStorage.getItem("address")

  // Request ether from the metamask ropsten faucet
  faucet.receive(address)
  .then((txHash) => {

    // Log TX hash to console
    console.log("Faucet Tx Hash: " + txHash)

    // Update "view transaction" button link
    document.getElementById("etherscan-tx-funding").href = "https://ropsten.etherscan.io/tx/" + txHash

    // Go to funding page
    setPage("funding")

    // Stop spinner
    spinner.stop()

    // Send analytics event
    analytics.sendEvent('wallet', 'faucet')
    
  })
  .catch((err) => {
    alert(err)
    spinner.stop()
  })

}

/* SEND ETHER */

window.sendEther = function() {

  // Prompt user for password
  let password = prompt("Enter password")

  // Fetch encrypted key from localStorage
  let encryptedKey = localStorage.getItem("encryptedKey")

  // Decrypt private key
  let privateKey = wallet.decryptPrivateKey(encryptedKey, password)

  // If correct password entered -> perform transaction
  if (privateKey) {

    // Start spinner
    spinner.start()

    // Get address and amount from input fields
    let to = document.getElementById("input-send-address").value
    let amount = document.getElementById("input-send-amount").value

    // Send
    tx.send(to, amount, privateKey)
    .then((txHash) => {

      // Log transaction hash to console
      console.log("Tx Hash:" + txHash)

      // Update UI elements
      document.getElementById("etherscan-tx").href = "https://ropsten.etherscan.io/tx/" + txHash

      // Set page
      setPage("tx")

      // Stop spinner
      spinner.stop()

      // Send analytics event
      analytics.sendEvent('wallet', 'tx')

    })
    .catch((err) => {
      spinner.stop()
      alert(err)
    })

  // Else alert user of incorrect password
  } else {
    alert('Wrong password')
  }

}

window.clearSendInputs = function() {
  clear(document.getElementById('input-send-address'))
  clear(document.getElementById('input-send-amount'))
}

window.launchScanner = function() {
  window.setPage("scanner")
  scanner.scan()
  .then((content) => {
    ui.updateSendForm(content)
    window.setPage("send")
  })
}

window.stopScanner = function() {
  scanner.stop()
  window.setPage("send")
}

window.switchCamera = function() {
  scanner.switchCamera()
}

/* SETTINGS */

window.deleteWallet = function() {
  let confirmation = confirm("Are you sure you want to delete your wallet?")
  if (confirmation) {
    wallet.delete()
    setPage('new-wallet')

    // Send analytics event
    analytics.sendEvent('wallet', 'delete')
  }
}

window.selectBaseCurrency = function() {
  let selector = document.getElementById('select-base-currency')
  let index = selector.selectedIndex
  let options = selector.options
  let currency = options[index].value
  localStorage.setItem('baseCurrency', currency)
  ui.refresh()
}

window.revealPrivateKey = function() {
  let password = prompt("Enter password")
  let encryptedKey = localStorage.getItem('encryptedKey')
  let privateKey = wallet.decryptPrivateKey(encryptedKey, password)
  if (privateKey) {
    document.getElementById('private-key').innerHTML = privateKey
    document.getElementById('clipboard-private-key').setAttribute('data-clipboard-text', privateKey)
    setPage('private-key')
  } else {
    alert("Invalid password")
  }
}

window.hidePrivateKey = function() {
  document.getElementById('private-key').innerHTML = ""
  document.getElementById('clipboard-private-key').setAttribute('data-clipboard-text', "")
}

/* PRIVATE FUNCTIONS */

var hide = function(el) {
  el.setAttribute("hidden", true)
}

var show = function(el) {
  el.removeAttribute("hidden")
}

var clear = function(el) {
  el.value = ""
}
