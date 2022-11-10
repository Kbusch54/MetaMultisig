// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from "next";
import { axios } from "axios";
// import { groq } from "next-sanity";
// import { sanityClient } from "../../sanity";
// import { Social } from "../../typings";

// type Data = {
//   socials: Social[];
// };

export default async function handler(
  req,
  // : NextApiRequest,
  res
  // : NextApiResponse<Data>
) {
  const transactionsData = await axios.get(
    process.env.PORT ||
      49899 + process.env.PORT ||
      49899 + address + "_" + chainId
  );
  res.status(200).json({ socials });
}
