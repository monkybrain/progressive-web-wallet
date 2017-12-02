const keythereum = require('keythereum')
const CryptoJS = require('crypto-js')

module.exports.generate = function(password) {

  // Initiate empty wallet object
  let wallet = {}

  // Generate private key
  let dk = keythereum.create()

  // Encrypt private key and collect ciphertext
  let privateKey = dk.privateKey.toString('hex')
  wallet.encryptedKey = CryptoJS.AES.encrypt(privateKey, password).toString()

  // Generate address and add '0x' prefix
  let keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv)
  wallet.address = '0x' + keyObject.address

  return wallet

}

module.exports.decryptPrivateKey = function(encryptedKey, password) {

  // Decrypt private key and convert it to hex string
  return CryptoJS.AES.decrypt(encryptedKey, password).toString(CryptoJS.enc.Utf8)

}

module.exports.delete = function() {

  // Clear address and encrypted private key from localStorage and reset app completely
  localStorage.clear()
}
