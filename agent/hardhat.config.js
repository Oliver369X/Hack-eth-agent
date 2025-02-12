require('@nomiclabs/hardhat-waffle');

module.exports = {
    solidity: "0.8.0",
    networks: {
        sepolia: {
            url: process.env.INFURA_URL,
            accounts: [process.env.AGENT_PRIVATE_KEY]
        }
    }
}; 