const nacl = require('tweetnacl')
const Identify = require('./identify.js')
nacl.util = require('tweetnacl-util')
const sha3 = require('solidity-sha3').default
const bn = require('bignumber.js')
const enc = require('./enc')
const Promise = require('bluebird')

const abi = [{"constant":true,"inputs":[{"name":"revealer","type":"address"}],"name":"getReveal","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"ipfs","type":"string"}],"name":"reveal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"pubkey","type":"string"},{"name":"sig1","type":"string"},{"name":"sig2","type":"string"}],"name":"register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"},{"name":"i","type":"uint256"}],"name":"getRegisteredSender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"},{"name":"i","type":"uint256"}],"name":"getRegisteredSig1","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"}],"name":"getRegisteredLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"},{"name":"i","type":"uint256"}],"name":"getRegisteredSig2","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getMyRegistrations","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"},{"name":"i","type":"uint256"}],"name":"getRegisteredPubkey","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];

let contract
let address
let uweb3


window.addEventListener('load', function() {
})

function initContract(){
  contract = uweb3.eth.contract(abi).at('0xc984e8D66398aD5b06A9CA1Ed52691b1cA06c243')
  contract = Promise.promisifyAll(contract)
}

window.connect = async function() {
  uweb3 = await Identify.connect()
  initContract()
  showRegistrations()
}

window.register = function(form) {
  let hash = sha3(form.name.value)
  contract.register(hash, globalState.perEncryptionKeyPub, "", "", error => error && console.log(error))

  return false
}

async function reveal(hash) {
  let encryptedList = []
  let result = await contract.getRegisteredLengthAsync(hash)
  let length = new bn(result).toNumber()
  for (let i = 0; i < length; i++) {
    let toPubKey = await contract.getRegisteredPubkeyAsync(hash, i)
    let encrypted = enc.encrypt(toPubKey, globalState.perEncryptionKeyPub, globalState.perEncryptionKeyPriv, globalState.uportEmail)
    encryptedList.push(encrypted)
  }

  let string = JSON.stringify(encryptedList)
  contract.revealAsync(string)
}

function showRegistrations() {
  console.log("0", globalState.ethAddress)
  contract.getMyRegistrations(globalState.ethAddress, (error, registrations) => {
    console.log("1", registrations)
    registrations = [...new Set(registrations)]
    registrations.forEach(r => {
      contract.getRegisteredLength(r, (error, result) => {
        let li = document.createElement('li')
        let n = new bn(result).toNumber()
        let r_short = r.substr(0, 12) + "..."
        li.innerHTML = r_short + " - " + n

        let reveal_button = document.createElement('button')
        reveal_button.onclick = reveal.bind(this, r)
        reveal_button.textContent = "Reveal"
        
        li.appendChild(reveal_button)
        document.getElementById('myRegistrations').appendChild(li)
      })
    })
  })
}

window.decrypt = async function() {
  let reveal = await contract.getRevealAsync(globalState.ethAddress)
  let json = JSON.parse(reveal)
  let decrypted = enc.decrypt(json, globalState.perEncryptionKeyPriv)
  document.getElementById("decrypted").innerHTML = decrypted
}

window.uportConnect = Identify.connect;

window.uportAttest = Identify.attest;
