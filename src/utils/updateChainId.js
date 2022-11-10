import axios from "axios";
export default updateChainId = async (ownerAddress, walletAddress, chainId) => {
  const res = axios.get(
    process.env.PORT ||
      48998 + `/updateChainId/:${ownerAddress}/:${walletAddress}/:${chainId}`
  );
  return res;
};
