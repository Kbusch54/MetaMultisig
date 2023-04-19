import React, { useState, useEffect } from "react";
import { useBalance } from "wagmi";

// Setup: npm install alchemy-sdk
import { Alchemy, Network } from "alchemy-sdk";
import Image from "next/image";

// type Props = {
//   address: Address;
//   tokenAddress: Address | string;
//   tokenLogo: string | null;
// };
// type metaDataToken = {
//   name: string | null;
//   decimals: Number | null;
//   logo: string | null;
//   symbol: string | null;
// };

const TokenBalance = (props) => {
  const [data, updateDate] = useState();
  const [loading, setLoading] = useState(true);
  const bal = useBalance({
    addressOrName: props.address,
    token: props.tokenAddress,
  });
  const config = {
    apiKey: process.env.ALCHEMY_API_KEY || "NX0zVuIVZSWreJ9zbABIAfjF8ZTim44Y",
    network: Network.ETH_GOERLI,
  };
  const alchemy = new Alchemy(config);
  useEffect(() => {
    const go = async () => {
      const metadata = await alchemy.core.getTokenMetadata(props.tokenAddress);
      updateDate((prev) => metadata);

      setLoading((prev) => false);
    };
    go();
  }, []);
  // let metaDataToken = {
  //   name: null,
  //   decimals: null,
  //   logo: null,
  //   symbol: null,
  // };

  // The token address we want to query for metadata
  //   const metadata = await alchemy.core.getTokenMetadata(props.tokenAddress);
  // .then((res) => {
  //   console.log("TOKEN METADATA");
  //   //   console.log(metadata);
  //   console.log(res);
  //   metaDataToken.name = res.name;
  //   console.log(
  //     "name check insodefunction",
  //     res.name,
  //     "+++",
  //     metaDataToken.name
  //   );
  //   metaDataToken.decimals = res.decimals;
  //   metaDataToken.logo = res.logo;
  //   metaDataToken.symbol = res.symbol;
  //   setLoading((prev) => false);

  // })
  // .catch((err) => {
  //   console.log(err);
  //   console.log("whoopsie");
  // });

  let content = <></>;
  if (!loading && data) {
    content = (
      <div className="flex flex-col p-2 bg-purple-400 border-stone-600 border-2 rounded-2xl mb-4 py-3 ">
        <div className="text-white px-2 bg-slate-500 rounded-3xl text-center mb-2">
          {data.name}
        </div>
        <div className=" flex flex-row px-4 gap-x-2 py-1 justify-center bg-slate-200 rounded-3xl text-center ">
          {data.logo == null && props.tokenLogo == null ? (
            <>{data.symbol}</>
          ) : (
            <Image
              alt={data.symbol || "tokenlogo"}
              src={`${data.logo != null ? data.logo : props.tokenLogo}`}
              height={20}
              width={20}
            />
          )}
          <div>{bal.data?.formatted}</div>
          {/* {data.logo != null ? data.logo : props.tokenLogo} */}
        </div>
      </div>
    );
  }
  return <>{content}</>;
};

export default TokenBalance;
