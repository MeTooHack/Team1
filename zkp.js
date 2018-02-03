const util = require('ethereumjs-util')
const sha3 = require('solidity-sha3').default


const keypair = {
  privateKey: "0x3686e245890c7f997766b73a21d8e59f6385e1208831af3862574790cbc3d158",
  publicKey: "0x9b7618f0f33c9eca83965bfc8e579754327111f44086d53c70807f610a7fa77d497081b8693c85ef922bca4feb280e96f2aa9fcf5a222a6777832298d2c1a6df",
  address: "0x7f2d6bb19b6a52698725f4a292e985c51cefc315"
}

const sig2str = (sig) => {
  sig.r = sig.r.toString('hex')
  sig.s = sig.s.toString('hex')
  return JSON.stringify(sig)
}

const str2sig = (str) => {
  let jsn = JSON.parse(str)
  return {
    r: Buffer.from(jsn.r, 'hex'),
    s: Buffer.from(jsn.s, 'hex'),
    v: parseInt(jsn.v)
  }
}

let ZkpUtils = {}

ZkpUtils.generateProof = function(realName, address, secretKey) {
  let secretBuffer = Buffer.from(util.stripHexPrefix(secretKey), 'hex')
  let h1 = sha3(realName + address)
  let s1 = util.ecsign(Buffer.from(h1.slice(2), 'hex'), secretBuffer)
  let s1String = sig2str(s1)

  let h2 = sha3(s1String + address)
  let s2 = util.ecsign(Buffer.from(h2.slice(2), 'hex'), secretBuffer)
  let s2String = sig2str(s2)

  return {
    s1: s1String,
    s2: s2String
  }
}

ZkpUtils.verifyProof = function(evilName, address, s1String, s2String, publicKey) {
  let h2 = sha3(s1String + address)
  let s2 = str2sig(s2String)
  let recovered1 = util.ecrecover(Buffer.from(h2.slice(2), 'hex'), s2.v, s2.r, s2.s)

  if (recovered1.toString('hex') === publicKey.slice(2)) {
    //console.log('stage 1 passed')

    let h1 = sha3(evilName + address)
    let s1 = str2sig(s1String)
    let recovered2 = util.ecrecover(Buffer.from(h1.slice(2), 'hex'), s1.v, s1.r, s1.s)

    if (recovered2.toString('hex') !== publicKey.slice(2)) {
      //console.log('stage 2 passed')
      return true
    } else {
      //console.log('stage 2 failed')
    }

  //} else {
    //console.log('stage 1 failed')
  }
  return false
}

module.exports = ZkpUtils

//let res = ZkpUtils.generateProof('asd', '0x234', keypair.privateKey)
//console.log(res)

//let status = ZkpUtils.verifyProof('fds', '0x234', res.s1, res.s2, keypair.publicKey)
//console.log(status)

