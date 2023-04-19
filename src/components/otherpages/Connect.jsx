import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
const Connect = () => {
  const router = useRouter();
  const { address, isConnecting } = useAccount({
    onConnect() {
      router.push("/");
    },
  });
  return (
    <div className="flex align-middle justify-center mt-24">
      <ConnectButton showBalance={true} className="" />
    </div>
  );
};

export default Connect;
