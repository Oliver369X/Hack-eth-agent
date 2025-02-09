const { obtenerPrecioDolarBinance } = require('../src/priceService');
const fetch = require('node-fetch');

jest.mock('node-fetch');

describe('obtenerPrecioDolarBinance', () => {
    it('debería devolver el precio actual de USDT en BOB', async () => {
        const mockResponse = {
            data: [
                {
                    adv: {
                        price: '6.96' // Simulando un precio de ejemplo
                    }
                }
            ]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockResponse),
        });

        const resultado = await obtenerPrecioDolarBinance();
        expect(resultado).toBe('💵 Precio actual de USDT en BOB: 6.96 BOB');
    });

    it('debería manejar el caso cuando no hay ofertas disponibles', async () => {
        const mockResponse = {
            data: []
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockResponse),
        });

        const resultado = await obtenerPrecioDolarBinance();
        expect(resultado).toBe('No se encontraron ofertas disponibles.');
    });

    it('debería manejar errores de red', async () => {
        fetch.mockRejectedValueOnce(new Error('Error de red'));

        const resultado = await obtenerPrecioDolarBinance();
        expect(resultado).toBe('Lo siento, no pude obtener la cotización del dólar en este momento.');
    });
}); 