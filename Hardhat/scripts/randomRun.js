require("dotenv").config({ path: ".env" });

const { AlchemyProvider } = require("@ethersproject/providers");
const hre = require("hardhat");
const { ethers } = require("hardhat");
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const QUICKNODE_RPC = process.env.QUICKNODE_RPC;

async function main() {
  let MultiSig = await ethers.getContractFactory("MultiSigFactory");
  const contract = MultiSig.attach(
    "0xeF8a41c70c0dA25CC16882c316273a77Ae78b7C4"
  );
  const ALCHEMY_API = "NX0zVuIVZSWreJ9zbABIAfjF8ZTim44Y";
  let kb = new ethers.Wallet(PRIVATE_KEY);
  // console.log("is signer:", kb._isSigner);

  const provider = new AlchemyProvider("goerli", ALCHEMY_API);
  let kbPro = kb.connect(provider);

  let CONTRACT_NAME = "Bubba2";
  let signatureRequired = 1;

  let address = kbPro.address;

  let [multiSigWalletAddress] = await contract.getMultiSig(0);
  // console.log(multiSigWalletAddress);

  let MultiSigWallet = (await ethers.getContractFactory("MetaMultiSig")).attach(
    multiSigWalletAddress
  );

  getAddSignerHash = async (newSignerAddress, newSignaturesRequired) => {
    let nonce = await MultiSigWallet.nonce();
    let to = MultiSigWallet.address;
    let value = "0x0";

    let callData = getAddSignerCallData(
      newSignerAddress,
      newSignaturesRequired
    );
    console.log("nonce: ", nonce);
    console.log("to: ", to);
    console.log("value: ", value);
    console.log("callData: ", callData);

    return await MultiSigWallet.getTransactionHash(nonce, to, value, callData);
  };

  getRemoveSignerHash = async (oldSignerAddress, newSignaturesRequired) => {
    let nonce = await MultiSigWallet.nonce();
    let to = MultiSigWallet.address;
    let value = "0x0";

    let callData = getRemoveSignerCallData(
      oldSignerAddress,
      newSignaturesRequired
    );

    return await MultiSigWallet.getTransactionHash(nonce, to, value, callData);
  };

  getAddSignerCallData = (newSignerAddress, newSignaturesRequired) => {
    return MultiSigWallet.interface.encodeFunctionData("addSigner", [
      newSignerAddress,
      newSignaturesRequired,
    ]);
  };

  getRemoveSignerCallData = (oldSignerAddress, newSignaturesRequired) => {
    return MultiSigWallet.interface.encodeFunctionData("removeSigner", [
      oldSignerAddress,
      newSignaturesRequired,
    ]);
  };

  getSortedOwnerAddressesArray = async () => {
    let ownerAddressesArray = [];

    for (let i = 0; ; i++) {
      try {
        ownerAddressesArray.push(await MultiSigWallet.owners(i));
      } catch {
        break;
      }
    }

    return ownerAddressesArray.sort();
  };

  getSignaturesArray = async (hash) => {
    let signaturesArray = [];

    let sortedOwnerAddressesArray = await getSortedOwnerAddressesArray();

    for (ownerAddress of sortedOwnerAddressesArray) {
      let ownerProvider = (await ethers.getSigner(owner.address)).provider;

      signaturesArray.push(
        await ownerProvider.send("personal_sign", [hash, ownerAddress])
      );
    }

    return signaturesArray;
  };

  //getsignerHash
  //let sig =    walletprovider.send("personal_sign", [hash, ownerAddress])

  const providere = ethers.provider;
  let hash = await getAddSignerHash(
    "0xcAe3Ceb9d0792F83F8C9455fbb447b3C92dbDB42",
    1
  );
  console.log("hash:", hash);
  let sig = await providere.send("personal_sign", [hash, kbPro.address]);
  //   await kbPro.signTransaction("personal_sign", [hash, kbPro.address]);
  console.log("sig:", sig);

  //   await wb.sendTransaction(tx);
  //   0x0d9462955ddda59216746b9308e8198737ceae5aa38ff0568d9f3f6135467b974a6e5a4f5b7c872418cbc6db22b54ac5db4fd4cd9b03450fe99cd8b05f5df09b1b
  //   console.log(address);

  const add = await MultiSigWallet.recover(hash, sig);
  // console.log("address account & recovered : ", kbPro.address == add);
  let ownersNum = await MultiSigWallet.numberOfOwners();
  // console.log("Num of owners: ", ownersNum);
  let calldataFirst = getAddSignerCallData(
    "0xcAe3Ceb9d0792F83F8C9455fbb447b3C92dbDB42",
    1
  );
  let chainID = await MultiSigWallet.chainId();
  console.log("chainID: ", chainID);
  // console.log("calldata: ", calldataFirst);
  // let tx = MultiSigWallet.executeTransaction(
  //   multiSigWalletAddress,
  //   "0x0",
  //   calldataFirst,
  //   [sig]
  // );
  // let trans = await kbPro.sendTransaction(tx);
  // wait(2);
  // console.log(trans);
  // ownersNum = await MultiSigWallet.numberOfOwners();
  // console.log("Num of owners: ", ownersNum);
}
// address payable to,
// uint256 value,
// bytes calldata data,
// bytes[] calldata signatures
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
