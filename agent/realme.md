# Hack Eth Agent

This project is a WhatsApp bot that interacts with a smart contract on the Scroll Sepolia testnet. The bot can create and join rooms, check wallet balances, and more.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16.x or 18.x recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Hardhat](https://hardhat.org/) (for smart contract development and testing)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/hack-eth-agent.git
   cd hack-eth-agent
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file:**

   Create a `.env` file in the root directory of the project and add the following variables:

   ```plaintext
   INFURA_URL=https://scroll-sepolia.g.alchemy.com/v2/your-alchemy-api-key
   AGENT_PRIVATE_KEY=your-wallet-private-key
   OPENAI_API_KEY=your-openai-api-key
   ```

   Replace `your-alchemy-api-key`, `your-wallet-private-key`, and `your-openai-api-key` with your actual keys.

## Running the Agent

1. **Start the Hardhat node (optional):**

   If you want to test locally, you can start a Hardhat node:

   ```bash
   npx hardhat node
   ```

2. **Run the agent:**

   In a new terminal window, run the following command to start the WhatsApp agent:

   ```bash
   node index.js
   ```

3. **Scan the QR code:**

   When prompted, scan the QR code with your WhatsApp mobile app to authenticate.

## Commands

- `!saldo`: Check the current wallet balance.
- `!crear sala <montoContribucion> <esPublica>`: Create a new room with the specified contribution amount and visibility.
- `!unirse sala <salaId> <montoDeposito>`: Join an existing room with the specified ID and deposit amount.
- `!dolar`: Get the current price of the dollar.
- `!gpt <message>`: Ask a question to ChatGPT.
- `!ayuda`: Show available commands.

## Testing

To run the unit tests for the smart contract, use the following command:
