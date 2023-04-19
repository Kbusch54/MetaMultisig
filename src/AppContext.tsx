import React, { createContext, ReactNode, useContext, useState } from "react";
type userContextType = {
  address: string | undefined;
  connected: boolean;
  connect: (str: string) => void;
  unConnect: () => void;
};

const userContextDefaultValues: userContextType = {
  address: undefined,
  connected: false,
  connect: () => {},
  unConnect: () => {},
};
const UserContext = createContext<userContextType>(userContextDefaultValues);

export function useUser() {
  return useContext(UserContext);
}
type Props = {
  children: ReactNode;
};

export function UserProvider({ children }: Props) {
  const [address, setAddress] = useState<string>();
  const [connected, setConnected] = useState<boolean>(false);

  const connect = (inputAddress: string) => {
    setAddress(inputAddress);
    setConnected(true);
  };
  const unConnect = () => {
    setAddress(undefined);
    setConnected(false);
  };
  const value = { address, connected, connect, unConnect };
  return (
    <>
      <UserContext.Provider value={value}>{children}</UserContext.Provider>
    </>
  );
}
