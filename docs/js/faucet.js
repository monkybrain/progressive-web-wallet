module.exports.receive = function(address) {
  fetch("https://faucet.metamask.io/", {
    method: "POST",
    body: address
  })
  .then((result) => result.text())
  .then((tx) => console.log(tx))
}
