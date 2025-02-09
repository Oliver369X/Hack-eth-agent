const { ethers } = require('ethers');

let provider;

const contractAddress = '0x900Cd8B955d88fD7b805eDcA939f0BFB069946bd'; // Dirección del contrato
const contractABI = [
    // ABI del contrato
    {
        "inputs": [
            { "internalType": "uint256", "name": "_montoContribucion", "type": "uint256" },
            { "internalType": "bool", "name": "_esPublica", "type": "bool" }
        ],
        "name": "crearSala",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "salaId", "type": "uint256" }],
        "name": "unirseSala",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    // Agrega el resto de las funciones del ABI aquí...
];

// Crear una instancia del contrato
let contract;

async function setNetwork(url) {
    try {
        provider = new ethers.providers.JsonRpcProvider(url);
        await provider.getNetwork();
        console.log('Conectado exitosamente a la red');
    } catch (error) {
        console.error('Error al conectar con la red:', error);
        throw error;
    }
}

async function createWallet() {
    const wallet = ethers.Wallet.createRandom();
    if (provider) {
        return wallet.connect(provider);
    }
    return wallet;
}

async function connectWallet(privateKey) {
    try {
        if (!provider) {
            throw new Error('Provider no inicializado. Llama a setNetwork primero.');
        }
        const wallet = new ethers.Wallet(privateKey, provider);
        return wallet;
    } catch (error) {
        console.error("Error connecting wallet:", error);
        return null;
    }
}

async function getWalletAddress(wallet) {
    return wallet.address;
}

async function getWalletBalance(wallet) {
    try {
        if (!provider) {
            throw new Error('Provider no inicializado. Llama a setNetwork primero.');
        }
        const balance = await provider.getBalance(wallet.address);
        return ethers.utils.formatEther(balance);
    } catch (error) {
        console.error('Error al obtener el balance:', error);
        throw error;
    }
}

async function sendTransaction(wallet, toAddress, amount) {
    try {
        if (!provider) {
            throw new Error('Provider no inicializado. Llama a setNetwork primero.');
        }
        const tx = {
            to: toAddress,
            value: ethers.parseEther(amount.toString()),
        };

        const transactionResponse = await wallet.sendTransaction(tx);
        await transactionResponse.wait();
        return transactionResponse;
    } catch (error) {
        console.error('Error al enviar la transacción:', error);
        throw error;
    }
}

async function initializeContract() {
    if (!provider) {
        throw new Error('Provider no inicializado. Llama a setNetwork primero.');
    }
    contract = new ethers.Contract(contractAddress, contractABI, provider);
}

// Función para crear una sala
async function crearSala(montoContribucion, esPublica) {
    if (!contract) {
        await initializeContract();
    }
    const signer = provider.getSigner(); // Obtener el signer
    const contractWithSigner = contract.connect(signer); // Conectar el contrato al signer
    const tx = await contractWithSigner.crearSala(montoContribucion, esPublica);
    await tx.wait(); // Esperar a que la transacción se confirme
    return tx; // Retornar la transacción
}

// Función para unirse a una sala
async function unirseSala(salaId, montoDeposito) {
    if (!contract) {
        await initializeContract();
    }
    const signer = provider.getSigner(); // Obtener el signer
    const contractWithSigner = contract.connect(signer); // Conectar el contrato al signer
    const tx = await contractWithSigner.unirseSala(salaId, { value: montoDeposito });
    await tx.wait(); // Esperar a que la transacción se confirme
    return tx; // Retornar la transacción
}

module.exports = {
    setNetwork,
    createWallet,
    connectWallet,
    getWalletAddress,
    getWalletBalance,
    sendTransaction,
    crearSala,
    unirseSala,
    initializeContract
}; 