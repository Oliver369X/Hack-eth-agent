// index.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const OpenAI = require('openai');
const qrcode = require('qrcode-terminal');
const fetch = require('node-fetch');
const { obtenerPrecioDolarBinance } = require('./src/priceService');
const QRCode = require('qrcode');
const { deployContract, executeContractFunction } = require('./src/contractService');
const { createWallet, connectWallet, getWalletAddress, getWalletBalance, setNetwork, crearSala, unirseSala } = require('./src/walletService'); // Import wallet functions
require('dotenv').config();
const { ethers } = require('ethers');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox']
    }
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Global variable to store the agent's wallet
let agentWallet = null;

client.on('qr', (qr) => {
    console.log('Escanea este código QR en WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('¡Cliente de WhatsApp listo y conectado!');

    // Cambiar a la red Sepolia
    await setNetwork(process.env.INFURA_URL); // Usar la URL de Alchemy

    // Initialize the agent's wallet
    await initializeAgentWallet();

    // Mostrar dirección y saldo de la wallet
    if (agentWallet) {
        const address = await getWalletAddress(agentWallet);
        const balance = await getWalletBalance(agentWallet);
        console.log(`Dirección de la wallet: ${address}`);
        console.log(`Saldo de la wallet: ${balance} ETH`);
    }
});

// --- Wallet Initialization ---
async function initializeAgentWallet() {
    // Hardcodear la dirección y la clave privada
    const hardcodedPrivateKey = '0x6c2c7da012e1759d5d00c8743385a0f32bbb0a41c1dfc63e3c941a80dd1d0542'; // Clave privada
    const hardcodedAddress = '0x448B642F07Bd0d8f15e055A7Fb59580Fc5585288'; // Dirección

    // Usar la clave privada hardcodeada para conectar la wallet
    agentWallet = await connectWallet(hardcodedPrivateKey);
    if (agentWallet) {
        console.log('Agente: Wallet conectada:', agentWallet.address);
        console.log('Dirección de la wallet:', agentWallet.address);
        console.log('Clave Privada:', hardcodedPrivateKey); // Imprimir clave privada
    } else {
        console.log('Agente: No se pudo conectar la wallet. Verifique la clave privada.');
        process.exit(1); // Salir si no se puede conectar
    }
}

// --- Rest of your agent logic ---
async function obtenerPrecioDolar() {
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

async function generarQR(monto) {
    const precio1 = parseFloat(data.data[0].adv.price);
    const precioMercado = precio1; // Precio paralelo
    const totalAPagar = monto * precioMercado; // Total a pagar
    const qrData = `Deposito: ${totalAPagar.toFixed(2)} BOB`; // Datos del QR

    try {
        const qrCode = await QRCode.toDataURL(qrData);
        return qrCode; // Devuelve el QR como una URL de imagen
    } catch (error) {
        console.error('Error generando QR:', error);
        return null;
    }
}

client.on('message', async (message) => {
    try {
        const messageText = message.body.toLowerCase();

        // Presentación del agente
        if (messageText.includes('hola') || messageText.includes('buenas') || messageText.includes('hey')) {
            await message.reply('¡Hola! 👋 Soy el agente Pasacoin, tu asistente financiero. Estoy aquí para ayudarte con tus ahorros y créditos. ¿En qué puedo ayudarte hoy?');
            return;
        }

        // Respuesta a preguntas sobre precios
        if (messageText.includes('precio usdt') || messageText.includes('dólar blue')) {
            const precioDolar = await obtenerPrecioDolarBinance();
            await message.reply(`El precio actual de USDT es: ${precioDolar}`);
            return;
        }

        // Respuesta a preguntas sobre ahorro
        if (messageText.includes('ahorro')) {
            await message.reply('¡Hola! 😊 Ahorrar es una gran decisión. ¿Sabías que con Pasacoin puedes gestionar tus ahorros de manera segura y transparente?');
            return;
        }

        // Respuesta a preguntas sobre créditos
        if (messageText.includes('crédito')) {
            await message.reply('¡Claro! 💳 Pasacoin te ayuda a acceder a créditos asequibles. ¿Te gustaría saber más sobre cómo funciona?');
            return;
        }

        // Respuesta a preguntas sobre la plataforma
        if (messageText.includes('pasacoin')) {
            await message.reply('Pasacoin es una plataforma innovadora que moderniza los pasanacos. ¡Es fácil de usar y segura! ¿Te gustaría registrarte?');
            return;
        }

        // Respuesta a preguntas generales
        if (messageText.includes('cuéntame sobre pasacoin') || messageText.includes('información sobre pasacoin')) {
            const info = require('./data/pasacoinInfo.json');
            await message.reply(info.descripcion);
            return;
        }

        // Comandos existentes
        if (messageText === '!dolar' || messageText === '!usd') {
            const precioDolar = await obtenerPrecioDolarBinance();
            await message.reply(precioDolar);
            return;
        }

        // Respuesta a preguntas sobre el precio de USDT
        if (messageText.includes('cuánto es el precio de usdt')) {
            const precioDolar = await obtenerPrecioDolarBinance();
            await message.reply(`El precio actual de USDT es: ${precioDolar}`);
            return;
        }

        if (messageText.startsWith('!gpt ')) {
            const userMessage = message.body.slice(5);
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userMessage }],
            });

            const gptMessage = response.choices[0].message.content;
            await message.reply(gptMessage);
            return;
        }

        if (messageText.startsWith('!pasacoin ')) {
            const contrato = messageText.slice(10);
            // Aquí puedes agregar la lógica para interactuar con el contrato inteligente
            await message.reply(`Interacción con el contrato inteligente: ${contrato}`);
            return;
        }

        if (messageText === '!ayuda' || messageText === '!help') {
            const ayuda = `📱 *Comandos disponibles:*\n\n` +
                         `!dolar - Consultar precio del dólar\n` +
                         `!gpt [mensaje] - Consultar a ChatGPT\n` +
                         `!pasacoin [contrato] - Interactuar con el contrato inteligente\n` +
                         `!ayuda - Mostrar este mensaje`;
            await message.reply(ayuda);
        }

        // Uso en el mensaje
        if (messageText.includes('pagar')) {
            const qrCode = await generarQR(10); // Por ejemplo, para un pago de 10$
            if (qrCode) {
                await message.reply(`Aquí está tu código QR para el pago:\n${qrCode}`);
            } else {
                await message.reply('Lo siento, no pude generar el código QR en este momento.');
            }
        }

        // Lógica para manejar comandos de wallet y contratos
        if (messageText.startsWith('!pasanaco crear')) {
            const contract = await deployContract();
            await message.reply(`Pasanaco creado con éxito. Dirección del contrato: ${contract.address}`);
            return;
        }

        if (messageText.startsWith('!pasanaco unirse')) {
            const monto = parseFloat(messageText.split(' ')[2]);
            await executeContractFunction(monto); // Lógica para unirse al pasanaco
            await message.reply(`Te has unido al pasanaco con un aporte de ${monto} BOB.`);
            return;
        }

        if (messageText.startsWith('!enviar ')) {
            const [_, recipient, amount] = messageText.split(' '); // !enviar 0x123... 0.01
            const txResponse = await sendTransaction(agentWallet, recipient, amount);
            await message.reply(`Transacción enviada: ${txResponse.hash}`);
            return;
        }

        // Comando para consultar el saldo de la wallet
        if (messageText === '!saldo') {
            const balance = await getWalletBalance(agentWallet);
            await message.reply(`Tu saldo actual es: ${balance} ETH`);
            console.log(`Saldo de la wallet: ${balance} ETH`); // Imprimir en la terminal
            return;
        }

        // Comando para crear una sala
        if (messageText.startsWith('!crear sala ')) {
            const [_, montoContribucion, esPublica] = messageText.split(' '); // !crear sala 100 true
            const txResponse = await crearSala(parseInt(montoContribucion), esPublica === 'true');
            await message.reply(`Sala creada con éxito. Transacción: ${txResponse.hash}`);
            return;
        }

        // Comando para unirse a una sala
        if (messageText.startsWith('!unirse sala ')) {
            const [_, salaId, montoDeposito] = messageText.split(' '); // !unirse sala 0 10
            const txResponse = await unirseSala(parseInt(salaId), ethers.utils.parseEther(montoDeposito));
            await message.reply(`Te has unido a la sala con éxito. Transacción: ${txResponse.hash}`);
            return;
        }

    } catch (error) {
        console.error('Error procesando mensaje:', error);
        await message.reply('Lo siento, ocurrió un error al procesar tu solicitud. 😔');
    }
});

client.on('auth_failure', (error) => {
    console.error('Error de autenticación:', error);
});

client.initialize().catch(error => {
    console.error('Error al inicializar el cliente:', error);
});

process.on('SIGINT', async () => {
    console.log('Cerrando aplicación...');
    await client.destroy();
    process.exit(0);
});

async function getUsers() {
    // Simulación de usuarios. En un caso real, esto podría ser una consulta a una base de datos.
    return [
        { chatId: '123456789@c.us' }, // Reemplaza con IDs de chat reales
        { chatId: '987654321@c.us' }
    ];
}

const NOTIFICATION_INTERVAL = 24 * 60 * 60 * 1000; // 1 día en milisegundos

setInterval(async () => {
    const users = await getUsers(); // Implementa esta función para obtener los usuarios
    for (const user of users) {
        await client.sendMessage(user.chatId, '🔔 Recordatorio: Es hora de realizar tu pago. ¡No olvides hacerlo a tiempo!');
    }
}, NOTIFICATION_INTERVAL);