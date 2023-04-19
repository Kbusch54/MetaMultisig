require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const QUICKNODE_RPC = process.env.QUICKNODE_RPC;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.7",
  networks: {
    goerli: {
      url: QUICKNODE_RPC,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: "4G9SZJKRDCANUQQNRQ17P3UBE3YZT1E92W",
  },
};
// 0xeF8a41c70c0dA25CC16882c316273a77Ae78b7C4
