var keythereum = require('keythereum')
var CryptoJS = require('crypto-js')

module.exports.generateWallet = function(password) {

  // Generate key
  const dk = keythereum.create()

  // Encrypt and store private key
  privateKey = dk.privateKey.toString('hex')
  encryptedKey = CryptoJS.AES.encrypt(privateKey, password)
  localStorage.setItem('privateKey', encryptedKey)

  // Generate and store address + key object
  const keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv)
  localStorage.setItem("address", "0x" + keyObject.address)
  localStorage.setItem("keyObject", keyObject)

}
