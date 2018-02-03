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

Encryption.encrypt = function(toPubKey, fromPubKey, fromPrivKey, clearText) {
  const decodedToPub = nacl.util.decodeBase64(toPubKey)
  const decodedFromPriv = nacl.util.decodeBase64(fromPrivKey)
  const decodedMsg = nacl.util.decodeUTF8(clearText)
  const nonce = nacl.randomBytes(24)

  const ciphertext = nacl.box(decodedMsg, nonce, decodedToPub, decodedFromPriv)
  return {
    from: fromPubKey,
    nonce: nacl.util.encodeBase64(nonce),
    ciphertext: nacl.util.encodeBase64(ciphertext)
  }
}

Encryption.decrypt = function(encObj, toPrivKey) {
  const decodedToPriv = nacl.util.decodeBase64(toPrivKey)
  const decodedFromPub = nacl.util.decodeBase64(encObj.from)
  const decodedNonce = nacl.util.decodeBase64(encObj.nonce)
  const box = nacl.util.decodeBase64(encObj.ciphertext)

  const clearText = nacl.box.open(box, decodedNonce, decodedFromPub, decodedToPriv)

  return nacl.util.encodeUTF8(clearText)
}

module.exports = Encryption

//let kp1 = Encryption.generateKeyPair()
//let kp2 = Encryption.generateKeyPair()
//console.log(kp1, kp2)

//let encObj = Encryption.encrypt(kp1.publicKey, kp2.publicKey, kp2.secretKey, 'asdfasdf')
//console.log(encObj)

//let cleartxt = Encryption.decrypt(encObj, kp1.secretKey)
//console.log(cleartxt)
