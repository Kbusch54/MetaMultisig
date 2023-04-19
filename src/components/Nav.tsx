import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import Image from "next/image";
import { motion } from "framer-motion";
import wallet from "../public/assets/wallet.svg";
import Link from "next/link";

type Props = {};

const Nav = ({ children, address }: any) => {
  const disconnect = useDisconnect({
    onSettled(data, error) {},
  });

  // const { address, isConnecting, isDisconnected } = useAccount();
  return (
    <div className="py-12 px-20  flex justify-between bg-[#f18805] ">
      <Link href={"/"}>
        <div className="flex flex-col">
          {" "}
          <motion.div
            className="text-2xl text-white  mt-[1.8rem] ml-20 z-20 "
            initial={{
              x: -200,
              opacity: 0,
            }}
            transition={{ duration: 3 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            METAMultiSig
          </motion.div>
          <div className="absolute">
            <Image
              // className=" ml-20  "
              src={wallet}
              alt="image"
              width={"90px"}
              height={"90px"}
            />
          </div>
        </div>
      </Link>
      <div className="flex flex-row gap-24 text-xl text-white pt-8 dec">
        <Link href={"/"}>Home</Link>
        <Link
          href={{ pathname: "/MyWallets", query: { account: `${address}` } }}
        >
          <a>Wallets</a>
        </Link>
        <Link href={"/Bubba"}>Faucet</Link>
      </div>
      <ConnectButton showBalance={true} />
    </div>
  );
};

export default Nav;
