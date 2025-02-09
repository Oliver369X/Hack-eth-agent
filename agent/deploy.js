const { ethers } = require('ethers');
const Pasanaco = require('./src/blockchain/contracts/Pasanaco.json');

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const factory = new ethers.ContractFactory(Pasanaco.abi, Pasanaco.bytecode, wallet);
    const contract = await factory.deploy();
    await contract.deployed();
    console.log(`Contrato desplegado en: ${contract.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
}); 