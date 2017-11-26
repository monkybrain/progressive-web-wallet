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

// Set fake balance
cache.balance = 0.3

// Generate QR code
new QR().toDataUrl({to: "0x" +cache.keys.address}).then(function(result) {
  console.log(Object.keys(result))
  document.getElementById("qr").src = result.dataURL
})

// Update user interface
document.getElementById("address").innerHTML = cache.keys.address;
document.getElementById("balance_eth").innerHTML = cache.balance;
document.getElementById("balance_sek").innerHTML = cache.balance * 3800;

document.getElementById("link_swish").href = encodeURI('swish://payment?data={"version":1,"payee":{"value":"070-938 59 75","editable":false},"amount":{"value":100,"editable":false},"message":{"value":"Fisk","editable":true}}')
