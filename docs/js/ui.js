const QR = require('ethereum-qr-code')
const Web3 = require('web3')

// Setup web3
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/0pzfHdAhsqakqtBk8Hs6"))

module.exports.refresh = function() {

  console.log("refreshing")

  var address = localStorage.getItem("address")

  if (!localStorage.getItem("address")) return;

  // Generate QR code
  new QR().toDataUrl({to: address}).then(function(result) {
    document.getElementById("qr").src = result.dataURL
  })

  // Update address
  document.getElementById("address").innerHTML = address
  document.getElementById("etherscan-address").href = "https://ropsten.etherscan.io/address/" + address
  document.getElementById("clipboard").setAttribute('data-clipboard-text', address)

  web3.eth.getBalance(address)
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
module.exports.refresh()
setInterval(module.exports.refresh, 1000*15)
