import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { providers, utils } from "ethers";
import { useAppCommunicator } from "../helpers/comunicator";
import {
  InterfaceMessageIds,
  InterfaceMessageProps,
  Methods,
  MethodToResponse,
  RequestId,
  RPCPayload,
  SignMessageParams,
  SignTypedMessageParams,
  Transaction,
} from "../helpers/types";

interface TransactionWithId extends Transaction {
  id: number;
}
type Props = {
  children?: React.ReactNode;
};
type MultiSigInjectContextType = {
  address: string | undefined;
  appUrl: string | undefined;
  rpcUrl: string | undefined;
  iframeRef: React.RefObject<HTMLIFrameElement> | null;
  newTx: TransactionWithId | undefined;
  setAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
  setAppUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  setRpcUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  setNewTx: React.Dispatch<React.SetStateAction<any>>;
};

export const MultiSigInjectContext = createContext<MultiSigInjectContextType>({
  address: undefined,
  appUrl: undefined,
  rpcUrl: undefined,
  iframeRef: null,
  newTx: undefined,
  setAddress: () => {},
  setAppUrl: () => {},
  setRpcUrl: () => {},
  setNewTx: () => {},
});

export const MultiSigInjectProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const [address, setAddress] = useState<string>();
  const [appUrl, setAppUrl] = useState<string>();
  const [rpcUrl, setRpcUrl] = useState<string>();
  const [provider, setProvider] = useState<providers.StaticJsonRpcProvider>();
  const [newTx, setNewTx] = useState<TransactionWithId>();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const communicator = useAppCommunicator(iframeRef);

  const sendMessageToIframe = useCallback(
    function <T extends InterfaceMessageIds>(
      message: InterfaceMessageProps<T>,
      requestId?: RequestId
    ) {
      const requestWithMessage = {
        ...message,
        requestId: requestId || Math.trunc(window.performance.now()),
        version: "0.4.2",
      };

      if (iframeRef) {
        iframeRef.current?.contentWindow?.postMessage(
          requestWithMessage,
          appUrl!
        );
      }
    },
    [iframeRef, appUrl]
  );

  useEffect(() => {
    if (!rpcUrl) return;

    setProvider(new providers.StaticJsonRpcProvider(rpcUrl));
  }, [rpcUrl]);

  useEffect(() => {
    if (!provider) return;

    communicator?.on(Methods.getSafeInfo, async () => ({
      safeAddress: address,
      chainId: (await provider.getNetwork()).chainId,
      owners: [],
      threshold: 1,
      isReadOnly: false,
    }));

    communicator?.on(Methods.getEnvironmentInfo, async () => ({
      origin: document.location.origin,
    }));

    communicator?.on(Methods.rpcCall, async (msg) => {
      const params = msg.data.params as RPCPayload;

      try {
        const response = (await provider.send(
          params.call,
          params.params
        )) as MethodToResponse["rpcCall"];
        return response;
      } catch (err) {
        return err;
      }
    });

    communicator?.on(Methods.sendTransactions, (msg) => {
      // @ts-expect-error explore ways to fix this
      const transactions = (msg.data.params.txs as Transaction[]).map(
        ({ to, ...rest }) => ({
          to: utils.getAddress(to), // checksummed
          ...rest,
        })
      );
      setNewTx({
        id: parseInt(msg.data.id.toString()),
        ...transactions[0],
      });
      // openConfirmationModal(transactions, msg.data.params.params, msg.data.id)
    });

    communicator?.on(Methods.signMessage, async (msg) => {
      const { message } = msg.data.params as SignMessageParams;

      // openSignMessageModal(message, msg.data.id, Methods.signMessage)
    });

    communicator?.on(Methods.signTypedMessage, async (msg) => {
      const { typedData } = msg.data.params as SignTypedMessageParams;

      // openSignMessageModal(typedData, msg.data.id, Methods.signTypedMessage)
    });
  }, [communicator, address, provider]);

  return (
    <MultiSigInjectContext.Provider
      value={{
        address,
        appUrl,
        rpcUrl,
        iframeRef,
        newTx,
        setNewTx,
        setAddress,
        setAppUrl,
        setRpcUrl,
      }}
    >
      {children}
    </MultiSigInjectContext.Provider>
  );
};

export const useMultiSigInject = () => useContext(MultiSigInjectContext);
