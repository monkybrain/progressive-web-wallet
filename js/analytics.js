module.exports.sendEvent = function(category, action) {
    console.log("Firing analytics event")
    console.log(window.ga)
    window.ga('send', {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      nonInteraction: true
    })
}
