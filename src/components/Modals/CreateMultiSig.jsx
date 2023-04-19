import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import EthConverstions from "./utils/EthConverstions";
import CreateContractButton from "./utils/CreateContractButton";

const CreateMultiSig = ({
  address,
  closeModal,
  notifyError,
  notifySuccess,
  notifyReject,
}) => {
  const [owners, setOwners] = useState([address]);
  const [signaturesRequired, setSignaturesRequired] = useState(1);
  const [sigCheck, setSigCheck] = useState(true);
  const [multiName, setMultiName] = useState();
  const [checkedBox, setCheckBox] = useState();
  const [ethValue, setEthValue] = useState([
    0,
    "0.000000000",
    "0.000000000000000000",
  ]);
  const [transactionCheck, setTransactionCheck] = useState(false);

  const checkAddressInput = (address) => {
    if (ethers.utils.isAddress(address)) {
      let numofTimes = 0;
      for (let i = 0; i < owners.length; i++) {
        owners[i] === address && numofTimes++;
      }
      if (numofTimes >= 2) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  };
  const hanldeCheckBox = (e) => {
    setCheckBox((prev) => !prev);
  };
  const checkRequiredSigs = () => {
    if (signaturesRequired > owners.length || signaturesRequired <= 0) {
      setSigCheck(false);
      return false;
    } else {
      setSigCheck(true);
      return true;
    }
  };

  const handleOwnersChange = (e) => {
    e.preventDefault();
    const newOwners = [...owners];
    if (e.target.value != "") {
      newOwners[e.target.id] = e.target.value;
      setOwners(newOwners);
    }
  };
  const addOwner = (e) => {
    e.preventDefault();
    setOwners((prev) => [...prev, ""]);
  };
  const deleteOwner = (e) => {
    e.preventDefault();
    const index = e.target.id;

    const newOwners = [...owners];

    newOwners.splice(index, 1);
    setOwners(newOwners);
  };
  const handleSigReq = (e) => {
    e.preventDefault();
    setSignaturesRequired(e.target.value);
  };
  const handleMultiName = (e) => {
    e.preventDefault();

    setMultiName(e.target.value);
  };
  const checkSignersArray = () => {
    let check = true;
    owners.map((owner, i) => {
      if (!checkAddressInput(owner)) {
        check = false;
      }
    });
    return check;
  };
  const checkNameRights = () => {
    if (multiName == "" || multiName == undefined) {
      return false;
    } else {
      return true;
    }
  };
  const checkEthValue = () => {
    if (ethValue[0] > 0) {
      return true;
    } else {
      return false;
    }
  };
  const checkTransactionInputsAndLoad = () => {
    if (
      checkRequiredSigs() &&
      checkNameRights(multiName) &&
      checkSignersArray()
    ) {
      if (checkedBox) {
        if (checkEthValue(ethValue[0])) {
          setTransactionCheck(true);
        } else {
          setTransactionCheck(false);
        }
      } else {
        setTransactionCheck(true);
      }
    } else {
      setTransactionCheck(false);
    }
  };

  useEffect(() => {
    checkTransactionInputsAndLoad();
  }, [owners, signaturesRequired, checkedBox, ethValue, multiName]);

  return (
    <div className="flex flex-col">
      <div className="text-center text-xl">Create Mutli Signature Contract</div>
      <hr />
      <form className="flex flex-row justify-around mt-4">
        <div>
          <label>Signers of MultiSig</label>
          <div className=" flex-col pr-4 mr-5">
            {owners.length >= 1 &&
              owners.map((owner, i) => (
                <div key={owner + 1} className="flex flex-row">
                  {!checkAddressInput(owner) && (
                    <p className="text-[.5rem] animate-pulse text-bold text-red-500 absolute left-8 ">
                      * Not an Address or
                      <br /> Repeated Address
                    </p>
                  )}
                  <input
                    onBlur={handleOwnersChange}
                    defaultValue={owner}
                    className={` border border-blue-500 ${
                      checkAddressInput(owner)
                        ? "border-green-400"
                        : "border-red-500"
                    } mb-2 text-center hover:absolute hover:w-[26rem]`}
                  />
                  {owners.length > 1 && (
                    <button
                      className="ml-2 mb-2 px-[.33rem] rounded-full border bg-red-600 text-white "
                      id={i}
                      onClick={deleteOwner}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
            <button
              className="px-4 py-2 text-white text-xs hover:scale-125 rounded-3xl bg-green-500"
              onClick={addOwner}
            >
              Add Signer
            </button>
          </div>

          <div
            className={`flex-row pt-4 ${
              sigCheck
                ? "text-inherit animate-none"
                : "animate-pulse text-red-500"
            }`}
          >
            <label className="pr-4 ">Signatures Required</label>
            <input
              className={`${
                sigCheck ? "bg-gray-200" : "bg-red-600"
              } w-8 text-center`}
              type="number"
              onChange={handleSigReq}
              placeholder={signaturesRequired}
            />
            {!sigCheck && (
              <p className="text-[0.45rem] ">
                * Signatures required must not exceed number of signers and must
                be at least 1
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col ">
          <label>Name of MultiSig Contract</label>
          <input
            type="text"
            name="contractName"
            className="border-blue-200 border"
            placeholder={"My contract Name"}
            onChange={handleMultiName}
          />
        </div>
        <div>
          <div className="flex pb-4">
            <label>Send Eth to Contract </label>
            <div className="flex flex-col ml-4">
              <p className="text-[0.5rem] text-bold ">* Optional</p>
              <input
                type={"checkbox"}
                name="sendEth"
                className=""
                onChange={hanldeCheckBox}
                checked={checkedBox}
              />
            </div>
          </div>
          <EthConverstions
            ethValue={ethValue}
            setEthValue={setEthValue}
            checkedBox={checkedBox}
          />

          <CreateContractButton
            address={address}
            transactionCheck={transactionCheck}
            owners={owners}
            signaturesRequired={signaturesRequired}
            multiName={multiName}
            ethValue={ethValue[0]}
            closeModal={closeModal}
            notifyError={notifyError}
            notifySuccess={notifySuccess}
            checkedBox={checkedBox}
            notifyReject={notifyReject}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateMultiSig;
