const Instascan = require('instascan')

var scanner = new Instascan.Scanner({
  video: document.getElementById('scanner'),
  mirror: false
});

module.exports.scan = function(cameraIndex) {

  return new Promise((resolve, reject) => {

    scanner.addListener('scan', (content) => {
      console.log("QR content: " + content)
      resolve(content)
    });

    Instascan.Camera.getCameras()
    .then((cameras) => {
      if (cameras.length > 0) {
        scanner.start(cameras[cameraIndex])
      } else {
        alert('No cameras found')
        reject()
      }
    })

  })
}

module.exports.stop = function() {
  scanner.stop()
}
