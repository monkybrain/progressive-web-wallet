module.exports.start = function() {
  console.log("Starting spinner")
  document.getElementById('spinner').removeAttribute('hidden')
}

module.exports.stop = function() {
  console.log("Stopping spinner")
  document.getElementById('spinner').setAttribute('hidden', true)
}
