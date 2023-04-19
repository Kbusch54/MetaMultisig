import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import parseExternalContractTransaction from "../../helpers/parseExternalContractTransaction";
import CopyButton from "../Modals/utils/buttons/CopyButton";
import { decodeCallData } from "../../utils/Transactions/functions";
import { getTransactionByHash } from "../../utils/getTransactionByHash";
import { ProgressBar, Grid } from "react-loader-spinner";
import Image from "next/image";
import etherscan from "../../public/assets/etherscan.svg";

const PastTransaction = ({ transaction, address }) => {
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [transactionFromServer, setTransactionFromServer] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [decodedData, setDecodedData] = useState();

  useEffect(() => {
    async function go() {
      const re = await getTransactionByHash(address, transaction.hash);

      if (!re.data) {
        console.log("no backend data");
      } else {
        setTransactionFromServer(re.data);

        if (
          re.data.to.toString().toLowerCase() ===
          address.toString().toLowerCase()
        ) {
          const b = decodeCallData(re.data.data, re.data.amount.toString());
          setDecodedData((prev) => b);
          if (b == undefined || b?.functionFragment == undefined) {
            console.log("NO decdoded data");
          } else {
            setIsLoading((prev) => false);
          }
        } else if (re.data.description == "transferFunds") {
          const res = {
            name: "transferFunds",
            args: [`${re.data.to}`, `${re.data.amount}`],
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

          setDecodedData(res);
          setIsLoading((prev) => false);
        } else {
          const b = await parseExternalContractTransaction(
            transaction.to,
            re.data.data
          );

          setDecodedData((prev) => b);
          if (b == undefined || b?.functionFragment == undefined) {
            console.log("NO decdoded data");
          } else {
            setIsLoading((prev) => false);
          }
        }
      }
    }
    go();
  }, [address]);
  useEffect(() => {}, [isLoading]);

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
  if (isLoading) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-evenly gap-x-4  my-4 bg-myBlue border-2 border-myOrange text-white rounded-2xl  relative   ">
            <div className="flex-col">
              <div>Nonce</div>
              <div>
                {" "}
                <ProgressBar
                  ariaLabel="progress-bar-loading"
                  height={40}
                  width={40}
                  wrapperClass={{}}
                  wrapperStyle={{}}
                  borderColor="#F4442E"
                  barColor="#51E5FF"
                />
              </div>
            </div>
            <div className="flex-col">
              <div>Function</div>
              <div>
                {" "}
                <ProgressBar
                  ariaLabel="progress-bar-loading"
                  height={40}
                  width={40}
                  wrapperClass={{}}
                  wrapperStyle={{}}
                  borderColor="#F4442E"
                  barColor="#51E5FF"
                />
              </div>
            </div>
            <div className="flex-col">
              <div>Value</div>
              <div>
                <ProgressBar
                  ariaLabel="progress-bar-loading"
                  height={40}
                  width={40}
                  wrapperClass={{}}
                  wrapperStyle={{}}
                  borderColor="#F4442E"
                  barColor="#51E5FF"
                />
              </div>
            </div>
            <div className="flex-col ">
              <div className=" mt-[0.8rem] absolute  ml-5 ">
                <Grid
                  ariaLabel="progress-bar-loading"
                  height={40}
                  width={40}
                  color="#51E5FF"
                  wrapperClass={{}}
                  wrapperStyle={{}}
                  borderColor="#F4442E"
                  barColor="#51E5FF"
                />
              </div>
            </div>
            <button className="text-green-200">Success {"🔼"}</button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="">
        <div className="flex flex-row justify-evenly gap-x-4  my-4 bg-myBlue border-2 border-myOrange  rounded-2xl text-white relative">
          <div className="flex-col">
            <div>Nonce</div>
            <div> {transaction.nonce}</div>
          </div>
          <div className="flex-col">
            <div>Function</div>

            <div> {decodedData.functionFragment.name}</div>
          </div>
          <div className="flex-col">
            <div>Value</div>
            <div>{transactionFromServer.amount}</div>
          </div>
          <div className="flex-col">
            <div className=" mt-[0.35rem] absolute   ">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://goerli.etherscan.io/tx/${transactionFromServer.transactionHash}`}
              >
                <Image
                  src={etherscan}
                  className={" bg-white rounded-full "}
                  alt={"etherscan"}
                  height={35}
                  width={80}
                />
              </a>
            </div>
          </div>
          <button onClick={handleClick} className="text-green-200">
            Success {showTransactionDetails ? "🔼" : "🔽"}
          </button>
        </div>

        <motion.div
          variants={showMenu}
          initial="exit"
          animate={showTransactionDetails ? "enter" : "exit"}
        >
          <div className="grid grid-cols-3  mx-4 border-2  border-orange-300 rounded-lg">
            <div className="col-span-2">
              <div className="grid grid-cols-4 gap-x-2   text-start pl-4">
                {decodedData?.args.map((args, i) => (
                  <div key={args} className="row-span-1">
                    <div className="flex">
                      <div className="pr-2 first-letter:uppercase">
                        {decodedData.functionFragment.inputs[i].name}
                      </div>

                      <div>{decodedData.functionFragment.inputs[i].type}</div>
                    </div>
                    {decodedData.functionFragment.inputs[i].type ==
                    "uint256" ? (
                      <div className="text-center">
                        {ethers.utils.formatUnits(decodedData?.args[i], 0)}
                      </div>
                    ) : decodedData?.args[i].toString().length > 10 ? (
                      <div className="group">
                        <div className=" block group-hover:hidden">
                          {decodedData?.args[i].toString().slice(0, 12)}
                          ...
                        </div>
                        <div className="hidden group-hover:block text-xs flex-col">
                          <div>
                            {decodedData?.args[i].toString().slice(0, 15)}
                          </div>
                          <div>
                            {decodedData?.args[i].toString().slice(15, 30)}
                          </div>
                          <div>
                            {decodedData?.args[i].toString().slice(30, 45)}
                          </div>
                          <div>
                            {decodedData?.args[i].toString().slice(45, 70)}
                          </div>
                          <div>
                            {decodedData?.args[i].toString().slice(70, 95)}
                            ...
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>{decodedData?.args[i].toString()}</div>
                    )}
                    <CopyButton size={"16"}>{decodedData?.args[i]}</CopyButton>
                  </div>
                ))}

                {transactionFromServer.to.toString() != address &&
                  transactionFromServer.description != "transferFunds" && (
                    <div className="ml-12">
                      <h2>Contract: </h2>
                      <div className="flex flex-row">
                        <p className="text-sm">
                          {transactionFromServer.to.toString().slice(0, 6)}...
                          {transactionFromServer.to.toString().slice(38, 42)}
                        </p>
                        <CopyButton size={"22"}>
                          {transactionFromServer.to.toString()}
                        </CopyButton>
                      </div>
                    </div>
                  )}
              </div>

              <div className="grid grid-rows-2 grid-flow-row text-left pl-2  content-start  gap-y-12">
                <div className="grid mt-10 grid-cols-7 gap-x-4">
                  <p className=" ">Created: {""}</p>
                  <div className="flex-col ">
                    <p className="">
                      {new Date(
                        transactionFromServer.purposedDate
                      ).toDateString()}
                    </p>
                    <p className="">
                      {new Date(
                        transactionFromServer.purposedDate
                      ).toLocaleTimeString()}
                    </p>
                  </div>
                  <br />
                  <div className="flex gap-x-3 ">
                    <div className="flex-col">
                      <h3 className="font-bold text-lg">Purposer:</h3>
                      <p className="text-sm mt-2 flex ">
                        {transactionFromServer.purposer.toString().slice(0, 10)}
                        ...
                        {transactionFromServer.purposer
                          .toString()
                          .slice(38, 42)}
                        <CopyButton size={"20"}>
                          {transactionFromServer.purposer}
                        </CopyButton>
                      </p>
                    </div>
                  </div>
                  <br />
                  <div className="flex-col col-span-2 ml-4">
                    <h3 className="font-bold text-lg mb-1">Description:</h3>
                    <p className="text-sm">
                      {transactionFromServer.description}{" "}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row  ">
                  <div className="flex-auto">
                    <div className="flex-col pl-4">
                      <h3 className="">Signatures</h3>
                      <ul className="">
                        {transactionFromServer?.signatures.map(
                          (signature, i) => (
                            <li
                              className="flex flex-row text-sm  "
                              key={signature + 1}
                            >
                              <b>{i + 1}:</b>
                              <b>{signature.toString().slice(0, 20)}...</b>
                              <CopyButton size={"20"}>
                                {signature}
                              </CopyButton>{" "}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="flex-auto ">
                    <div className="flex-col">
                      <h3 className="">Signers</h3>
                      <ul>
                        {transactionFromServer?.signers.map((signer, i) => (
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

            <div className="col-span-1 border-2 border-emerald-200 grid text-left ">
              <div className="px-8">
                <div className="font-bold">Created</div>
                <div>
                  {new Date(transactionFromServer.purposedDate).toDateString()}
                </div>
                <div>
                  {new Date(
                    transactionFromServer.purposedDate
                  ).toLocaleTimeString()}
                </div>
              </div>
              <div className="px-8">
                <p>Signers ({transactionFromServer.signers.length} )</p>
                <ul>
                  {transactionFromServer?.signers.map((signer, i) => (
                    <li className="flex flex-row text-sm  " key={signer + 1}>
                      <b>{i + 1}: </b>
                      <b>{signer.toString().slice(0, 20)}...</b>
                      <b>{signer.toString().slice(38, 42)}</b>
                      <CopyButton size={"20"}>
                        {signer.toString()}
                      </CopyButton>{" "}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-8">
                <div className="font-bold">Executed</div>
                <div>
                  {new Date(transactionFromServer.executed).toDateString()}
                </div>
                <div>
                  {new Date(
                    transactionFromServer.executed
                  ).toLocaleTimeString()}
                  .
                </div>
              </div>
              <div className="ml-8">
                <div className="font-bold ">Executor</div>
                <div>{transactionFromServer.executor}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
};

export default PastTransaction;
