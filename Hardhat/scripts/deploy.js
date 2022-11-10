// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  let MultiSigFactoryContractFactory = await ethers.getContractFactory(
    "MultiSigFactory"
  );
  MultiSigFactory = await MultiSigFactoryContractFactory.deploy();

  console.log(
    "MultiSig factory deployed at =>",
    MultiSigFactoryDeployed.address
  );

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  // try {
  //   if (chainId !== localChainId) {
  //     await run("verify:verify", {
  //       address: YourContract.address,
  //       contract: "contracts/YourContract.sol:YourContract",
  //       contractArguments: [],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};
module.exports.tags = ["MultiSigFactory", "MultiSigWallet"];
