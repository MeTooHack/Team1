pragma solidity ^0.4.0;
contract HashtagHackers {
    struct Registration {
        address sender;
        bytes32 pubkey;
    }
    
    mapping(bytes32 => Registration[]) registered;
    mapping(address => bytes32[]) registrations;
    mapping(address => string) revealed;
    
    function Register(bytes32 hash, bytes32 pubkey) public {
        uint256 registeredIndex = registered[hash].length;
        registered[hash][registeredIndex] = Registration(msg.sender, pubkey);
        uint256 registrationIndex = registrations[msg.sender].length;
        registrations[msg.sender][registrationIndex] = hash;
    }
    
    function Reveal(string ipfs) public {
        revealed[msg.sender] = ipfs;
    }
    
    function getRegistered(bytes32 hash) public constant returns (Registration[]) {
        return registered[hash];
    }
    
    function getReveal(address revealer) public constant returns (string) {
        return revealed[revealer];
    }
    
    function getMyRegistrations() public constant returns (bytes32[]) {
        return registrations[msg.sender];
    }
}

