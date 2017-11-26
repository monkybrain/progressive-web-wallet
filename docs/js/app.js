const keythereum = require('keythereum')
const QR = require('ethereum-qr-code')
const Web3 = require('web3')
const Clipboard = require('clipboard')
const EthereumTx = require('ethereumjs-tx')

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

window.setPage = function(page) {
  if (page === "send") {
    document.getElementById("content-main").style.display = "none";
    document.getElementById("content-send").style.display = "block";
  } else if (page === "main") {
    document.getElementById("content-main").style.display = "block";
    document.getElementById("content-send").style.display = "none";
    document.getElementById("input-send-address").value = "";
    document.getElementById("input-send-amount").value = "";
  }
}

window.sendEther = function() {
  let address = document.getElementById("input-send-address").value.toLowerCase()
  let amount = web3.utils.toWei(document.getElementById("input-send-amount").value, 'ether')
  let privateKey = Buffer.from(localStorage.getItem("privateKey"), 'hex')

  // Handle nonce
  var nonce = parseInt(localStorage.getItem("nonce") || "21")
  localStorage.setItem("nonce", nonce + 1)
  console.log(nonce)

  // Estimate gas

  web3.eth.getGasPrice()
  .then((gasPrice) => {
    const txParams = {
      nonce: web3.utils.toHex(nonce),
      to: address,
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(290000),
      value: web3.utils.toHex(amount),
      chainId: 3
    }
    console.log(txParams)
    const tx = new EthereumTx(txParams)
    tx.sign(privateKey)
    const txData = "0x" + tx.serialize().toString('hex')

    var spinner = document.getElementById('spinner')
    spinner.style.display = "block"
    web3.eth.sendSignedTransaction(txData)
    .then(function(result) {
      console.log(result)
      alert("Transaktionen är nu genomförd")
      setPage("main")
      spinner.style.display = "none";
    })
    .catch(function(err) {
      console.log(err)
      alert(err)
      spinner.style.display = "none";
    })

  })
  .catch(console.log)

}
