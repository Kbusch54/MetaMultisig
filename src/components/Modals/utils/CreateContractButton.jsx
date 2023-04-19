import React, { useEffect, useState } from "react";
import { useContractWrite } from "wagmi";
import { useCreateContract } from "../../../utils/ContractInteractions/WrittingContractHooks/index";

function CreateContractButton({
  transactionCheck,
  address,
  owners,
  signaturesRequired,
  multiName,
  ethValue,
  closeModal,
  notifyError,
  notifySuccess,
  notifyReject,
  checkedBox,
}) {
  let newValue = ethValue;

  if (!checkedBox) {
    newValue = 0;
  }
  const { config, error } = useCreateContract(
    owners,
    multiName,
    signaturesRequired,
    newValue,
    address
  );

  const [loadingStage, setLoadingStage] = useState(false);

  const contractWrite = useContractWrite(config);

  const [errorWithContractLoad, setErrorWithContractLoad] = useState(false);
  useEffect(() => {
    if (error == null) {
      setErrorWithContractLoad(false);
    } else {
      setErrorWithContractLoad(true);
    }
  }, [error]);

  const handleWrite = async (e) => {
    e.preventDefault();
    setLoadingStage((prev) => true);
    await contractWrite

      .writeAsync()
      .then((con) => {
        con.wait(1).then((res) => {
          if (contractWrite.isSuccess || res.status == 1) {
            console.log(res.transactionHash);

            notifySuccess("Created MetaMultiSig", res.transactionHash);
            closeModal();
          } else if (
            contractWrite.data?.status == "idle" ||
            contractWrite.data?.status == "error" ||
            contractWrite.isIdle == true ||
            res.status == 0
          ) {
            notifyError("Error see transaction hash", con.hash);

            console.log("error see traNSACITON HASH", con.hash);
            console.log(contractWrite?.error?.message);
            closeModal();
          } else {
            notifyReject(contractWrite?.error?.message);
          }
        });
      })
      .catch((err) => {
        console.log("didnt event fire", err);
      });
  };
  if (contractWrite.isLoading || loadingStage)
    return (
      <div className="absolute bottom-8 right-8 px-8 py-2  rounded-3xl bg-teal-400 text-white">
        Processing…
      </div>
    );
  if (errorWithContractLoad)
    return (
      <div className="absolute bottom-8 right-8 px-8 py-2  rounded-3xl bg-red-600 text-white animate-pulse">
        Error WIth current transaciton…
      </div>
    );

  return (
    <>
      <button
        onClick={handleWrite}
        disabled={!contractWrite?.write}
        className={`absolute bottom-8 right-8 px-8 py-2  rounded-3xl  ${
          transactionCheck
            ? "bg-green-500 text-white hover:scale-110 "
            : "hover:animate-none text-black bg-myGray cursor-not-allowed"
        }`}
      >
        Create Contract
      </button>
    </>
  );
}

export default CreateContractButton;
