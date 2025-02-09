const fetch = require('node-fetch');

// Función para obtener el precio del dólar usando Binance
async function obtenerPrecioDolarBinance() {
    const url = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";
    
    const payload = {
        "asset": "USDT",
        "fiat": "BOB",
        "tradeType": "SELL",
        "payTypes": [],
        "page": 1,
        "rows": 5,
        "publisherType": null
    };

    const headers = {
        "Content-Type": "application/json"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                const precio = parseFloat(data.data[0].adv.price);
                return `💵 Precio actual de USDT en BOB: ${precio} BOB`;
            } else {
                return "No se encontraron ofertas disponibles.";
            }
        } else {
            return "Error al obtener datos de Binance.";
        }
    } catch (error) {
        console.error('Error al obtener precio del dólar:', error);
        return 'Lo siento, no pude obtener la cotización del dólar en este momento.';
    }
}

module.exports = { obtenerPrecioDolarBinance }; 