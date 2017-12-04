const Instascan = require('instascan')

// Setup qr scanner div
var scanner = new Instascan.Scanner({
  video: document.getElementById('video-scanner'),
  mirror: false
});

// Update list of cameras
var cameras = []
var cameraIndex = 0
Instascan.Camera.getCameras()
.then((result) => {
  cameras = result
  console.log(cameras)
})

module.exports.scan = function() {

  return new Promise((resolve, reject) => {

    // On scanned QR code -> resolve with content
    scanner.addListener('scan', (content) => {
      console.log("QR content: " + content)
      scanner.stop()
      resolve(content)
    });

    // If cameras found -> scan with selected camera
    if (cameras.length > 0) {
      scanner.start(cameras[cameraIndex])
    } else {
      alert('No cameras found')
      reject()
    }
  })
}

module.exports.stop = function() {
  scanner.stop()
}

module.exports.switchCamera = function() {

  // If more than one camera
  if (cameras.length > 0) {

    // Increment camera index by 1
    cameraIndex++
    cameraIndex = cameraIndex == cameras.length ? 0 : cameraIndex
    console.log("Camera index: " + cameraIndex)

    // Restart scanner
    scanner.stop()
    module.exports.scan()
  }

}
