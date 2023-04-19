import { ethers } from "ethers";

const axios = require("axios");

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export default async function parseExternalContractTransaction(
  contractAddress,
  txData
) {
  try {
    let response = await axios.get("https://api-goerli.etherscan.io/api", {
      params: {
        module: "contract",
        action: "getabi",
        address: contractAddress,
        apikey: "4G9SZJKRDCANUQQNRQ17P3UBE3YZT1E92W",
      },
    });

    const getParsedTransaction = async () => {
      const abi = response?.data?.result;

      if (abi && txData && txData !== "" && isJsonString(abi)) {
        const iface = new ethers.utils.Interface(JSON.parse(abi));
        return iface.parseTransaction({ data: txData });
      }
    };

    return await getParsedTransaction(response);
  } catch (error) {
    console.log("parseExternalContractTransaction error:", error);
  }
}
