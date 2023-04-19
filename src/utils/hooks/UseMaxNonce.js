import React, { useEffect, useState } from "react";
import { getTransactions } from "../getTransactions";
export const useMaxNonce = (walletAddress) => {
  const [maxNonce, setMaxNonce] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const nonceData = setTimeout(() => {
      const go = async () => {
        const res = await getTransactions(walletAddress, 5).catch((err) => {
          setIsPending(false);
          setError(err.message);
        });

        if (!res) {
          setError("cannot get infromation");
          throw Error("cannot get information");
        }
        let newNonce = [];

        const respon = Object.entries(res.data);

        respon.map((trans) => {
          if (trans[1].status == "pending") {
            newNonce.push(trans[1].nonce);
          }
        });
        if (!isMounted) return;
        setMaxNonce(newNonce);
        setIsPending(false);
      };
      go();
    }, [5000]);
    return () => {
      clearInterval(nonceData);
      isMounted = false;
    };
  }, [walletAddress]);
  return { maxNonce, isPending, error };
};
