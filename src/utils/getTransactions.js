import { axios } from "axios";
export default getTransactions = async (address, chainId) => {
  const res = await axios.get(
    process.env.PORT || 49899 + address + "_" + chainId
  );
  return res;
};
