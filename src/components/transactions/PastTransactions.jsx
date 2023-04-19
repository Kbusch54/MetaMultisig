import React from "react";
import PastTransaction from "./PastTransaction";
import Image from "next/image";
import EmptyDoge from "../../public/assets/soEmpty.jpg";

// import { getBuiltGraphSDK, getWalletByAddress } from "../../../.graphClient";
// type Props = {};

const PastTransactions = ({ executedTransactions, address }) => {
  return (
    <div className="text-center">
      <div>
        <div className="text-3xl text-myGray">Passed Transactions</div>
        {executedTransactions.length > 0 ? (
          executedTransactions?.map((transaction, i) => (
            <PastTransaction
              key={transaction.hash}
              transaction={transaction}
              address={address}
            />
          ))
        ) : (
          <div className="object-cover">
            <Image
              src={EmptyDoge}
              alt="such empty"
              height={300}
              width={700}
              className="object-fit opacity-20"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PastTransactions;
