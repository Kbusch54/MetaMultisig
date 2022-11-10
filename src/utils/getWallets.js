export default getWallets = async (address) => {
  let res = await axios.get(
    process.env.PORT || 48998 + `getWallets/${address}`
  );
  return res;
};
