const { createWallet, connectWallet, getWalletAddress, getWalletBalance, sendTransaction, setNetwork } = require('../src/walletService');
require('dotenv').config();

describe('Wallet Service', () => {
    let wallet;

    beforeAll(async () => {
        await setNetwork('https://scroll-sepolia.g.alchemy.com/v2/oHVu6rW1TygUwwIg_WYG5I9-qDEQNzUQ');
    });

    it('debería crear una nueva wallet', async () => {
        wallet = await createWallet();
        expect(wallet).toHaveProperty('address');
    });

    it('debería conectar a una wallet existente', async () => {
        const privateKey = wallet.privateKey;
        const connectedWallet = await connectWallet(privateKey);
        expect(connectedWallet).toHaveProperty('address');
        expect(connectedWallet.address).toBe(wallet.address);
    });

    it('debería devolver la dirección de la wallet', async () => {
        const address = await getWalletAddress(wallet);
        expect(address).toBe(wallet.address);
    });

    it('debería devolver el saldo de la wallet', async () => {
        const balance = await getWalletBalance(wallet);
        expect(parseFloat(balance)).toBeGreaterThanOrEqual(0);
    });

    // Comentamos temporalmente la prueba de transacción hasta que tengamos fondos
    /*
    it('debería enviar una transacción', async () => {
        const recipientAddress = '0x1234567890123456789012345678901234567890';
        const amountToSend = 0.01;

        const initialBalance = await getWalletBalance(wallet);
        expect(parseFloat(initialBalance)).toBeGreaterThan(amountToSend);

        const txResponse = await sendTransaction(wallet, recipientAddress, amountToSend);
        expect(txResponse).toHaveProperty('hash');
    });
    */
}); 