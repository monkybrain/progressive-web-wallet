const keythereum = require('keythereum')
const QR = require('ethereum-qr-code')

cache = {}

// If no key pair exists, create one
if (!localStorage.getItem("keys")) {
  console.log("Generating new key pair")
  var dk = keythereum.create()
  const keys = keythereum.dump("fisk", dk.privateKey, dk.salt, dk.iv)
  localStorage.setItem("keys", JSON.stringify(keys))
  cache.keys = keys;
} else {
  console.log("Found key pair")
  cache.keys = JSON.parse(localStorage.getItem("keys"));
}

// Generate QR code
cache.balance = 0.3

// Update user interface
document.getElementById("account").innerHTML = cache.keys.address;
document.getElementById("balance_eth").innerHTML = cache.balance;
document.getElementById("balance_sek").innerHTML = cache.balance * 3800;
