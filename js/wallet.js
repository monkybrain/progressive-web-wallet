const keythereum = require('keythereum')
const CryptoJS = require('crypto-js')

module.exports.generate = function(password) {

  // Generate private key
  let dk = keythereum.create()

  // Encrypt and store private key
  let privateKey = dk.privateKey.toString('hex')
  let encryptedKey = CryptoJS.AES.encrypt(privateKey, password)
  localStorage.setItem('privateKey', encryptedKey)

  // Generate and store address + key object
  let keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv)
  localStorage.setItem("address", "0x" + keyObject.address)

}

module.exports.decryptPrivateKey = function(password) {

  // Fetch encrypted key from localStorage
  let encryptedKey = localStorage.getItem("privateKey")

  // Decrypt private key and convert it from buffer to hex string
  return CryptoJS.AES.decrypt(encryptedKey, password).toString(CryptoJS.enc.Utf8)

}

module.exports.delete = function() {

  // Clear address and encrypted private key from localStorage
  localStorage.clear()
}
