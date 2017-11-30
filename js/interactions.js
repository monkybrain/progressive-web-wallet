const wallet = require('./wallet.js')
const ui = require('./ui.js')
const spinner = require('./spinner.js')
const tx = require('./tx.js')
const faucet = require('./faucet.js')

window.buyEther = function() {

  // Get address
  let address = localStorage.getItem("address")

  // Request ether from the metamask ropsten faucet
  faucet.receive(address)
  .then((txHash) => console.log("Faucet Tx Hash: " + txHash))

  setTimeout(() => {
    alert("1 ETH has been requested from the Metamask Ropsten faucet")
  }, 1000)

}

window.sendEther = function() {

  // Prompt user for password
  let password = prompt("Enter password")

  // Decrypt private key
  let privateKey = wallet.decryptPrivateKey(password)

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
  var password = document.getElementById("input-new-password").value
  spinner.start()
  setTimeout(function() {
    wallet.generate(password)
    spinner.stop()
    setPage('main')
  }, 500)
}

window.setPage = function(page) {

  // Hide all content divs
  elements = Array.from(document.getElementsByClassName("content"))
  elements.map((el) => hide(el))

  // Show selected div
  show(document.getElementById("content-" + page))

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
