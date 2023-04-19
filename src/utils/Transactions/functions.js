import { ethers } from "ethers";
import { MultiSigABI as multiAbi } from "../Constants/abi";

const ABI = multiAbi;
const getMethodNameHash = (
  newSignerAddress,
  newSignaturesRequired,
  nonce,
  methodName,
  multiAddress
) => {
  let value = "0x0";

  let callData = getFunctionCallData(
    methodName,
    newSignerAddress,
    newSignaturesRequired
  );
  return getTransactionHash(
    nonce,
    multiAddress,
    value,
    callData,
    multiAddress,
    5
  );
};

const getRemoveSignerHash = (
  removeSignerAddress,
  newSignaturesRequired,
  nonce,
  chainId,
  multiAddress
) => {
  let to = multiAddress;
  let value = "0x0";

  let callData = getRemoveSignerCallData(
    removeSignerAddress,
    newSignaturesRequired
  );

  return getTransactionHash(nonce, to, value, callData, multiAddress, chainId);
};

const getFunctionCallData = (
  methodName,
  newSignerAddress,
  newSignaturesRequired
) => {
  let iface = new ethers.utils.Interface(ABI);

  return iface.encodeFunctionData(methodName, [
    newSignerAddress,
    newSignaturesRequired,
  ]);
};

const getRemoveSignerCallData = (oldSignerAddress, newSignaturesRequired) => {
  let iface = new ethers.utils.Interface(ABI);
  return iface.encodeFunctionData("removeSigner", [
    oldSignerAddress,
    newSignaturesRequired,
  ]);
};

const getTransactionHash = (_nonce, to, value, data, address, chainId) => {
  return ethers.utils.solidityKeccak256(
    ["address", "uint256", "uint256", "address", "uint256", "bytes"],
    [address, chainId, _nonce, to, value, data]
  );
};
const decodeTransaction = (methodName, transactionCalldata) => {
  let iface = new ethers.utils.Interface(ABI);
  return iface.decodeFunctionData(methodName, transactionCalldata);
};
const decodeCallData = (calldata, value) => {
  const data = calldata.toString();
  //  ethers.BigNum

  let val = parseInt(value);

  const iface = new ethers.utils.Interface(ABI);
  let decodedData = iface.parseTransaction({
    data: data,
    value: val,
  });
  return decodedData;
};
const multiAbiLay = () => {
  function typeIn(type) {
    return type == "function";
  }
};
export {
  getRemoveSignerHash,
  getTransactionHash,
  decodeTransaction,
  decodeCallData,
  getMethodNameHash,
  getFunctionCallData,
};

// ethers.utils.parseTransaction
// let iface = new ethers.utils.Interface(ABI);
// iface.encodeFunctionData()
