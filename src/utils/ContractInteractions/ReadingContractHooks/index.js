import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
// import { setTimeout } from "timers/promises";
import { useProvider } from "wagmi";
import { MultiSigABI as multiWalletAbi } from "../../Constants/abi";
export const useReadNonce = (walletAddress) => {
  const [nonce, setNonce] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const provider = useProvider();
  console.log(walletAddress);
  const contract = new ethers.Contract(walletAddress, multiWalletAbi, provider);
  useEffect(() => {
    setTimeout(() => {
      contract
        .nonce()
        .then((res) => {
          if (!res) {
            throw Error("could not read contract");
          }

          return res.toNumber();
        })
        .then((data) => {
          setNonce(data);
          setIsPending(false);
          setError(null);
        })
        .catch((err) => {
          setIsPending(false);
          setError(err.message);
        });
    }, 1000);
  }, []);
  return { nonce, isPending, error };
};
export const useGetNonce = (walletAddress) => {
  const [nonce, setNonce] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const provider = useProvider();

  const contract = new ethers.Contract(walletAddress, multiWalletAbi, provider);
  useEffect(() => {
    let isMounted = true;
    const nonceData = setTimeout(() => {
      contract
        .nonce()
        .then((res) => {
          if (!res) {
            throw Error("could not read contract");
          }

          return res.toNumber();
        })
        .then((data) => {
          if (!isMounted) return;
          setNonce(data);
          setIsPending(false);
          setError(null);
        })
        .catch((err) => {
          setIsPending(false);
          setError(err.message);
        });
    }, 10000);
    return () => {
      clearInterval(nonceData);
      isMounted = false;
    };
  }, [walletAddress, useState]);
  return { nonce, isPending, error };
};
export const useRecover = (hash, signature) => {
  const [address, setAddress] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const provider = useProvider();

  const contract = new ethers.Contract(
    "0xda7C6f49DA733988e5a41a1613DAc84c5c87e0C4",
    multiWalletAbi,
    provider
  );
  useEffect(() => {
    setTimeout(() => {
      contract
        .recover(hash, signature)
        .then((res) => {
          if (!res) {
            throw Error("could not read contract");
          }

          return res;
        })
        .then((data) => {
          setAddress(data);
          setIsPending(false);
          setError(null);
        })
        .catch((err) => {
          setIsPending(false);
          setError(err.message);
        });
    }, 1000);
  }, []);
  return { address, isPending, error };
};
// export const useCheckContractName = (name) => {
//   const [nameCheck = setNameCheck] = useState(false);
//   const [isPending, setIsPending] = useState(true);
//   const [error, setError] = useState(null);

//   const provider = useProvider();
//   console.log(walletAddress);
//   const contract = new ethers.Contract(
//     "0xda7C6f49DA733988e5a41a1613DAc84c5c87e0C4",
//     multiWalletAbi,
//     provider
//   );
//   useEffect(() => {
//     setTimeout(() => {
//       contract
//         .signaturesRequired()
//         .then((res) => {
//           if (!res) {
//             throw Error("could not read contract");
//           }

//           return res.toNumber();
//         })
//         .then((data) => {
//           setSignaturesRequired(data);
//           setIsPending(false);
//           setError(null);
//         })
//         .catch((err) => {
//           setIsPending(false);
//           setError(err.message);
//         });
//     }, 1000);
//   }, []);
//   return { signaturesRequired, isPending, error };
// };
