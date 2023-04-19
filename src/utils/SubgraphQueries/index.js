// import { useQuery } from "@apollo/client";
export const GET_WALLET_BY_ADDRESS = gql`
  query getWalletsByAddress($id: String!) {
    owner(id: $id) {
      contracts {
        id
        address
        name
        creator
        signaturesRequired
        owners {
          id
        }
      }
    }
  }
`;
// const getWalletByAddress = ({ id }) =>{
//   const { loading, error, data } = useQuery(GET_WALLET_BY_ADDRESS, {
//     variables: { id },
//   });
//   useEffect(() => {
//     setTimeout(()=>{

//     })

//   }, [third])

// }
