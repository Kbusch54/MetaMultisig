import React, { useEffect, useState } from "react";
import Wallet from "../components/Wallet";
import { gql } from "@apollo/client";
import { client } from "./_app";
import { InfinitySpin } from "react-loader-spinner";

const MyWallets = ({ contracts }) => {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);
  if (contracts && contracts != "") {
    if (!initialRenderComplete) {
      return (
        <div className="flex justify-center ">
          <InfinitySpin color="blue" width="500" />
        </div>
      );
    } else {
      return (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-12 ">
            {contracts.map((wallet, i) => (
              <Wallet
                key={wallet.id}
                owners={wallet.owners}
                name={wallet.name}
                contractId={wallet.id}
                contractAddress={wallet.address}
                sigsReq={wallet.signaturesRequired}
                creator={wallet.creator}
              />
            ))}
          </div>
        </div>
      );
    }
  } else {
    return <div>WOw so empty</div>;
  }
};

export default MyWallets;
export async function getServerSideProps(context) {
  const idFromContext = await context.query.account.toString().toLowerCase();

  const GET_WALLETS = gql`
    query ($id: String) {
      owner(id: $id) {
        contracts {
          id
          address
          name
          creator
          signaturesRequired
          owners {
            id
            address
            contracts {
              id
            }
          }
        }
      }
    }
  `;

  const { data } = await client.query({
    query: GET_WALLETS,

    variables: {
      id: idFromContext,
    },
  });

  if (data.owner != null || data.owner != undefined) {
    return {
      props: {
        contracts: data.owner.contracts,
      },
    };
  } else {
    return {
      props: {
        contracts: "",
      },
    };
  }
}
