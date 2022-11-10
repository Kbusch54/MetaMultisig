import Image from "next/image";
import React from "react";
import wallet from "../public/assets/wallet.svg";
import { useBalance, useAccount, chain, chainId } from "wagmi";
import Link from "next/link";

const Wallet = ({
  sigsReq,
  owners,
  name,
  creator,
  contractAddress,
  contractId,
}) => {
  // const { address, isConnecting, isDisconnected } = useAccount();
  // const { data, isError, isLoading } = useBalance({
  //   addressOrName: address,
  //   chainId: chain.goerli.id,
  // });
  return (
    <Link key={contractAddress} href={`/wallet/${contractId}`}>
      <div className="flex flex-col border-2 border-yellow-400 justify-center align-middle m-12 bg-myBlue">
        <div className="  py-4 px-24 place-self-center text-3xl bg-myOrange uppercase">
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
            <div>{owners.length}</div>
            <div>Owners</div>
          </div>
          <div className="flex-col">
            <div>{sigsReq}</div>
            <div>Signatures Required</div>
          </div>
          <div className="flex-col ">
            <div>1.823</div>
            <div>Balance</div>
          </div>
        </div>
        <div className="p-4  bg-myBlue text-white text-lg text-center w-full">
          {contractAddress}
        </div>
      </div>
    </Link>
  );
};

export default Wallet;
