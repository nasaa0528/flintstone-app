require('dotenv').config({path:'../.env'})

const AesEncryption = require('aes-encryption')
const HDWalletProvider = require('@truffle/hdwallet-provider');
const aes = new AesEncryption()
aes.setSecretKey(process.env.AES_SECRET_KEY)
const privateKey = aes.decrypt(process.env.ENC_TEXT)

const mumbaiProvider = 'https://speedy-nodes-nyc.moralis.io/25eb75ca5c4208778bf16b23/polygon/mumbai/'
const polygonProvider = 'https://polygon-mainnet.g.alchemy.com/v2/nnmCdWUkCQcFJ1i0egiT3dCgKp8RMODw/'

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //

    development: {
      host: "localhost",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },

    mumbai: {
      provider: () => new HDWalletProvider(privateKey, mumbaiProvider),
      network_id: 80001,
      skipDryRun: true
    },

    polygon: {
      provider: () => new HDWalletProvider(privateKey, polygonProvider),
      network_id: 137,
      skipDryRun: true,
      confirmations: 10,
      timeoutBlocks: 200,
      // gasPrice: 32000000000
      // gasPrice: 45000000000
      gasPrice: 450000000000
    },
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    polygonscan: process.env.POLYGONSCAN_API_KEY
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.8.7",      // Fetch exact version from solc-bin (default: truffle's version)
      docker: false,           // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 200
       },
      //  evmVersion: "byzantium"
      }
    }
  },
};
