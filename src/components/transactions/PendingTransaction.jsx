import React, { useState, useEffect } from "react";
import parseExternalContractTransaction from "../../helpers/parseExternalContractTransaction";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import Modal from "react-modal";
import CopyButton from "../Modals/utils/buttons/CopyButton";
import { useAccount, useContractWrite, useSigner } from "wagmi";
import { useExecuteTransaction } from "../../utils/ContractInteractions/WrittingContractHooks/index";
import { decodeCallData } from "../../utils/Transactions/functions";
import { ToastContainer, toast } from "react-toastify";
import LoadingExecutedTransaction from "../Modals/LoadingExecutedTransaction";
import "react-toastify/dist/ReactToastify.css";
import { postTransaction } from "../../utils/postTransaction";

const PendingTransaction = ({
  value,
  address,
  signaturesRequired,
  nonceUpdate,
  setNewTransaction,
  nonce,
  owners,
}) => {
  const { address: user } = useAccount();
  const [transactionDescription, setTransactionDescription] = useState();
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [loadingStage, setLoadingStage] = useState(false);
  const [loadModal, setLoadModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messageTo, setMessageTo] = useState();
  const [typed, setTyped] = useState();

  const { data: signer, isError, isLoading } = useSigner();

  const executeTrans = useExecuteTransaction(
    address,
    value.to,
    value.amount,
    value.data,
    value.signatures,
    user
  );
  const hanldeSign = async (e) => {
    e.preventDefault();
    console.log("sign");

    const signature = await signer
      ?.signMessage(ethers.utils.arrayify(value.hash))
      .catch((err) => {
        alert(err);
      });

    if (signature) {
      const verified = ethers.utils.verifyMessage(
        ethers.utils.arrayify(value.hash),
        signature
      );

      let isOwner = false;

      owners.map((owner, i) => {
        if (
          owner.address === verified.toString().toLowerCase() &&
          owner.address === user.toString().toLowerCase()
        ) {
          isOwner = true;
        }
      });

      if (isOwner) {
        const newSignatures = [signature, ...value.signatures];
        const newSigners = [verified, ...value.signers];

        const transactionDetail = {
          chainID: 5,
          address: value.address,
          nonce: value.nonce,
          amount: value.amount,
          to: value.to,
          hash: value.hash,
          data: value.data,
          signatures: newSignatures,
          signers: newSigners,
        };
        const otherDetails = {
          description: value.description,
          purposer: value.purposer,
          purposedDate: value.purposedDate,
          status: value.status,
          executor: null,
          executed: null,
          transactionHash: null,
        };
        await postTransaction(transactionDetail, otherDetails)
          .then((res) => {
            console.log(res.request);
            console.log("successfully added to backend");
            setHasSigned(true);
            notifySuccess(`Signer Transaction signature: ${signature}`);
          })
          .catch((err) => {
            console.log("whoops");
            console.log(err);
            notifyError("Failed To sign and post", err);
          });
      } else {
        notifyError("Not Owner");
      }
    } else {
      notifyReject("You rejected to sign transaction");
    }
  };

  const notifySuccess = (message, hash) => {
    // e.preventDefault();
    toast.success(
      <>
        <p>Success</p> <h3>{message}</h3> <br />{" "}
        {hash && (
          <a
            target="_blank"
            rel="noopener
        noreferrer"
            href={`https://goerli.etherscan.io/tx/${hash}`}
          >
            Etherscan
          </a>
        )}
      </>,
      {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );
  };
  const notifyReject = (message) => {
    toast.error(
      <>
        <p>ERROR</p> <h3>Reason: {message}</h3>
      </>,
      {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );
  };
  const notifyError = (message, error) => {
    // e.preventDefault();
    toast.error(
      <>
        <p>Contract Error</p> <h3>{message}</h3> <br />{" "}
        <a
          target="_blank"
          rel="noopener
        noreferrer"
          href={`https://goerli.etherscan.io/tx/${error}`}
        >
          Etherscan
        </a>
      </>,
      {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );
  };
  const modalStyle = {
    content: {
      borderRadius: "2.5rem",
      bottom: "auto",
    },
  };
  const contractWrite = useContractWrite(executeTrans.config);

  const handleExecute = async (e) => {
    e.preventDefault();

    if (contractWrite.data == undefined) {
      console.log("undefined");
    } else {
      console.log(contractWrite.data);
    }

    setTyped("awaiting signature...");
    setLoadModal(true);
    await contractWrite
      .writeAsync()
      .then((con) => {
        setLoadingStage((prev) => true);
        setMessageTo([`signature: ${con.hash}`]);
        setTyped("awaiting transaction...");
        con.wait(1).then((res) => {
          if (contractWrite.isSuccess || res.status == 1) {
            console.log(res.transactionHash);
            setMessageTo([`signature ${con.hash}`, `transaciton confirmed`]);
            setTyped("pushing to database...");
            //notify
            //   notifySuccess("Executed Transaction", con.hash);
            notifySuccess("Executed Transaction", res.transactionHash);

            //updateDatabase
            //--value.status = 'success'
            //--value.transactionHash = res.transactionHash

            //--value.executor = user
            //--value.executed = Date.now()
            const transactionDetail = {
              chainID: 5,
              address: value.address,
              nonce: value.nonce,
              amount: value.amount,
              to: value.to,
              hash: value.hash,
              data: value.data,
              signatures: value.signatures,
              signers: value.signers,
            };
            const otherDetails = {
              description: value.description,
              purposer: value.purposer,
              purposedDate: value.purposedDate,
              status: "success",
              executor: user,
              executed: Date.now(),
              transactionHash: res.transactionHash,
            };
            console.log(transactionDetail, otherDetails);

            postTransaction(transactionDetail, otherDetails)
              .then((res) => {
                console.log(res.request);
                setMessageTo([
                  `signature ${con.hash}`,
                  `transaciton hash: ${res.transactionHash}`,
                  `updated DB`,
                ]);
                setTyped("waiting for data from block chain...");

                console.log("successfully added to backend");
              })
              .catch((err) => {
                console.log("whoops");
                notifyError("Error posting transaction", err);
                console.log(err);
              });
            //update DB for all other transactions with same nonce
            setTimeout(() => {
              setMessageTo([
                `signature ${con.hash}`,
                `transaciton hash: ${res.transactionHash}`,
                `updated DB`,
              ]);
              setTyped("updating DB nonces...");
              nonceUpdate(value.nonce, value.hash);
            }, [2000]);

            setTimeout(() => {
              setMessageTo([
                `Signature ${con.hash}`,
                `Transaciton hash: ${res.transactionHash}`,
                `Updated DB`,
                "Completed",
              ]);
              setTyped("migrating pages...");
              setLoadModal(false);

              setNewTransaction((prev) => true);
            }, [5000]);
          } else if (
            contractWrite.data?.status == "idle" ||
            contractWrite.data?.status == "error" ||
            contractWrite.isIdle == true ||
            res.status == 0
          ) {
            notifyError("Error see transaction hash", con.hash);
            setLoadModal(false);
            console.log("error see traNSACITON HASH", con.hash);
            console.log(contractWrite?.error?.message);
          } else {
            notifyReject(contractWrite?.error?.message);
            setLoadModal(false);
          }
        });
      })
      .catch((err) => {
        console.log("didnt event fire", err);
        setLoadModal(false);
      });
  };
  useEffect(() => {
    loadModal ? openModal() : closeModal();
  }, [loadModal]);

  useEffect(() => {
    if (value.to == address) {
      const res = decodeCallData(value.data, value.amount);
      console.log("transaction descrip", res);
      setTransactionDescription((prev) => res);
    } else if (value.to != address && value.description != "transferFunds") {
      parseExternalContractTransaction(value.to, value.data)
        .then((res) => {
          console.log("transaction descrip", res);
          setTransactionDescription((prev) => res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (value.description == "transferFunds") {
      const res = {
        name: "transferFunds",
        args: [`${value.to}`, `${value.amount}`],
        functionFragment: {
          name: "transferFunds",
          inputs: [
            {
              name: "transferTo",
              type: "address",
            },
            {
              name: "amount",
              type: "uint_256",
            },
          ],
        },
      };
      console.log("hello", res);
      setTransactionDescription(res);
    }
  }, []);
  useEffect(() => {
    if (user) {
      value.signers.includes(user) && setHasSigned((prev) => true);
    }
  }, [user, value.signers]);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleClick = (e) => {
    e.preventDefault();
    setShowTransactionDetails((prev) => !prev);
  };
  const showMenu = {
    enter: {
      opacity: 1,
      y: 0,
      display: "block",
      transition: {
        duration: 0.7,
      },
    },
    exit: {
      y: -5,
      opacity: 0,
      transition: {
        duration: 0.7,
      },
      transitionEnd: {
        display: "none",
      },
    },
  };

  return (
    <div className="">
      <div className="grid grid-cols-5 gap-x-2   bg-myBlue border-2 border-myOrange my-2 rounded-2xl text-white text-center">
        <div className="flex-col">
          <div>Nonce</div>
          <div> {value.nonce}</div>
        </div>
        <div className="flex-col">
          <div>Function</div>

          <div> {transactionDescription?.name}</div>
        </div>
        <div className="flex-col">
          <div>Value</div>
          <div>{value.amount}</div>
        </div>
        <button
          onClick={handleClick}
          className={`${
            value.status == "pending" ? "text-yellow-400" : "text-red-500"
          }`}
        >
          {value.status} {showTransactionDetails ? "🔼" : "🔽"}
        </button>
        {value.status === "pending" ? (
          <>
            <div className=" ">
              <div className="text-xs">
                ({value.signatures.length}of{signaturesRequired})
              </div>
              <button
                onClick={hanldeSign}
                disabled={hasSigned}
                className={`${
                  hasSigned ? "cursor-not-allowed" : "cursor-wait"
                } px-2 bg-myOrange text-white`}
              >
                {hasSigned ? "Already Signed" : "Sign"}
              </button>
              <button
                onClick={handleExecute}
                disabled={value.nonce > nonce}
                className={`${
                  signaturesRequired <= value.signatures.length &&
                  value.nonce == nonce
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                } px-2 text-myOrange bg-white`}
              >
                {loadingStage
                  ? "loading"
                  : value.nonce > nonce
                  ? `Wait ${value.nonce - nonce}`
                  : "Execute"}
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      <motion.div
        variants={showMenu}
        initial="exit"
        animate={showTransactionDetails ? "enter" : "exit"}
      >
        <div className="grid grid-cols-2  mx-4 border-2  border-orange-300 rounded-lg">
          <div className="col-span-2">
            <div className="grid grid-cols-4 gap-x-2   text-start pl-4">
              {transactionDescription?.args.map((args, i) => (
                <div key={args} className="row-span-1">
                  <div className="flex">
                    <div className="pr-2 first-letter:uppercase">
                      {transactionDescription.functionFragment?.inputs[i]?.name}
                    </div>

                    <div>
                      {
                        transactionDescription?.functionFragment?.inputs[i]
                          ?.type
                      }
                    </div>
                  </div>
                  {transactionDescription?.functionFragment?.inputs[i]?.type ==
                  "uint256" ? (
                    <div className="">
                      {ethers.utils.formatUnits(
                        transactionDescription?.args[i],
                        0
                      )}
                    </div>
                  ) : transactionDescription?.args[i].toString().length > 10 ? (
                    <div className="group">
                      <div className=" block group-hover:hidden">
                        {transactionDescription?.args[i]
                          .toString()
                          .slice(0, 12)}
                        ...
                      </div>
                      <div className="hidden group-hover:block text-xs flex-col">
                        <div>
                          {transactionDescription?.args[i]
                            .toString()
                            .slice(0, 15)}
                        </div>
                        <div>
                          {transactionDescription?.args[i]
                            .toString()
                            .slice(15, 30)}
                        </div>
                        <div>
                          {transactionDescription?.args[i]
                            .toString()
                            .slice(30, 45)}
                        </div>
                        <div>
                          {transactionDescription?.args[i]
                            .toString()
                            .slice(45, 70)}
                        </div>
                        <div>
                          {transactionDescription?.args[i]
                            .toString()
                            .slice(70, 95)}
                          ...
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>{transactionDescription?.args[i].toString()}</div>
                  )}
                  <CopyButton size={"16"}>
                    {transactionDescription?.args[i]}
                  </CopyButton>
                </div>
              ))}
              {value.to.toString() != address &&
                value.description != "transferFunds" && (
                  <div className="ml-12">
                    <h2>Contract: </h2>
                    <div className="flex flex-row">
                      <p className="text-sm">
                        {value.to.toString().slice(0, 6)}...
                        {value.to.toString().slice(38, 42)}
                      </p>
                      <CopyButton size={"22"}>{value.to.toString()}</CopyButton>
                    </div>
                  </div>
                )}
            </div>

            <div className="grid grid-rows-2 grid-flow-row text-left pl-6  content-start  gap-y-12">
              <div className="grid mt-10 grid-cols-4">
                <p className=" ">Created: {""}</p>
                <div className="flex-col ">
                  <p className="">
                    {new Date(value.purposedDate).toDateString()}
                  </p>
                  <p className="">
                    {new Date(value.purposedDate).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-lg">Purposer:</h3>
                  <p className="text-sm mt-2 flex ">
                    {value.purposer.toString().slice(0, 20)}...
                    {value.purposer.toString().slice(38, 42)}
                    <CopyButton size={"20"}>{value.purposer}</CopyButton>
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Description</h3>
                  <p>{value.description} </p>
                </div>
              </div>
              <div className="flex flex-row  ">
                <div className="flex-auto">
                  <div className="flex-col ">
                    <h3 className="pl-6">Signatures</h3>
                    <ul className="">
                      {value.signatures.map((signature, i) => (
                        <li
                          className="flex flex-row text-sm  "
                          key={signature + 1}
                        >
                          <b>{i + 1}:</b>
                          <b>{signature.toString().slice(0, 20)}...</b>
                          <CopyButton size={"20"}>{signature}</CopyButton>{" "}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex-auto ">
                  <div className="flex-col">
                    <h3 className="pl-6">Signers</h3>
                    <ul>
                      {value.signers.map((signer, i) => (
                        <li
                          className="flex flex-row text-sm  "
                          key={signer + 1}
                        >
                          <b>{i + 1}: </b>
                          <b>{signer.toString().slice(0, 20)}...</b>
                          <b>{signer.toString().slice(38, 42)}</b>
                          <CopyButton size={"20"}>{signer}</CopyButton>{" "}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={1}
      />
      <Modal
        isOpen={loadModal}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={modalStyle}
        contentLabel="TransactionDetails Modal"
      >
        <LoadingExecutedTransaction message={messageTo} typed={typed} />
      </Modal>
    </div>
  );
};

export default PendingTransaction;
