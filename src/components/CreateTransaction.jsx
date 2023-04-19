import React, { useState, useEffect, useLayoutEffect } from "react";
import { BallTriangle, Triangle } from "react-loader-spinner";
import SelectTransactionType from "./transactionInputs/SelectTransactionType";
import IFrame from "./IFrame";
import {
  getTransactionHash,
  getFunctionCallData,
} from "../utils/Transactions/functions";
import { useAccount, useSigner } from "wagmi";
import { parseEther } from "ethers/lib/utils";
import { postTransaction } from "../utils/postTransaction";
import { ethers } from "ethers";
import { contracts } from "../utils/Constants/contractAddress";
import EtherInput from "./Modals/utils/EthInput";

function CreateTransaction({
  address,
  signaturesRequired,
  nonce,
  owners,
  setSelectMenu,
  pendingNonces,
}) {
  const { address: user } = useAccount();
  const [customCallData, setCustomCallData] = useState("");
  const [amount, setAmount] = useState("0");
  const [methodName, setMethodName] = useState("addSigner");
  const [newSignaturesRequired, setNewSignaturesRequired] =
    useState(signaturesRequired);
  const [isIframe, setIsIframe] = useState(false);
  const [customNonce, setCustomNonce] = useState(nonce);
  const [contractUrl, setContractUrl] = useState();
  const [isTxLoaded, setIsTxLoaded] = useState(false);
  const [description, setDescription] = useState("");
  const [to, setTo] = useState();
  const [nonceWarning, setNonceWarning] = useState(null);
  const [signed, setSigned] = useState(false);
  const [sigProblem, setSigProblem] = useState(false);
  const [addressProblem, setAddressProblem] = useState(true);
  const [shouldCreateTransaction, setShouldCreateTransaction] = useState(false);
  const loadTransactionData = ({ to, value, data, isIframe = false }) => {
    setTo(to);
    value ? setAmount(ethers.utils.formatEther(value)) : setAmount("0");
    setCustomCallData(data);
    setShouldCreateTransaction(true);
    if (isIframe) {
      setIsIframe(true);
    }
  };
  const handleSetAddressTo = (e) => {
    e.preventDefault();
    let newAddress = e.target.value;
    setTo((prev) => newAddress);
    checkAddress(newAddress);
  };
  const checkAddress = (newAddress) => {
    if (ethers.utils.isAddress(newAddress)) {
      let newOwn = [];
      owners.map((ownerAdd) => {
        newOwn.push(ownerAdd.address.toString().toLowerCase());
      });

      if (
        (methodName == "addSigner" &&
          !newOwn.includes(newAddress.toString().toLowerCase())) ||
        (methodName == "removeSigner" &&
          newOwn.includes(newAddress.toString().toLowerCase()))
      ) {
        setAddressProblem(false);
        setTo(newAddress);
      } else if (methodName == "transferFunds") {
        setAddressProblem(false);
        setTo(newAddress);
      } else {
        setAddressProblem(true);
      }
    } else {
      setAddressProblem(true);
    }
  };
  const handleSignaturesRequired = (e) => {
    e.preventDefault();

    const newSig = e.target.value;
    setNewSignaturesRequired((prev) => newSig);
    sigCheck(newSig);
  };

  const sigCheck = (newSig) => {
    let maxSigsAllowed;
    if (methodName == "addSigner") {
      maxSigsAllowed = owners.length + 1;
    } else {
      maxSigsAllowed = owners.length - 1;
    }
    if (newSig >= 1 && newSig <= maxSigsAllowed) {
      setNewSignaturesRequired(newSig);
      setSigProblem(false);
    } else {
      setSigProblem(true);
    }
  };
  const handleCustomNonce = (e) => {
    e.preventDefault();

    const newNonce = e.target.value;

    if (newNonce) {
      if (pendingNonces != null && pendingNonces.includes(Number(newNonce))) {
        setNonceWarning(["warning", "Warning competing transacitons"]);
        setCustomNonce(newNonce);
      } else if (newNonce < nonce) {
        setNonceWarning(["error", "Error cannot be less than current nonce"]);
      } else if (newNonce >= nonce + 1) {
        setNonceWarning([
          "warning",
          `Warning will wait ${newNonce - nonce} transations to be executed `,
        ]);
        setCustomNonce(newNonce);
      } else {
        setNonceWarning(null);
        setCustomNonce(newNonce);
      }
    }
  };

  const handleIframeUrl = (e) => {
    e.preventDefault();

    setContractUrl((prev) => e.target.id);
  };
  const [loadingModal, setLoadingModal] = useState(false);
  const { data: signer, isError, isLoading } = useSigner();

  useLayoutEffect(() => {
    if (pendingNonces && pendingNonces.includes(Number(nonce))) {
      setNonceWarning(["warning", "Warning competing transacitons"]);
    }
    setCustomNonce(nonce);
  }, [nonce]);

  useEffect(() => {
    shouldCreateTransaction && createTransaction();
    setShouldCreateTransaction(false);
  }, [shouldCreateTransaction]);

  useLayoutEffect(() => {
    checkAddress(to);
    setCustomNonce((prev) => nonce);
    if (methodName == "addSigner" || methodName == "removeSigner") {
      sigCheck(newSignaturesRequired);
    }
  }, [methodName]);
  const createTransaction = async () => {
    console.log("create trans ahahh");
    setLoadingModal((prev) => true);
    let callData;
    let executeToAddress;
    if (
      methodName === "transferFunds" ||
      methodName === "customCallData" ||
      methodName === "wcCallData" ||
      methodName === "iframe"
    ) {
      callData = methodName == "transferFunds" ? "0x" : customCallData;
      executeToAddress = to;
      console.log(methodName);
      methodName == "transferFunds" && setDescription(methodName);
    } else {
      callData = getFunctionCallData(methodName, to, newSignaturesRequired);
      executeToAddress = address;
      console.log("calldata: ", callData, " : ", executeToAddress);
      setDescription(methodName);
    }

    let val = amount > 0 ? parseEther(amount) : 0;

    const newHash = getTransactionHash(
      customNonce,
      executeToAddress,
      val,
      callData,
      address,
      5
    );

    const signature = await signer
      ?.signMessage(ethers.utils.arrayify(newHash))
      .catch((err) => {
        alert(err);
      });

    if (signature) {
      const verified = ethers.utils.verifyMessage(
        ethers.utils.arrayify(newHash),
        signature
      );

      let isOwner = false;

      owners.map((owner, i) => {
        if (
          owner.address === verified.toString().toLowerCase() &&
          owner.address === user.toString().toLowerCase()
        ) {
          // setLoadingModal((prev) => false);
          isOwner = true;
        }
      });

      if (isOwner) {
        const transactionDetail = {
          chainID: 5,
          address: address,
          nonce: customNonce,
          amount: amount,
          to: executeToAddress,
          hash: newHash,
          data: callData,
          signatures: [signature],
          signers: [verified],
        };
        const otherDetails = {
          description:
            methodName == "transferFunds" ? "transferFunds" : description,
          purposer: verified,
          purposedDate: Date.now(),
          status: "pending",
          executor: null,
          executed: null,
          transactionHash: null,
        };
        await postTransaction(transactionDetail, otherDetails)
          .then((res) => {
            console.log(res.request);
            console.log("successfully added to backend");
          })
          .catch((err) => {
            console.log("whoops");
            console.log(err);
          });

        setSigned((prev) => true);
        setSelectMenu((prev) => "pending");
      }
    }
  };

  return (
    <div>
      <SelectTransactionType
        setMethodName={setMethodName}
        methodName={methodName}
      />
      {(methodName == "addSigner" ||
        methodName == "removeSigner" ||
        methodName == "transferFunds") &&
        (loadingModal ? (
          <div className="flex justify-center mb-24">
            <div className="w-1/3 relative  bg-myOrange mt-4 h-64 justify-center text-center flex align-bottom">
              <p className="mt-[9rem] text-white animate-pulse">
                Awaiting Signature...
              </p>
              <div className="absolute  top-[-8%] left-[19%]">
                <Triangle
                  height="300"
                  width="300"
                  color="blue"
                  ariaLabel="triangle-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
              <div className="absolute top-[40%] left-[40%]">
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
          </div>
        ) : (
          <div className=" mt-4 flex justify-center">
            <div className="flex-col w-1/3 justify-center text-center border-myOrange border-2 rounded-2xl">
              <h2>
                {methodName == "addSigner"
                  ? "Add Signer"
                  : methodName == "removeSigner"
                  ? "Remove Signer"
                  : "Transfer Funds"}{" "}
              </h2>
              <div>
                <label className="pr-2">
                  {methodName == "transferFunds"
                    ? "Recepient address"
                    : "Mutlisig Signer address"}{" "}
                </label>
                <input
                  className="border-3 border-red-500 "
                  placeholder={
                    methodName == "transferFunds"
                      ? "Recepient address"
                      : "Mutlisig Signer address"
                  }
                  defaultValue={to}
                  onChange={handleSetAddressTo}
                />
                {addressProblem && (
                  <p className="text-xs text-red-500">
                    Not an address or Address already signer
                  </p>
                )}
              </div>
              <div>
                {(methodName == "transferFunds" ||
                  methodName == "customCallData") && (
                  <EtherInput
                    value={amount}
                    contractAddress={address}
                    onChange={setAmount}
                  />
                )}
                {(methodName == "addSigner" ||
                  methodName == "removeSigner") && (
                  <div className="  p-4 ">
                    <div className="grid grid-cols-5 pl-6">
                      <label className=" col-span-2">
                        Signatures Required:{" "}
                      </label>
                      <input
                        className="w-[50px] text-center col-span-1"
                        placeholder="#"
                        defaultValue={newSignaturesRequired}
                        type={"number"}
                        onChange={handleSignaturesRequired}
                      />
                      {sigProblem && (
                        <p className="text-[0.5rem] text-red-500 col-span-2">
                          Cannot be higher than the number of new owenrs or 0
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-5 pl-6 mb-2">
                <label className=" col-span-2 ">Custom Nonce</label>
                <input
                  className="w-[50px] text-center col-span-1"
                  defaultValue={customNonce}
                  type={"number"}
                  onChange={handleCustomNonce}
                />
                {nonceWarning != null && (
                  <p
                    className={`text-xs col-span-2 ${
                      nonceWarning[0] == "warning"
                        ? "text-yellow-400"
                        : "text-red-500"
                    }`}
                  >
                    {nonceWarning[1]}
                  </p>
                )}
              </div>
              <button
                onClick={createTransaction}
                disabled={
                  sigProblem ||
                  addressProblem ||
                  (nonceWarning != null && nonceWarning[0] == "error")
                }
                type="primary"
                className={`px-2 py-2 w-full  rounded-2xl ${
                  sigProblem ||
                  addressProblem ||
                  (nonceWarning != null && nonceWarning[0] == "error")
                    ? "bg-red-500 cursor-not-allowed"
                    : "bg-green-500 cursor-pointer"
                } text-white `}
              >
                {sigProblem ||
                addressProblem ||
                (nonceWarning != null && nonceWarning[0] == "error")
                  ? "Error"
                  : "Purpose"}
              </button>
            </div>
          </div>
        ))}
      {/* dropdown select for transaction type */}
      {methodName == "iframe" && (
        <>
          <div className="flex flex-row gap-3 ">
            {contracts.map((contract) => (
              <>
                {contract.websiteUrl && (
                  <div
                    id={contract.websiteUrl}
                    onClick={handleIframeUrl}
                    className="px-4 py-2 bg-purple-600 text-white"
                    key={contract.address}
                  >
                    {" "}
                    {contract.name}
                  </div>
                )}
              </>
            ))}
          </div>
          <IFrame
            address={address}
            loadTransactionData={loadTransactionData}
            isTxLoaded={isTxLoaded}
            customNonce={customNonce}
            setCustomNonce={setCustomNonce}
            nonce={nonce}
            reset={signed}
            setDescription={setDescription}
            description={description}
            url={contractUrl}
            loadingModal={loadingModal}
            pendingNonces={pendingNonces}
          />
        </>
      )}
    </div>
  );
}

export default CreateTransaction;
