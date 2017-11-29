var keythereum = require('keythereum')
var CryptoJS = require('crypto-js')

module.exports.generate = function(password) {

  // Generate key
  const dk = keythereum.create()

  // Encrypt and store private key
  let privateKey = dk.privateKey.toString('hex')
  let encryptedKey = CryptoJS.AES.encrypt(privateKey, password)
  localStorage.setItem('privateKey', encryptedKey)

  // Generate and store address + key object
  const keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv)
  localStorage.setItem("address", "0x" + keyObject.address)

}

module.exports.decryptPrivateKey = function(password) {

  // Decrypt encrypted private key
  let encryptedKey = localStorage.getItem("privateKey")
  let privateKey = CryptoJS.AES.decrypt(encryptedKey, password).toString(CryptoJS.enc.Utf8)
  return privateKey;

}

module.exports.delete = function() {

  // Clear address and encrypted private key from localStorage
  localStorage.clear()
}
