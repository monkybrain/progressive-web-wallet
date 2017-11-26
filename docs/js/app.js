const keythereum = require('keythereum')
const QR = require('ethereum-qr-code')
const Web3 = require('web3')
const Clipboard = require('clipboard')

// Generate cache
cache = {}

// Setup web3
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/0pzfHdAhsqakqtBk8Hs6"))

// Setup Clipboard
new Clipboard('#clipboard')

// If no key pair exists, generate new
if (!localStorage.getItem("keys")) {
  console.log("Generating new key pair")
  var dk = keythereum.create()
  const keys = keythereum.dump("fisk", dk.privateKey, dk.salt, dk.iv)
  localStorage.setItem("keys", JSON.stringify(keys))
  cache.keys = keys;

// Else get from localStorage
} else {
  console.log("Found key pair")
  cache.keys = JSON.parse(localStorage.getItem("keys"));
}

// Generate QR code
new QR().toDataUrl({to: "0x" +cache.keys.address}).then(function(result) {
  document.getElementById("qr").src = result.dataURL
})


var refresh = function() {
  console.log("refreshing")

  // Update address
  document.getElementById("address").innerHTML = "0x" + cache.keys.address
  document.getElementById("clipboard").setAttribute('data-clipboard-text', "0x" + cache.keys.address)

  web3.eth.getBalance("0x" + cache.keys.address)
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
