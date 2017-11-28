const wallet = require('./wallet.js')
const ui = require('./ui.js')
const spinner = require('./spinner.js')

window.setPage = function(page) {

  switch (page) {

    case "main":
      hide(document.getElementById("content-new-wallet"))
      show(document.getElementById("content-main"))
      hide(document.getElementById("content-send"))
      hide(document.getElementById("content-tx"))
      document.getElementById("input-send-address").value = ""
      document.getElementById("input-send-amount").value = ""
      ui.refresh()
      break

    case "send":
      hide(document.getElementById("content-new-wallet"))
      hide(document.getElementById("content-main"))
      show(document.getElementById("content-send"))
      hide(document.getElementById("content-tx"))
      break

    case "tx":
      hide(document.getElementById("content-new-wallet"))
      hide(document.getElementById("content-main"))
      hide(document.getElementById("content-send"))
      show(document.getElementById("content-tx"))
      break

    default:

  }
}

window.deleteWallet = function() {
  if (confirm('Är du säker på att du vill radera din wallet?')) {
    localStorage.clear()
    location.reload()
  }
}

window.generateWallet = function() {
  var pw = document.getElementById("input-new-password").value
  spinner.start()
  setTimeout(function() {
    wallet.generateWallet(pw)
    spinner.stop()
    setPage('main')
  }, 1000)


}

/* Privte functions */
var hide = function(el) {
  el.setAttribute("hidden", true)
}

var show = function(el) {
  el.removeAttribute("hidden")
}

var clear = function(el) {
  el.value = ""
}
