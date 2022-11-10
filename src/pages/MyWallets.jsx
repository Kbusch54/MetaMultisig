import React, { useState, useEffect } from "react";
import wallets from "../utils/dummyData/wallets.json";
import { useAccount, useBalance, chain, chainId } from "wagmi";
import Wallet from "../components/Wallet";

// type Props = {};
// type Create2Event = {
//   contractId: number;
//   name: string;
//   contractAddress: string;
//   creator: string;
//   owners: string[];
//   signaturesRequired: number;
// };

const MyWallets = () => {
  const { address, isConnecting, isDisconnected } = useAccount();

  // wallets.Create2Event.map((wallet, i) => {
  //   if (wallet.owners.includes(address)) {
  //     console.log("yes");
  //   }
  // });
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  if (!initialRenderComplete) {
    return null;
  } else {
    return (
      <div>
        <div className="flex gap-4 p-12">
          {wallets.Create2Event.map((wallet, i) => (
            <>
              {wallet.owners.includes(address) && (
                <Wallet
                  key={wallet.contractId}
                  owners={wallet.owners}
                  name={wallet.name}
                  contractId={wallet.contractId}
                  contractAddress={wallet.contractAddress}
                  sigsReq={wallet.signaturesRequired}
                  creator={wallet.creator}
                />
              )}
              {/* {wallet.owners.map((owner, i) => (
              <p
                key={i}
                className={`${owner === address ? "text-orange-200" : ""}`}
              >
                {owner}
              </p>
            ))} */}
            </>
          ))}
        </div>
      </div>
    );
  }
};

export default MyWallets;
