import React, { useState } from "react";
// import { motion } from "framer-motion";

const SelectTransactionType = ({ setMethodName, methodName }) => {
  const handleSelect = (e) => {
    e.preventDefault();
    setMethodName((prev) => e.target.value);
  };
  return (
    <div className="">
      <div className="flex flex-row bg-myBlue text-white px-4 py-2  justify-center rounded-lg ">
        <div className="mr-2 ">Select Transaction</div>
        <select
          id="transactions"
          name="transactions"
          className=" bg-myOrange"
          onChange={handleSelect}
        >
          <option value="addSigner">Add Signer</option>
          <option value="removeSigner">Remove Signer</option>
          <option value="transferFunds">Send Eth</option>
          <option value="iframe">Dapp</option>
        </select>
      </div>
    </div>
  );
};

export default SelectTransactionType;
