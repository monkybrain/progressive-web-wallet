module.exports.receive = function(address) {

  // Make HTTP POST request
  return fetch("https://faucet.metamask.io/", {
    method: "POST",
    body: address
  })

  // Resolve with Tx Hash
  .then((result) => result.text())
}
