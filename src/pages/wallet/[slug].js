import React, { useEffect, useState, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import { client } from "../_app";
import Image from "next/image";
import { useGetNonce } from "../../utils/ContractInteractions/ReadingContractHooks";
import { useMaxNonce } from "../../utils/hooks/UseMaxNonce";
import {
  PastTransactions,
  PendingTransactions,
} from "../../components/transactions";
import { TokenBalances } from "../../components/tokenBalances";
import etherscan from "../../public/assets/etherscan.svg";
import CreateTransaction from "../../components/CreateTransaction";
import { useBalance } from "wagmi";
import { FallingLines } from "react-loader-spinner";

const IndividualWallet = ({ multiSig, balance }) => {
  const router = useRouter();
  const [selectMenu, setSelectMenu] = useState("createTransaction");
  const [newTransaction, setNewTransaction] = useState(false);
  const [multiSigData, setData] = useState(multiSig);
  const getNonceRes = useGetNonce(multiSig.address);
  const [walletNonce, setWalletNonce] = useState(getNonceRes.nonce);
  const handleButton = (e) => {
    e.preventDefault();
    setSelectMenu(e.target.id);
  };
  const refetchTransactions = async (selectMenuFromProps) => {
    const GET_CONTRACT_DATA = gql`
      query getContractData($id: String!) {
        multiSigContract(id: $id) {
          id
          address
          name
          signaturesRequired
          creator
          executedTransactions {
            executor
            to
            data
            nonce
            hash
            result
          }
          owners {
            address
          }
        }
      }
    `;

    setTimeout(async () => {
      const { data } = await client.query({
        query: GET_CONTRACT_DATA,
        variables: {
          id: multiSig.address + "_",
        },
      });

      router.replace(router.asPath);
      setData(data.multiSigContract);
      setNewTransaction((prev) => false);
      selectMenuFromProps("past");

      let nonce = 0;

      data.multiSigContract?.executedTransactions?.map((trans) => {
        Number(trans.nonce) > nonce ? (nonce = Number(trans.nonce)) : "";
      });
      setWalletNonce(nonce + 1);
    }, [5500]);
  };
  useLayoutEffect(() => {
    if (newTransaction == true) {
      const selectMenuFromProps = (newMenu) => {
        setSelectMenu((prev) => newMenu);
      };

      const go = async () => {
        await refetchTransactions(selectMenuFromProps);
      };
      go();
    }
  }, [newTransaction, router]);

  useLayoutEffect(() => {}, [multiSigData]);

  const {
    address,
    creator,
    name,
    owners,
    signaturesRequired,
    executedTransactions,
  } = multiSigData;
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
    chainId: 5,
    cacheTime: 2_000,
    watch: true,
  });

  const pendingNonces = useMaxNonce(address);

  return (
    <div className="flex flex-col mx-6 mt-2">
      <div className="flex flex-row px-10 ">
        <div className="flex-1">
          <div className="flex flex-row">
            <div className="flex-col">
              <div className="text-4xl uppercase">{name}</div>
              <div className=" text-lg  ">
                <div className="pr-12">{address}</div>
              </div>
            </div>
            <div className="text-center pl-8 -mt-2">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://goerli.etherscan.io/address/${address}`}
              >
                <Image
                  alt="etherscan"
                  width={100}
                  height={100}
                  src={etherscan}
                />
              </a>
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex flex-row gap-4 text-center mx-2 ">
            <div className=" flex-col">
              <div>Owners</div>
              <div>{owners.length}</div>
            </div>
            <div className="flex-col">
              <div>Signatures Required</div>
              <div>{signaturesRequired}</div>
            </div>
            <div className="flex-col ">
              <div>Balance</div>
              <div>
                {data.formatted} {data.symbol}
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="h-[10px]"></hr>
      <div className="flex flex-row">
        <div className="flex-1">
          <div>Creator</div>
          <div>{creator}</div>
        </div>
        <div>
          <div className="">Signers</div>
          <ul>
            {owners.map((owner, i) => (
              <li key={owner.address + "l"}>{owner.address}</li>
            ))}
          </ul>
        </div>
      </div>
      <hr />
      <TokenBalances address={address} />
      <hr />
      <div className="flex flex-row ">
        <button
          id="createTransaction"
          className={`px-4 py-2 w-1/3 rounded-2xl border-2 border-black text-white bg-myOrange hover:scale-90 ${
            selectMenu === "createTransaction" && "bg-orange-500 scale-90"
          }`}
          disabled={selectMenu === "createTransaction"}
          onClick={handleButton}
        >
          Create Transaction
        </button>
        <button
          id="past"
          className={`px-4 py-2 w-1/3 rounded-2xl border-2 border-black text-white bg-myOrange hover:scale-90 ${
            selectMenu === "past" && "bg-orange-500 scale-90"
          }`}
          disabled={selectMenu === "past"}
          onClick={handleButton}
        >
          Past Transaction
        </button>
        <button
          id="pending"
          className={`px-4 py-2 w-1/3 rounded-2xl border-2 border-black text-white bg-myOrange hover:scale-90 ${
            selectMenu === "pending" && "bg-orange-500 scale-90"
          }`}
          disabled={selectMenu === "pending"}
          onClick={handleButton}
        >
          Pending Transactions
        </button>
        <button
          id="failed"
          className={`px-4 py-2 w-1/3 rounded-2xl border-2 border-black text-white bg-myOrange hover:scale-90 ${
            selectMenu === "failed" && "bg-orange-500 scale-90"
          }`}
          disabled={selectMenu === "failed"}
          onClick={handleButton}
        >
          Failed Transactions
        </button>
      </div>
      <hr />
      {selectMenu === "createTransaction" && getNonceRes.isPending === true && (
        <>
          <FallingLines />
        </>
      )}
      {selectMenu === "createTransaction" &&
        getNonceRes.isPending === false &&
        getNonceRes.nonce >= 0 && (
          <>
            <CreateTransaction
              address={address}
              signaturesRequired={signaturesRequired}
              nonce={getNonceRes.nonce}
              owners={owners}
              setSelectMenu={setSelectMenu}
              pendingNonces={pendingNonces.maxNonce}
            />
          </>
        )}

      {selectMenu === "past" && (
        <PastTransactions
          executedTransactions={executedTransactions}
          address={address}
        />
      )}
      {(selectMenu === "pending" || selectMenu === "failed") && (
        <PendingTransactions
          walletAddress={address}
          nonce={getNonceRes.nonce}
          signaturesRequired={signaturesRequired}
          setNewTransaction={setNewTransaction}
          selectMenu={selectMenu}
          owners={owners}
        />
      )}
    </div>
  );
};

export default IndividualWallet;

export const getServerSideProps = async (context) => {
  const conAdd = context.params.slug;
  const GET_CONTRACT_DATA = gql`
    query getContractData($id: String!) {
      multiSigContract(id: $id) {
        id
        address
        name
        signaturesRequired
        creator
        executedTransactions {
          executor
          to
          data
          nonce
          hash
          result
        }
        owners {
          address
        }
      }
    }
  `;
  const { data } = await client.query({
    query: GET_CONTRACT_DATA,
    variables: {
      id: conAdd + "_",
    },
  });
  return {
    props: {
      multiSig: data.multiSigContract,
    },
  };
};
