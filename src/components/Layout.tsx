import { useAccount, useDisconnect } from "wagmi";
import Load from "../components/otherpages/Load";
import Connect from "../components/otherpages/Connect";
import Nav from "./Nav";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

const Layout = ({ children }: any) => {
  const [isConnected, setIsConnected] = useState(false);
  let content;
  const [account, setAccount] = useState("");

  const { address, isConnecting, isDisconnected, isReconnecting, status } =
    useAccount({
      onConnect({ address }) {
        if (address == account) {
          console.log("conncted address == account");
          setIsConnected(true);
        } else if (address != account) {
          console.log("conncted to new account");
          setAccount(address!);
          setIsConnected(true);
        }
        // router.push("/");
      },
      onDisconnect() {
        console.log("1", address);
        console.log("1", isDisconnected);
        console.log("1", status);

        setTimeout(() => {
          console.log("2", address);
          console.log("2", isDisconnected);
          console.log("2", status);
        }, 10000);
        console.log("3", address);
        console.log("3", isDisconnected);
        console.log("3", status);
      },
    });
  const router = useRouter();
  // const accountMemo = useMemo(() => checkContent(account), [account]);
  // console.log(accountMemo);
  useEffect(() => {}, [isConnected]);

  // function checkContent(account: string) {
  if (!isConnected && isDisconnected) {
    content = <Connect />;
  } else if (isConnected) {
    content = (
      <div>
        <Nav address={address} />

        {children}

        {/* <Footer /> */}
      </div>
    );
  }
  // }

  return <>{content}</>;
};

export default Layout;
