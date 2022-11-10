import axios from "axios";

export default postTransaction = async (item, finalSigList, finalSigners) => {
  res = await axios.post(process.env.PORT || 49899, {
    ...item,
    signatures: finalSigList,
    signers: finalSigners,
  });
  return res;
};
