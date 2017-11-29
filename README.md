# Swish Wallet

PoC for an Ethereum web wallet that you can fund via Swedish payment app Swish.

Uses [INFURA](https://www.infura.io) to connect to the Ropsten test net.

Features:
* Generates a private key and an address and stores them in `localStorage`
* Your private key is encrypted with a passphrase (AES-256)
* Your address is displayed in hex and as a QR code
* Your balance is refreshed every 15 seconds and displayed in ETH and SEK
* You can transfer funds to other accounts
* You can perform "mock funding" by clicking "buy ether", which opens the Swish app while simultaneously adding 1 ETH to your account through Metamask's Ropsten faucet.
