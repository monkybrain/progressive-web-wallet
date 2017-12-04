const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')

// Setup web3
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/0pzfHdAhsqakqtBk8Hs6"))

module.exports.send = function(to, amount, privateKey) {

  // Get address from localStorage
  let address = localStorage.getItem("address")

  // Get nonce
  let nonce = 0

  return web3.eth.getTransactionCount(address)
  .then((count) => {
    nonce = count
    console.log("Nonce: " + nonce)
  })

  // Get recommended gas price
  .then(() => web3.eth.getGasPrice())

  // Construct transaction
  .then((gasPrice) => {

    // Log gas price
    console.log("Gas price: " + gasPrice)

    // Convert amount to wei
    amount = web3.utils.toWei(amount, 'ether')

    const txParams = {
      nonce: web3.utils.toHex(nonce),
      to: to,
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

  // Send transaction and resolve promise chain with Tx Hash
  .then(function(txData) {

    return new Promise((resolve, reject) => {
      web3.eth.sendSignedTransaction(txData)
      .on('transactionHash', (txHash) => resolve(txHash))
      .on('error', (err) => reject(err))
    })
  })

}
