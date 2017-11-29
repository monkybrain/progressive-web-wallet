const QR = require('ethereum-qr-code')
const Web3 = require('web3')

// Setup web3
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/0pzfHdAhsqakqtBk8Hs6"))

module.exports.refresh = function() {

  console.log("Refreshing UI")

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

  // Update balance (in eth and sek)
  web3.eth.getBalance(address)

  .then((balance) => {

    // Convert balance from wei to ether
    let balance_eth = web3.utils.fromWei(balance.toString(10))

    // Get eth/sek rate
    fetch('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=SEK')
    .then((result) => result.json())
    .then((data) => data[0].price_sek)

    // Update balance UI elements
    .then((rate) => {
      document.getElementById("balance_eth").innerHTML = balance_eth
      document.getElementById("balance_sek").innerHTML = Math.round(balance_eth * rate * 100) / 100
    })
  })
}

// Refresh UI every 15 s
module.exports.refresh()
setInterval(module.exports.refresh, 1000*15)
