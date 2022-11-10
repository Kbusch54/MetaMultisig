import axios from "axios";

export default createWallet = async (
  creator,
  walletName,
  walletAddress,
  selectedChainId,
  walletData
) => {
  res = await axios.post(
    process.env.PORT ||
      49899 +
        `createWallet/${creator}/${walletName}/${walletAddress}/${selectedChainId}`,
    walletData
  );
  return res;
};
