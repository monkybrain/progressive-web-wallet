# Swish Wallet

PoC for an Ethereum web wallet that you can fund via Swedish payment app Swish.

Uses [INFURA](https://www.infura.io) to connect to the Ropsten test net.

Features:
* Generates a private key and an address and stores them in `localStorage`
* Your private key is encrypted with a passphrase (AES-256)
* Your address is displayed in hex and as a QR code
* Refreshes balance every 15 seconds, displayed in ETH and SEK
* Allows you to transfer funds to other accounts
* Allows you to perform "mock funding" by opening the Swish app and simultaneously adding 1 ETH to your account through Metamask's Ropsten faucet.
