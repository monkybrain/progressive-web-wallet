const wallet = require('./wallet.js')
const ui = require('./ui.js')
const spinner = require('./spinner.js')
const tx = require('./tx.js')
const faucet = require('./faucet.js')

window.setPage = function(page) {

  switch (page) {

    case "new-wallet":
      show(document.getElementById("content-new-wallet"))
      hide(document.getElementById("content-main"))
      hide(document.getElementById("content-send"))
      hide(document.getElementById("content-tx"))
      document.getElementById("input-send-address").value = ""
      document.getElementById("input-send-amount").value = ""
      ui.refresh()
      break

    case "main":
      hide(document.getElementById("content-new-wallet"))
      show(document.getElementById("content-main"))
      hide(document.getElementById("content-send"))
      hide(document.getElementById("content-tx"))
      document.getElementById("input-send-address").value = ""
      document.getElementById("input-send-amount").value = ""
      ui.refresh()
      break

    case "send":
      hide(document.getElementById("content-new-wallet"))
      hide(document.getElementById("content-main"))
      show(document.getElementById("content-send"))
      hide(document.getElementById("content-tx"))
      break

    case "tx":
      hide(document.getElementById("content-new-wallet"))
      hide(document.getElementById("content-main"))
      hide(document.getElementById("content-send"))
      show(document.getElementById("content-tx"))
      break

    default:

  }
}

window.buyEther = function() {

  // Get address
  let address = localStorage.getItem("address")

  // Request ether from the metamask ropsten faucet
  // let txHash = faucet.receive(address)
  //
  // console.log(txHash)
}

window.sendEther = function() {

  // Prompt user for password
  let password = prompt("Enter password")

  // Decrypt private key
  let privateKey = wallet.decryptPrivateKey(password)

  // If correct password entered -> perform transaction
  if (privateKey) {

    // Get address and amount from input fields
    let address = document.getElementById("input-send-address").value
    let amount = document.getElementById("input-send-amount").value

    // Send
    tx.send(address, amount, privateKey)
    
    // .then((txHash) => {
    //   console.log("Tx Hash:" + txHash)
    //   // Update UI elements
    //   document.getElementById("etherscan-tx").href = "https://ropsten.etherscan.io/tx/" + txHash
    //   // Set page
    //   setPage("tx")
    // })
    // .catch((err) => alert(err))

  // Else alert user of incorrect password
  } else {
    alert('Fel lösenord')
  }

}

window.deleteWallet = function() {
  if (confirm('Är du säker på att du vill radera din wallet?')) {
    wallet.delete()
    location.reload()
  }
}

window.generateWallet = function() {
  var pw = document.getElementById("input-new-password").value
  spinner.start()
  setTimeout(function() {
    wallet.generate(pw)
    spinner.stop()
    setPage('main')
  }, 1000)


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
