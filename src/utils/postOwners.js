import axios from "axios";

export default postOwners = async (
  ownerAddress,
  contractAddress,
  ownersData
) => {
  res = await axios.post(
    process.env.PORT ||
      49899 + `updateOwners/${ownerAddress}/${contractAddress}`,
    ownersData
  );
  return res;
};
