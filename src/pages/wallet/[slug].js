import React from "react";
import Image from "next/image";
import wallet from "../../public/assets/wallet.svg";
import wallets from "../../utils/dummyData/wallets.json";
import {
  PastTransactions,
  PendingTransactions,
} from "../../components/transactions";
import { TokenBalances } from "../../components/tokenBalances";

const IndividualWallet = (props) => {
  const {
    signaturesRequired,
    owners,
    name,
    creator,
    contractAddress,
    contractId,
  } = wallets.Create2Event[props.paramsId - 1];
  // .map((wallet) => {
  //   if (wallet.contractId === props.paramsId) {
  //     return wallet;
  //   }
  // });
  console.log(props.paramsId);

  return (
    <div className="flex flex-col ">
      <div className="flex flex-row px-10 ">
        <div className="flex-1">
          <div className=" flex-col ">
            <div className="text-4xl uppercase  ">{name}</div>
            <div className="flex flex-row  text-lg  ">
              <div className="pr-20">{contractAddress}</div>
              <div className="text-center">Etherscan link</div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex flex-row gap-4 text-center mx-2 ">
            <div className=" flex-col">
              <div>Owners</div>
              <div>{owners.length}</div>
            </div>
            <div className="flex-col">
              <div>Signatures Required</div>
              <div>{signaturesRequired}</div>
            </div>
            <div className="flex-col ">
              <div>Eth Balance</div>
              <div>1.823</div>
            </div>
          </div>
          <p>another subgraph event for owners/ sigs</p>
        </div>
      </div>
      <hr className="h-[10px]"></hr>
      <div className="flex flex-row">
        <div className="flex-1">Creator: {creator}</div>
        <div>
          <div>Owners</div>
          <ul>
            {owners.map((owner, i) => (
              <li key={i}>{owner}</li>
            ))}
          </ul>
        </div>
      </div>
      <hr />
      <TokenBalances />
      <hr />

      <PendingTransactions />
      <PastTransactions />
    </div>
  );
};

export default IndividualWallet;

export const getServerSideProps = async (context) => {
  // console.log(context.);
  return { props: { paramsId: context.params.slug } };
};
