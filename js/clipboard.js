const Clipboard = require('clipboard')

// Clipboard - address
new Clipboard('#clipboard-address')
  .on('success', (e) => {
    alert('Address copied to clipboard')
  })

// Clipboard - private key
new Clipboard('#clipboard-private-key')
  .on('success', (e) => {
    alert('Private key copied to clipboard')
  })
