import axios from "axios";

export const getTransactionByHash = async (address, hash) => {
  const res = await axios.get(
    "http://localhost:49899" + `/getTransaction/${address}/5/${hash}`
  );

  return res;
};
