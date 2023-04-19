import React from "react";
import TokenBalance from "./TokenBalance";
import { Address } from "@wagmi/core/dist/declarations/src/types";
import { tokenAddress } from "../../utils/Constants/tokenAddress";

type Props = {
  address: Address;
};

const TokenBalances = (props: Props) => {
  return (
    <div className="">
      <h1>Token Balances</h1>
      <div className="flex flex-row justify-evenly">
        {tokenAddress.map((token, i) => (
          <TokenBalance
            key={token.address}
            address={props.address}
            tokenAddress={token.address}
            tokenLogo={token.logo}
          />
        ))}
      </div>
    </div>
  );
};

export default TokenBalances;
