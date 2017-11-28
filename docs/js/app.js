const keythereum = require('keythereum')
const QR = require('ethereum-qr-code')
const Web3 = require('web3')
const Clipboard = require('clipboard')
const interactions = require('./interactions.js')

// Generate cache
cache = {
  nonce: 0
}

// Setup web3
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/0pzfHdAhsqakqtBk8Hs6"))

// Setup Clipboard
new Clipboard('#clipboard')

// If no key pair exists, generate new
if (!localStorage.getItem("keyObject")) {
  // var password = window.prompt("Ange lösenord för ditt nya konto")
  console.log("Generating new key pair")
  var dk = keythereum.create()
  localStorage.setItem("privateKey", dk.privateKey.toString('hex'))
  const keyObject = keythereum.dump("fisk", dk.privateKey, dk.salt, dk.iv)
  localStorage.setItem("keyObject", JSON.stringify(keyObject))
  cache.keyObject = keyObject;

// Else get from localStorage
} else {
  window.setPage("main")
  console.log("Found key pair")
  cache.keyObject = JSON.parse(localStorage.getItem("keyObject"));
}

cache.address = "0x" + cache.keyObject.address

// Generate QR code
new QR().toDataUrl({to: cache.address}).then(function(result) {
  document.getElementById("qr").src = result.dataURL
})


var refresh = function() {
  console.log("refreshing")

  // Update address
  document.getElementById("address").innerHTML = cache.address
  document.getElementById("etherscan-address").href = "https://ropsten.etherscan.io/address/" + cache.address
  document.getElementById("clipboard").setAttribute('data-clipboard-text', cache.address)

  web3.eth.getBalance(cache.address)
  .then((result) => {
    cache.balance_eth = web3.utils.fromWei(result.toString(10))
    document.getElementById("balance_eth").innerHTML = cache.balance_eth
    fetch('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=SEK')
    .then((result) => result.json())
    .then(function(data) {
      let rate = data[0].price_sek
      document.getElementById("balance_sek").innerHTML = Math.round(cache.balance_eth * rate * 100) / 100
      }
    )
  })
}

// Refresh UI every 15 s
refresh()
setInterval(refresh, 1000*15)
