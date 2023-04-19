const { ethers } = require("hardhat");

async function main() {
  let MultiSigFactoryContractFactory = await ethers.getContractFactory(
    "MultiSigFactory"
  );
  console.log("Running");
  MultiSigFactory = await MultiSigFactoryContractFactory.deploy();
  await MultiSigFactory.deployed();

  console.log("MultiSig factory deployed at =>", MultiSigFactory.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// 0x0FdA81B437C7878b64AbD79D95Faeb24663fE07f
