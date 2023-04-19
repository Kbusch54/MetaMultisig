import { Address, Hash } from "@wagmi/core/dist/declarations/src/types";
import axios from "axios";
import { BigNumber } from "ethers";

type transactionDetails = {
  chainID: number;
  address: Address;
  nonce: number;
  to: Address;
  amount: BigNumber | number | null;
  hash: Hash;
  data: string;
  signatures: string[];
  singers: Address[];
};
type otherDetails = {
  description: string;
  purposer: Address | null;
  purposedDate: Date;
  status: string;
  executor: Address | null;
  executedDate: Date | null;
  transactionHash: string | null;
};

export const postTransaction = async (
  transactionDetails: transactionDetails,
  otherDetails: otherDetails
) => {
  console.log("check cehck check posting");
  console.log("addres to be key", transactionDetails.address);
  console.log("addres to be to exectue to", transactionDetails.to);
  const res = await axios.post("http://localhost:49899", {
    ...transactionDetails,
    ...otherDetails,
  });
  return res;
};
