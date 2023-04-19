//   const { write } = useContractWrite(config)
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
// import { setTimeout } from "timers/promises";
import { useProvider } from "wagmi";
import {
  contractFactoryABI,
  ContractFactoryAddress,
  MultiSigABI,
} from "../../Constants/abi";

export const useCreateContract = (
  signersArr,
  multiName,
  signaturesRequired,
  optionalEth,
  address
) => {
  let ethValue;
  if (optionalEth == 0) {
    ethValue = "0";
  } else {
    ethValue = ethers.utils.parseEther(optionalEth).toString();
  }

  const { config, error } = usePrepareContractWrite({
    addressOrName: ContractFactoryAddress,
    contractInterface: contractFactoryABI,
    functionName: "create2",
    args: [signersArr, signaturesRequired, multiName],
    overrides: {
      from: address,
      value: ethValue,
    },
  });
  return { config, error };
};

export const useExecuteTransaction = (
  multisigAddress,
  executeTo,
  value,
  calldata,
  signatures,
  executor
) => {
  // address payable to,
  // uint256 value,
  // bytes calldata data,
  // bytes[] calldata signatures
  console.log(
    "multisigAddress: ",
    multisigAddress,
    "executeTo: ",
    executeTo,
    "value: ",
    value,
    "calldata: ",
    calldata,
    "signatures: ",
    signatures,
    "executor: ",
    executor
  );
  let ethValue = 0;
  if (value > 0) {
    ethValue = ethers.utils.parseEther(value);
    console.log(ethValue);
  }
  const { config, error } = usePrepareContractWrite({
    addressOrName: multisigAddress,
    contractInterface: MultiSigABI,
    functionName: "executeTransaction",
    args: [executeTo, ethValue, calldata, signatures],
    overrides: {
      from: executor,
    },
  });
  return { config, error };
};
