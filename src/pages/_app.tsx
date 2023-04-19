import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { MultiSigInjectProvider } from "../context/MultiSigInjection";
import { alchemyProvider } from "wagmi/providers/alchemy";
import Layout from "../components/Layout";

export const client = new ApolloClient({
  uri: process.env.SUBGRAPH_API_URL,
  cache: new InMemoryCache(),
});
console.log("api key wtf", process.env.ALCHEMY_API_KEY);

const { chains, provider } = configureChains(
  [chain.goerli],
  [
    alchemyProvider({ apiKey: "NX0zVuIVZSWreJ9zbABIAfjF8ZTim44Y" }),
    // publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        modalSize="compact"
        theme={midnightTheme({ overlayBlur: "small" })}
        chains={chains}
      >
        <ApolloProvider client={client}>
          <MultiSigInjectProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MultiSigInjectProvider>
        </ApolloProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
