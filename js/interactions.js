const wallet = require('./wallet.js')
const ui = require('./ui.js')
const spinner = require('./spinner.js')
const tx = require('./tx.js')
const faucet = require('./faucet.js')
const scanner = require('./scanner.js')
const webworkify = require('webworkify')
const worker = webworkify(require('./worker.js'))

window.getEther = function() {

  // Go to funding page
  setPage("funding")

  // Get address
  let address = localStorage.getItem("address")

  // Request ether from the metamask ropsten faucet
  faucet.receive(address)
  .then((txHash) => {
    console.log("Faucet Tx Hash: " + txHash)
    document.getElementById("etherscan-tx-funding").href = "https://ropsten.etherscan.io/tx/" + txHash
  })

}

window.sendEther = function() {

  // Prompt user for password
  let password = prompt("Enter password")

  // Fetch encrypted key from localStorage
  let encryptedKey = localStorage.getItem("encryptedKey")

  // Decrypt private key
  let privateKey = wallet.decryptPrivateKey(encryptedKey, password)

  // If correct password entered -> perform transaction
  if (privateKey) {

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

    })
    .catch((err) => alert(err))

  // Else alert user of incorrect password
  } else {
    alert('Wrong password')
  }

}

window.deleteWallet = function() {
  if (confirm('Are you sure you want to delete your wallet?')) {
    wallet.delete()
    location.reload()
  }
}

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
  })

  // Post password to address generating web worker
  worker.postMessage({command: "generate", password: password})
}

window.launchScanner = function() {
  window.setPage("scanner")
  scanner.scan(0)
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

window.setPage = function(page) {

  // Hide all content divs
  elements = Array.from(document.getElementsByClassName("content"))
  elements.map((el) => hide(el))

  // Show selected div
  show(document.getElementById("content-" + page))

  if (page == "main") {
    ui.refresh()
  }

}

window.selectBaseCurrency = function() {
  let selector = document.getElementById('select-base-currency')
  let index = selector.selectedIndex
  let options = selector.options
  let currency = options[index].value
  localStorage.setItem("baseCurrency", currency)
  ui.refresh()
}

/* Privte functions */
var hide = function(el) {
  el.setAttribute("hidden", true)
}

var show = function(el) {
  el.removeAttribute("hidden")
}

var clear = function(el) {
  el.value = ""
}
