const wallet = require('./wallet.js')
const ui = require('./ui.js')

window.setPage = function(page) {

  switch (page) {

    case "main":
      hide(document.getElementById("content-new-wallet"))
      show(document.getElementById("content-main"))
      hide(document.getElementById("content-send"))
      hide(document.getElementById("content-tx"))
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
  localStorage.clear()
  location.reload()
}

window.generateWallet = function() {
  var pw = document.getElementById("input-new-password").value
  wallet.generateWallet(pw)
  setPage('main')
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
