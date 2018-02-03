const nacl = require('tweetnacl')
nacl.util = require('tweetnacl-util')

let Encryption = {}

Encryption.generateKeyPair = function() {
  let kp = nacl.box.keyPair()
  return {
    publicKey: nacl.util.encodeBase64(kp.publicKey),
    secretKey: nacl.util.encodeBase64(kp.secretKey)
  }
}

Encryption.encrypt = function(toPubKey, fromPrivKey, clearText) {
}

let kp = Encryption.generateKeyPair()
console.log(kp)
