const Web3 = require('web3')
const nacl = require('tweetnacl')
nacl.util = require('tweetnacl-util')

const abi = [{"constant":true,"inputs":[],"name":"getMyRegistrations","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"revealer","type":"address"}],"name":"getReveal","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"}],"name":"getRegistered","outputs":[{"components":[{"name":"sender","type":"address"},{"name":"pubkey","type":"bytes32"}],"name":"","type":"tuple[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"pubkey","type":"bytes32"}],"name":"Register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ipfs","type":"string"}],"name":"Reveal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

let contract

window.addEventListener('load', function() {
  web3 = new Web3(Web3.givenProvider)
  initContract()
  showRegistrations()
})

function initContract(){
  contract = new web3.eth.Contract(abi, '0x3d7e4728de4ee818575c61c75963d2625f47fc99');
}

function register(el) {

}

function showRegistrations() {
  contract.methods.getMyRegistrations.call((error, result) => {
    document.getElementById('myRegistrations').innerHTML = result
  })
}

