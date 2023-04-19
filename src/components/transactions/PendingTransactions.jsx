import React, { useEffect, useState } from "react";
import PendingTransaction from "./PendingTransaction";
import { getTransactions } from "../../utils/getTransactions";
import { postTransaction } from "../../utils/postTransaction";
import { Watch } from "react-loader-spinner";

const PendingTransactions = ({
  walletAddress,
  nonce,
  signaturesRequired,
  setNewTransaction,
  selectMenu,
  owners,
}) => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const nonceUpdate = (prev, passedHash) => {
    data.map((trans) => {
      if (
        trans[1].nonce <= prev &&
        trans[1].hash != passedHash &&
        trans[1].status != "success" &&
        trans[1].status != "failed"
      ) {
        const transactionDetail = {
          chainID: 5,
          address: trans[1].address,
          nonce: trans[1].nonce,
          amount: trans[1].amount,
          to: trans[1].to,
          hash: trans[1].hash,
          data: trans[1].data,
          signatures: trans[1].signatures,
          signers: trans[1].signers,
        };
        const otherDetails = {
          description: trans[1].description,
          purposer: trans[1].purposer,
          purposedDate: trans[1].purposedDate,
          status: "failed",
          executor: null,
          executed: null,
          transactionHash: null,
        };

        postTransaction(transactionDetail, otherDetails)
          .then((res) => {
            console.log("successfully edited backend");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    getTransactions(walletAddress, 5)
      .then((res) => res.data)
      .then((data) => {
        setData(Object.entries(data));
        setLoading(false);
      });
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center m-20">
        <Watch color="blue" width={300} />
      </div>
    );
  if (!data || data == "") return <p>No data</p>;

  if (data)
    return (
      <>
        {data.map((res) => (
          <div key={res[0]}>
            {res[1].status == selectMenu &&
              (selectMenu === "pending" ? res[1].nonce >= nonce : true) && (
                <PendingTransaction
                  value={res[1]}
                  address={walletAddress}
                  signaturesRequired={signaturesRequired}
                  nonceUpdate={nonceUpdate}
                  setNewTransaction={setNewTransaction}
                  nonce={nonce}
                  owners={owners}
                />
              )}
          </div>
        ))}
      </>
    );

  return <div>Pending</div>;
};

export default PendingTransactions;
