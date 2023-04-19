import React from "react";
import Modal from "react-modal";
import CreateMultiSig from "../components/Modals/CreateMultiSig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
type Props = {
  address: string;
};

const Hero = (props: Props) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const notifyReject = (message: string) => {
    toast.error(
      <>
        <p>ERROR</p> <h3>Reason: {message}</h3>
      </>,
      {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );
  };
  const notifySuccess = (message: string, hash: string) => {
    // e.preventDefault();
    toast.success(
      <>
        <p>Success</p> <h3>{message}</h3> <br />{" "}
        <a
          target="_blank"
          rel="noopener
        noreferrer"
          href={`https://goerli.etherscan.io/tx/${hash}`}
        >
          Etherscan
        </a>
      </>,
      {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );
  };

  const notifyError = (message: string, error: string) => {
    // e.preventDefault();
    toast.error(
      <>
        <p>Contract Error</p> <h3>{message}</h3> <br />{" "}
        <a
          target="_blank"
          rel="noopener
        noreferrer"
          href={`https://goerli.etherscan.io/tx/${error}`}
        >
          Etherscan
        </a>
      </>,
      {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );
  };

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        ariaHideApp={false}
        // className={"max-w-lg"}
        // style={customStyles}
        contentLabel="Example Modal"
      >
        {" "}
        <CreateMultiSig
          address={props.address}
          closeModal={closeModal}
          notifySuccess={notifySuccess}
          notifyError={notifyError}
          notifyReject={notifyReject}
        />
      </Modal>
      <div className="flex flex-col justify-center  ">
        <div className="ml-8 px-2 py-4">
          <div className="text-3xl  text-[#FFFFFF]">
            Welcome to METAMultiSig
          </div>
          <p className="text-lg ml-6 px-8 text-white">
            This is an offchain mutlisig wallet that allows you and other owners
            to sign transactions off chain then proof onchain prior to
            execution. Either create a new wallet or import an existing wallet
            that you made with us
          </p>
        </div>

        <div className="border-2 gap-3  border-white flex flex-row  justify-between align-top bg-[#f18805] px-12 pt-4 pb-24 rounded-lg w-2/3 ml-12 relative">
          <div className=" w-1/2 relative ">
            <div className="text-2xl text-white">Create a Wallet</div>
            <p className="mt-2 text-white">
              Create a multisig wallet. Add other signers addresses and name of
              wallet. You will have to pay gas, on chain.
            </p>
            <button onClick={openModal} className="hero-button">
              Create MetaMutliSigWallet
            </button>
          </div>
          <div className="border h-full  left-[29.5rem] absolute bottom-[0.05rem]"></div>
          <div className="w-1/2 relative">
            <div className="text-2xl text-white">Load Exsiting Wallet</div>
            <p className="mt-2 text-white">
              Load an exsiting wallet address. Any wallet contract will work as
              long as the abi is the same. If loading an other wallet not all
              functionallity of this dapp will be available, security cannot be
              gaurenteed. Or load an existing wallet contract that you created
              with us that is not showing up
            </p>

            <button className="hero-button">Import Exsiting Wallet</button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={1}
      />
    </div>
  );
};

export default Hero;
