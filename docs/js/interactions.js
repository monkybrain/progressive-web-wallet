window.setPage = function(page) {

  switch (page) {

    case "main":
      hide(document.getElementById("content-new-wallet"))
      show(document.getElementById("content-main"))
      hide(document.getElementById("content-send"))
      hide(document.getElementById("content-tx"))
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
