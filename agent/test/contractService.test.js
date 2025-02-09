const { deployContract, executeContractFunction } = require('../src/contractService');

describe('Contract Service', () => {
    let contract;

    beforeAll(async () => {
        contract = await deployContract();
    });

    it('debería desplegar un contrato', async () => {
        expect(contract.address).toBeDefined();
    });

    it('debería ejecutar una función del contrato', async () => {
        const result = await executeContractFunction();
        expect(result).toBe(true); // O el resultado esperado
    });

    it('debería permitir a un usuario unirse a un pasanaco', async () => {
        const result = await executeContractFunction(100); // Unirse con un aporte de 100
        expect(result).toBe(true);
    });
}); 