import React from "react";

type Props = {};

const Hero = (props: Props) => {
  return (
    <div className="flex flex-col justify-center  ">
      <div className="ml-8 px-2 py-4">
        <div className="text-3xl  text-[#FFFFFF]">Welcome to METAMultiSig</div>
        <p className="text-lg ml-6 px-8 text-white">
          This is an offchain mutlisig wallet that allows you and other owners
          to sign transactions off chain then proof onchain prior to execution.
          Either create a new wallet or import an existing wallet that you made
          with us
        </p>
      </div>

      <div className="border-2 gap-3  border-white flex flex-row  justify-between align-top bg-[#f18805] px-12 pt-4 pb-24 rounded-lg w-2/3 ml-12 relative">
        <div className=" w-1/2 relative ">
          <div className="text-2xl text-white">Create a Wallet</div>
          <p className="mt-2 text-white">
            Create a multisig wallet. Add other signers addresses and name of
            wallet. You will have to pay gas, on chain.
          </p>
          <button className="hero-button">Create MetaMutliSigWallet</button>
        </div>
        <div className="border h-full  left-[29.5rem] absolute bottom-[0.05rem]"></div>
        <div className="w-1/2 relative">
          <div className="text-2xl text-white">Load Exsiting Wallet</div>
          <p className="mt-2 text-white">
            Load an exsiting wallet address. Any wallet contract will work as
            long as the abi is the same. If loading an other wallet not all
            functionallity of this dapp will be available, security cannot be
            gaurenteed. Or load an existing wallet contract that you created
            with us that is not showing up
          </p>

          <button className="hero-button">Import Exsiting Wallet</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
