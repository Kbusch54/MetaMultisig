import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Hero from "../components/Hero";
import Connect from "../components/otherpages/Connect";

const Home: NextPage = () => {
  const { address } = useAccount();

  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  if (!initialRenderComplete) {
    return null;
  } else {
    return (
      <div className=" h-screen bg-[#16cfcb]">
        {address ? <Hero address={address} /> : <Connect />}
      </div>
    );
  }
};

export default Home;
