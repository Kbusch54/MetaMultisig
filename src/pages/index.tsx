import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAccount, useBalance, chain, chainId } from "wagmi";
import Hero from "../components/Hero";
import Nav from "../components/Nav";



const Home: NextPage = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
    chainId: chain.goerli.id,
  });
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  if (!initialRenderComplete) {
    return null;
  } else {
    return (
      <div className=" h-screen bg-[#16cfcb]">
        <Hero />
      </div>
    );
  }
};

export default Home;
