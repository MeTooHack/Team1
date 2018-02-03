const abi = [{"constant":true,"inputs":[],"name":"getMyRegistrations","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"revealer","type":"address"}],"name":"getReveal","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"}],"name":"getRegistered","outputs":[{"components":[{"name":"sender","type":"address"},{"name":"pubkey","type":"bytes32"}],"name":"","type":"tuple[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"pubkey","type":"bytes32"}],"name":"Register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ipfs","type":"string"}],"name":"Reveal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

let contract

function initContract(){
  contract = web3.eth.contract(abi).at('0x3d7e4728de4ee818575c61c75963d2625f47fc99');
}

function register(el) {

}

function showRegistrations() {
  contract.getMyRegistrations.call((error, result) => {
    document.getElementById('myRegistrations').innerHTML = result
  })
}

