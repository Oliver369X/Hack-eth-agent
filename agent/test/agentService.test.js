const AgentService = require('../services/agentService');
const dispositivoService = require('../services/dispositivoService');

// Simular el servicio de dispositivo
jest.mock('../services/dispositivoService');

describe('AgentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debería procesar consulta de temperatura correctamente', async () => {
        dispositivoService.obtenerTemperatura.mockResolvedValue({
            area: 'T1M',
            temperatura: 25,
            unidad: '°C',
            ultima_lectura: new Date().toISOString(),
        });

        const respuesta = await AgentService.procesarConsulta('¿Cuál es la temperatura en T1M?', '12345');
        expect(respuesta).toContain('Temperatura en T1M: 25°C');
    });

    test('debería procesar consulta de humedad correctamente', async () => {
        dispositivoService.obtenerHumedad.mockResolvedValue({
            area: 'T2A',
            humedad: 50,
            unidad: '%',
            ultima_lectura: new Date().toISOString(),
        });

        const respuesta = await AgentService.procesarConsulta('¿Cuál es la humedad en T2A?', '12345');
        expect(respuesta).toContain('Humedad en T2A: 50%');
    });

    test('debería manejar consultas no reconocidas', async () => {
        const respuesta = await AgentService.procesarConsulta('¿Qué es esto?', '12345');
        expect(respuesta).toContain('Lo siento, hubo un error al procesar tu consulta.');
    });
});
