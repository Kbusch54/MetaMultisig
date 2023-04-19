import axios from "axios";
// type transactionDetails = {
//   nonce: number;
//   to: string;
//   value: string;
//   calldata: string;
//   hash: string;
// };
// type transaction = {
//   transactionDetails: transactionDetails;
//   signatures: string[];
//   signersAddress: string[];
// };
// type input = {
//   address: string;
//   chainId: number;
// };
export const getTransactions = async (address, chainId) => {
  const data = await axios.get(
    "http://localhost:49899/" + address + "_" + chainId
  );
  return data;
};
