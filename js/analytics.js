module.exports.sendEvent = function(category, action) {
    console.log("Firing analytics event")
    console.log(window.ga)
    window.ga('send', 'event', category, action)
}
