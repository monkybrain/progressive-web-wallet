const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')

// Setup web3
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/0pzfHdAhsqakqtBk8Hs6"))

module.exports.send = function(address, amount, privateKey) {

  // Convert amount to wei
  amount = web3.utils.toWei(amount, 'ether')

  // Get nonce
  let nonce = 0
  web3.eth.getTransactionCount(address)
  .then((count) => {
    nonce = count  
  })

  // Get gas price
  .then(() => web3.eth.getGasPrice())

  // Construct transaction
  .then((gasPrice) => {

    const txParams = {
      nonce: web3.utils.toHex(nonce),
      to: address,
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(290000),
      value: web3.utils.toHex(amount),
      chainId: 3
    }

    // Log params to console
    console.log(txParams)

    // Create and sign transaction
    const tx = new EthereumTx(txParams)
    tx.sign(Buffer.from(privateKey, 'hex'))

    // Return serialized transaction data
    return "0x" + tx.serialize().toString('hex')
  })

  // Send transaction
  .then((txData) => {

    console.log("Tx Data:" + txData)

    web3.eth.sendSignedTransaction(txData, (err, txHash) => {
      console.log("Hash:" + txHash)
      console.log(err)
    })
  })

}
