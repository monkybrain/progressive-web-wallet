module.exports.sendEvent = function(category, action) {
    console.log("Firing analytics event")
    ga('send', 'event', category, action)
}
