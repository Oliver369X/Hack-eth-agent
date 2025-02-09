const { ethers } = require('ethers');

const wallet = ethers.Wallet.createRandom();
console.log('Dirección:', wallet.address);
console.log('Clave Privada:', wallet.privateKey);