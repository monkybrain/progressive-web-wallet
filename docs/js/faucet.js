module.exports.receive = function(address) {
  return fetch("https://faucet.metamask.io/", {
    method: "POST",
    body: address
  })
  .then((result) => result.text())
}
