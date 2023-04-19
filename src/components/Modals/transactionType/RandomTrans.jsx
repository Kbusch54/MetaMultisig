import React from "react";

const RandomTrans = ({
  transaction,
  transactionDetails,
  handleChange,
  handleChangeTrans,
}) => {
  return (
    <div>
      <label className="m-2">Nonce:{transaction.nonce}</label>
      <label className="m-2">{transaction.to}</label>

      <label className="m-2">{transactionDetails.mulitSigAddress}</label>

      <input
        label="New Signer Address"
        className="m-2"
        placeholder="NewSigner"
        type="text"
        name="newSigner"
        value={transactionDetails.newSigner}
        onChange={handleChangeTrans}
      />
      <input
        label="New Signatures Required"
        className="m-2"
        placeholder="SignaturesRequired"
        type="number"
        name="newSignaturesRequired"
        value={transactionDetails.newSignaturesRequired}
        onChange={handleChangeTrans}
      />
      <label className="m-2">{transactionDetails.purposer}</label>
    </div>
  );
};

export default RandomTrans;
