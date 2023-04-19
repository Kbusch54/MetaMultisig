import Image from "next/image";
import React from "react";
import wallet from "../public/assets/wallet.svg";
import { useBalance, useBlockNumber } from "wagmi";
import Link from "next/link";
import { ethers } from "ethers";
import { FallingLines } from "react-loader-spinner";

const Wallet = ({ sigsReq, owners, name, contractAddress, contractId }) => {
  const contractBal = useBalance({
    addressOrName: contractAddress,
  });

  const { data: block } = useBlockNumber({ chainId: 5 });

  if (!contractBal.isLoading && !contractBal.isError) {
    let valuetoShow;
    let symbol;
    const value = contractBal?.data?.value;
    const valueInBig = ethers.utils.formatEther(contractBal?.data?.value);
    if (contractBal?.data?.formatted > 0) {
    }

    if (valueInBig >= 0.001 || valueInBig == 0) {
      symbol = "ETH";
      valuetoShow = valueInBig;
    } else if (valueInBig >= 0.00000000000001) {
      symbol = "Gwei";
      valuetoShow = ethers.utils.formatUnits(value, 9);
    } else {
      symbol = "Wei";
      valuetoShow = ethers.utils.formatUnits(value, 18);
    }
    return (
      <Link
        key={contractId}
        href={{
          pathname: `/wallet/${contractAddress}`,
        }}
      >
        <div className="flex flex-col border-2 border-yellow-400 justify-center align-middle m-12 bg-myBlue">
          <div className="place-self-center text-3xl bg-myOrange uppercase">
            {name}
          </div>
          <div className="place-self-center">
            <Image
              // className=" ml-20  "
              src={wallet}
              alt="image"
              width={"200px"}
              height={"200px"}
            />
          </div>
          <div className="flex flex-row gap-4 text-center mx-2 bg-myOrange">
            <div className=" flex-col">
              <div>Signers</div>
              <div>{owners.length}</div>
            </div>
            <div className="flex-col">
              <div>Signatures Required</div>
              <div>{sigsReq}</div>
            </div>
            <div className="flex-col ">
              <div>Balance</div>
              <div className="flex flex-row">
                <p>{valuetoShow} </p>
                <p className="tex-xs pl-1">{symbol}</p>
              </div>
            </div>
          </div>
          <div className="py-6 pl-1 md:pl-1 lg:pl-5 text-white text-xs">
            {contractAddress}
          </div>
        </div>
      </Link>
    );
  } else {
    return (
      <>
        <FallingLines color="blue" width="400" />
      </>
    );
  }
};

export default Wallet;
