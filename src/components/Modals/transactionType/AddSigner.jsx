import React from "react";

// type Props = {
//   walletAddress: string;
// };
// type Transaction = {
//   nonce: number;
//   to: string;
//   value: string;
//   calldata: string;
//   signatures: string[];
// };
// type TransactionDetails = {
//   hash: string;
//   mulitSigAddress: string;
//   addresses: string[];
//   description: string;
//   purposer: string;
//   signaturesNeeded: string;
//   rejectionSignatures: string[];
//   rejectionAddresses: string[];
// };

const AddSigner = (props) => {
  const walletAddress = props.walletAddress;
  const handleChangeTrans = props.handleChangeTrans;
  const handleChange = props.handleChange;
  const setTransactionDetails = props.setTransactionDetails;
  const transactionDetails = props.transactionDetails;
  const setTransaction = props.setTransaction;
  const transaction = props.transaction;

  console.log("wallet: ", walletAddress);

  return (
    <div>
      <div>{walletAddress}</div>
      <form>
        <input
          placeholder="Nonce"
          type="text"
          name="nonce"
          readOnly={transaction.nonce}
        />
        <input
          placeholder="Calldata"
          type="text"
          name="calldata"
          readOnly={transaction.calldata}
        />
        <input
          placeholder="Value"
          type="text"
          name="value"
          defaultValue={"0x0"}
        />
        <input
          placeholder="New Signatures Required"
          type="number"
          name="newSignaturesRequired"
          value={transactionDetails.newSignaturesRequired}
          onChange={handleChangeTrans}
        />

        <input
          placeholder="New Signer Address"
          type="text"
          name="newSigner"
          value={transactionDetails.newSigner}
          onChange={handleChangeTrans}
        />
        <input
          placeholder="Purposer"
          type="text"
          name="purposer"
          defaultValue={transactionDetails.purposer}
        />
        <input
          placeholder="Description"
          type="text"
          name="description"
          defaultValue={transactionDetails.description}
        />
      </form>
      {transaction.nonce}
    </div>
  );
};

export default AddSigner;
