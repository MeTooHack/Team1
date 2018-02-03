//import { Connect, MNID, SimpleSigner } from 'uport-connect'
//export { Connect, ConnectCore, QRUtil, SimpleSigner, Credentials, MNID }
const uport = require('uport-connect')

/* global Web3 globalState render */

// Setup

const SimpleSigner = uport.SimpleSigner
const Connect = uport.Connect

const appName = 'Decentralized Coordination'

const connect = new Connect("Coordination", {
  clientId: "2owgyfDGpjzCXZLk75mN4YuRkanSuHUzq7P",
  signer: SimpleSigner("6241073ea14dc124fdd7f6298aaf4a6845a510ebd5c6ee805adc6c1f6fd1d784"),
  network: 'rinkeby'
  })
  
const web3 = connect.getWeb3()

const credentials = connect.credentials

let Identify = {}

Identify.attest = function() {
  credentials.attest({
    sub: globalState.uportId,
    exp: Date.now() + 100000000000,
    claim: {CoordLogin: {PrivKey: 'Ox123', PubKey: '0x4321'}}
  }).then(attestation => {
    console.log(attestation)
    //me.uport:add?attestations=
    let payload = {
      url: 'me.uport:add?attestations=' + attestation
    }
    credentials.push(connect.pushToken, connect.publicEncKey, payload)
    // send attestation to user
  })
}

// Setup the simple Status contract - allows you to set and read a status string
// uPort connect
Identify.connect = function() {
  connect.requestCredentials({
    requested: ['name', 'email', 'CoordLogin'],
    notifications: true // We want this if we want to recieve credentials
  })
  .then((credentials) => {
  // Do something
    console.log(credentials)
    console.log("Credenials:", credentials);
    globalState.uportName = credentials.name;
    globalState.uportId = credentials.address;
    globalState.ethAddress = uport.MNID.decode(credentials.address).address;
    globalState.uportEmail = credentials.email;
    render();
    }, (err) => {
        console.log("Error:", err);
    })
}


// Send ether
const sendEther = () => {
  const value = parseFloat(globalState.sendToVal) * 1.0e18

  web3.eth.sendTransaction(
    {
      to: globalState.sendToAddr,
      value: value
    },
    (error, txHash) => {
      if (error) { throw error }
      globalState.txHashSentEth = txHash
      render()
    }
  )
}

module.exports = Identify