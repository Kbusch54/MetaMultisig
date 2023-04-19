import { useState, useEffect } from "react";
import Modal from "react-modal";
import TransactionDetails from "../components/Modals/TransactionDetails";
import { contracts } from "../utils/Constants/contractAddress";
import { useMultiSigInject } from "../context/MultiSigInjection";
import parseExternalContractTransaction from "../helpers/parseExternalContractTransaction";

export default function IFrame({
  address,
  loadTransactionData,
  price,
  isTxLoaded,
  customNonce,
  setCustomNonce,
  nonce,
  reset = false,
  setDescription,
  description,
  url = null,
  loadingModal = false,
  pendingNonces,
}) {
  const {
    setAddress,
    appUrl,
    setAppUrl,
    setRpcUrl,
    iframeRef,
    newTx,
    setNewTx,
  } = useMultiSigInject();
  const [contractName, setContractName] = useState(null);
  const checkContractName = (to) => {
    contracts.map((contract) => {
      if (contract.address == to) {
        setContractName((prev) => contract.name);
      }
    });
  };

  const [modalIsOpen, setIsOpen] = useState(false);
  const [isIFrameLoading, setIsIFrameLoading] = useState(false);
  const [inputAppUrl, setInputAppUrl] = useState();
  const [tx, setTx] = useState();
  const [parsedTransactionData, setParsedTransactionData] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const modalStyle = {
    content: {
      borderRadius: "2.5rem",
      bottom: "auto",
    },
  };
  useEffect(() => {}, [loadingModal]);

  useEffect(() => {
    setAddress(address);

    setRpcUrl(
      "https://eth-goerli.g.alchemy.com/v2/NX0zVuIVZSWreJ9zbABIAfjF8ZTim44Y"
    );
  }, []);
  useEffect(() => {
    if (url != null) {
      setAppUrl((prev) => url);
      setIsIFrameLoading(true);
    }
  }, [url]);
  useEffect(() => {
    if (reset) {
      closeModal();
    }
  }, [reset]);

  useEffect(() => {
    if (newTx) {
      setTx(newTx);
    }
  }, [newTx]);

  useEffect(() => {
    if (tx) {
      decodeFunctionData();
      checkContractName(tx?.to);
    }
  }, [tx]);

  const decodeFunctionData = async () => {
    try {
      const parsedTransactionData = await parseExternalContractTransaction(
        tx.to,
        tx.data
      );
      setParsedTransactionData(parsedTransactionData);

      setIsModalVisible(true);
      openModal();
    } catch (error) {
      console.log(error);
      setParsedTransactionData(null);
    }
  };

  const hideModal = () => setIsModalVisible(false);
  const onRefresh = () => setRefresh(!refresh);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setInputAppUrl();
    setIsOpen(false);
  }
  const handleOk = () => {
    loadTransactionData({
      to: tx.to,
      value: tx.value,
      data: tx.data,
      isIframe: true,
    });
    setNewTx(false);
  };

  return (
    <div className="flex flex-col items-center ">
      <input
        placeholder="custom dapp URL"
        style={{
          marginTop: 16,
          minWidth: "18rem",
          maxWidth: "20rem",
        }}
        autoFocus={true}
        value={inputAppUrl}
        onChange={(e) => setInputAppUrl(e.target.value)}
      />
      <button
        type={"primary"}
        style={{
          marginTop: "1rem",
          maxWidth: "8rem",
        }}
        onClick={() => {
          setAppUrl(inputAppUrl);
          setIsIFrameLoading(true);
        }}
      >
        {isIFrameLoading ? <>Loading....</> : "Load"}
      </button>
      {appUrl && (
        <div className="flex flex-col items-end">
          <button className="mt-2" onClick={onRefresh}>
            refresh
          </button>
          <iframe
            key={refresh}
            title="app"
            src={appUrl}
            width="1200rem"
            height="900rem"
            style={{
              marginTop: "1rem",
            }}
            ref={iframeRef}
            onLoad={() => setIsIFrameLoading(false)}
          />
        </div>
      )}
      {isModalVisible && (
        <>
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            ariaHideApp={false}
            style={modalStyle}
            contentLabel="TransactionDetails Modal"
          >
            <TransactionDetails
              visible={isModalVisible}
              txnInfo={parsedTransactionData}
              handleOk={handleOk}
              handleCancel={closeModal}
              showFooter={true}
              price={price}
              to={tx.to}
              value={tx.value}
              type="IFrame"
              customNonce={customNonce}
              setCustomNonce={setCustomNonce}
              nonce={nonce}
              contractName={contractName}
              setDescription={setDescription}
              description={description}
              loadingModal={loadingModal}
            />
          </Modal>
        </>
      )}
    </div>
  );
}
