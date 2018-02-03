pragma solidity ^0.4.0;
contract HashtagHackers {
    struct Registration {
        address sender;
        string pubkey;
        string sig1;
        string sig2;
    }
    
    mapping(bytes32 => Registration[]) registered;
    mapping(address => bytes32[]) registrations;
    mapping(address => string) revealed;
    
    function register(bytes32 hash, string pubkey, string sig1, string sig2) public {
        registered[hash].push(Registration(msg.sender, pubkey, sig1, sig2));
        registrations[msg.sender].push(hash);
    }
    
    function reveal(string ipfs) public {
        revealed[msg.sender] = ipfs;
    }
    
    function getRegisteredLength(bytes32 hash) public constant returns (uint) {
        return registered[hash].length;
    }
    
    function getRegisteredSender(bytes32 hash, uint i) public constant returns (address) {
        return registered[hash][i].sender;
    }
    
    function getRegisteredPubkey(bytes32 hash, uint i) public constant returns (string) {
        return registered[hash][i].pubkey;
    }
    
    function getRegisteredSig1(bytes32 hash, uint i) public constant returns (string) {
        return registered[hash][i].sig1;
    }
    
    function getRegisteredSig2(bytes32 hash, uint i) public constant returns (string) {
        return registered[hash][i].sig2;
    }
    
    function getReveal(address revealer) public constant returns (string) {
        return revealed[revealer];
    }
    
    function getMyRegistrations() public constant returns (bytes32[]) {
        return registrations[msg.sender];
    }
}

