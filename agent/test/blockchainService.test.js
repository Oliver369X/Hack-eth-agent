const { ethers } = require('ethers');
const BlockchainService = require('../services/blockchainService'); // Asegúrate de tener este servicio

describe('BlockchainService', () => {
    let blockchainService;

    beforeAll(() => {
        blockchainService = new BlockchainService();
    });

    test('debería interactuar con el contrato correctamente', async () => {
        const resultado = await blockchainService.interactuarConContrato('parametro');
        expect(resultado).toBeDefined(); // Cambia esto según lo que esperes
    });
});
