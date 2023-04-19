import React, { useState, useCallback, useEffect, useRef } from "react";
import CopyButton from "./utils/buttons/CopyButton";
import { InfinitySpin, BallTriangle, Triangle } from "react-loader-spinner";

import Textarea from "react-expanding-textarea";

export default function TransactionDetailsModal({
  handleOk,
  handleCancel,
  txnInfo = null,
  showFooter = false,
  to = false,
  value = false,
  type = "",
  customNonce,
  nonce,
  setCustomNonce,
  contractName = null,
  setDescription = { setDescription },
  description = { description },
  loadingModal = false,
}) {
  const [pendingTransExsits, setPendingTransExists] = useState(false);
  const [message, setMessage] = useState(null);
  const [nonceError, setNonceError] = useState(false);
  const [nonceWarning, setNonceWarning] = useState(false);
  const textareaRef = useRef(null);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    console.log("Changed value to: ", e.target.value);
    setDescription((prev) => e.target.value);
  }, []);

  useEffect(() => {
    textareaRef.current.focus();
  }, []);
  useEffect(() => {}, [loadingModal]);

  //check if transaction pendings share nonce
  const changeNonce = (e) => {
    e.preventDefault();
    const newNonce = Number(e.target.value);
    console.log("nonce", nonce);
    console.log("zero check", nonce === 0);
    if (newNonce === 0 && nonce === 0 && pendingTransExsits) {
      console.log("nonce zero 0");
      setMessage(
        (prev) =>
          "Warning there exists a pending transaction with this nonce \n either up the nonce or compete with current pending transaction"
      );
      setNonceError((prev) => false);
      setCustomNonce((prev) => newNonce);
      setNonceWarning((prev) => true);
    } else if (nonce == 0 && newNonce == 0 && !pendingTransExsits) {
      setMessage((prev) => null);
      setNonceError((prev) => false);
      setCustomNonce((prev) => newNonce);
      setNonceWarning((prev) => false);
    } else if (newNonce < nonce) {
      console.log("error nonce is out of bounds");
      setMessage((prev) => `Nonce must be at least ${nonce}`);
      setNonceWarning((prev) => false);
      setNonceError((prev) => true);
    } else if (newNonce == nonce && pendingTransExsits) {
      setMessage(
        (prev) =>
          `Warning there exists a pending transaction with this \n nonce either up the nonce or compete with current pending transaction`
      );
      setNonceWarning((prev) => true);
      setNonceError((prev) => false);
      setCustomNonce((prev) => newNonce);
    } else if (isNaN(newNonce) && newNonce != 0) {
      setMessage((prev) => "Nonce must be a number");
      setNonceError((prev) => true);
      setNonceWarning((prev) => false);
    } else if (
      (newNonce == null || newNonce == undefined || newNonce == "") &&
      newNonce != 0
    ) {
      console.log("newnonce number: ", newNonce);
      setMessage((prev) => "nonce cannont be empty");
      setNonceError((prev) => true);
      setNonceWarning((prev) => false);
    } else if (
      (newNonce >= nonce + 1 && !pendingTransExsits) ||
      newNonce > nonce + 2
    ) {
      setMessage(
        (prev) =>
          `Nonce has been set higher than previous \n one this transaction will have to wait for ${
            newNonce - nonce
          } before execution`
      );
      setNonceError((prev) => false);
      setNonceWarning((prev) => true);
      setCustomNonce((prev) => newNonce);
    } else {
      setMessage((prev) => null);
      setCustomNonce((prev) => newNonce);
      setNonceError((prev) => false);
      setNonceWarning((prev) => false);
    }
  };

  return (
    <div className={`flex-none relative `}>
      {/* wallet connect tx details  */}
      {to && value && (
        <>
          <div className={`opactiy-100 ${loadingModal && "opacity-10"}`}>
            <div className="flex justify-between">
              <div className="m-2 mt-1  flex ">
                to:{" "}
                <span className="bg-gray-300 p-1 mx-2 rounded-md">{to}</span>{" "}
                <CopyButton size={25}>{to}</CopyButton>
              </div>
              {contractName != null && (
                <div className="name">
                  Contract:{" "}
                  <span className="bg-purple-500 p-1 text-white rounded-md">
                    {contractName}
                  </span>
                </div>
              )}
            </div>
            <div className="flex ">
              <div className="m-2">
                value:{" "}
                <span className="bg-gray-300 p-1 rounded-md">{value}</span>{" "}
              </div>
              <div className="m-2">
                value in wei:{" "}
                <span className="bg-gray-300 p-1 rounded-md">
                  {parseInt(value)} wei
                </span>{" "}
              </div>
            </div>
            <div className="m-2">
              {!txnInfo && (
                <span className="text-blue-500">cannot parse tx data !</span>
              )}
            </div>
          </div>
        </>
      )}
      {txnInfo && loadingModal && (
        <div className="flex justify-center absolute left-[40%] top-[0%] opacity-100">
          <Triangle
            height="300"
            width="300"
            color="blue"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
          <div className="absolute top-[40%]">
            <BallTriangle
              height={100}
              width={100}
              radius={5}
              color="orange"
              ariaLabel="ball-triangle-loading"
              wrapperClass={{}}
              wrapperStyle=""
              visible={true}
            />
          </div>
        </div>
      )}
      <div
        className={`flex flex-row justify-between opactiy-100 ${
          loadingModal && "opacity-10"
        }`}
      >
        <div>
          <p>
            <b>Event Name :</b> {txnInfo.functionFragment.name}
          </p>
          <p>
            <b>Function Signature :</b> {txnInfo.signature}
          </p>
          <h4>Arguments :&nbsp;</h4>
          {txnInfo.functionFragment.inputs.map((element, index) => {
            if (element.type === "address") {
              return (
                <div
                  key={element.name}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "left",
                  }}
                >
                  <b>{element.name} :&nbsp;</b>
                  <h3>{txnInfo.args[index]}</h3>
                </div>
              );
            } else if (element.type === "uint256") {
              //first try toNumber
              let numberDisplay = "";
              try {
                numberDisplay = "" + txnInfo.args[index].toNumber();
              } catch (e) {
                numberDisplay = "" + txnInfo.args[index].toString();
              }

              return (
                <p key={element.name}>
                  {element.name === "value" ? (
                    <>
                      <b>{element.name} : </b> <p>{txnInfo.args[index]}</p>
                    </>
                  ) : (
                    <>
                      <b>{element.name} : </b>{" "}
                      {txnInfo.args[index] && numberDisplay}
                    </>
                  )}
                </p>
              );
            } else {
              return (
                <div key={element.name} className="w-28">
                  {
                    <>
                      {/* {txnInfo.args[index]} */}
                      <b>{element.name} : </b>{" "}
                      <div className="group">
                        <p className="hidden text-xs group-hover:block ">
                          {txnInfo.args[index]}
                        </p>
                        <p className="text-xs block group-hover:hidden ">
                          {txnInfo.args[index].toString().slice(0, 12)}....
                        </p>
                      </div>
                      <CopyButton size={18}>{txnInfo.args[index]}</CopyButton>
                    </>
                  }
                </div>
              );
            }
          })}
          <p className="">
            <b>SigHash : &nbsp;</b>
            {txnInfo.sighash}
          </p>
          <div className="flex justify-start items-center">
            <div className="font-bold mr-2">Enter custom nonce :</div>
            <input
              type={"number"}
              placeholder="Enter nonce"
              style={{ width: "25%" }}
              className={`${nonceError ? "animate-pulse bg-red-500" : ""}`}
              defaultValue={customNonce}
              onChange={changeNonce}
            />
            {nonceError || nonceWarning ? (
              <p
                className={` ml-2 ${nonceError && "text-red-300"} ${
                  nonceWarning && " text-yellow-300 text"
                }text-xs`}
              >
                {message}
              </p>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex flex-col pr-12">
          <label>Description : </label>

          <Textarea
            className="textarea border-2 border-slate-400 "
            defaultValue="Lorem ipsum dolor sit amet, ..."
            id="my-textarea"
            maxLength="3000"
            name=""
            onChange={handleChange}
            placeholder={description || "Description...."}
            ref={textareaRef}
          />
        </div>
      </div>

      {showFooter ? (
        <div className="flex justify-between pt-4 mb-0">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:scale-110"
            key="cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>

          {loadingModal ? (
            <div className="bg-green-600 rounded-lg flex justify-center">
              <InfinitySpin width="90" color="yellow" />
            </div>
          ) : (
            <button
              className={`px-4 py-2 ${
                nonceError
                  ? "bg-myGray cursor-not-allowed"
                  : "bg-green-600 cursor-pointer hover:scale-110"
              } text-white rounded-lg `}
              key="ok"
              disabled={nonceError}
              type="primary"
              onClick={handleOk}
            >
              Propose
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
