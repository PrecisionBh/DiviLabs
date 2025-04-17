import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ethers } from "ethers";

export default function ContractCreatorLanding() {
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to continue.");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    localStorage.setItem("connected_wallet", address);

    navigate("/contract-creator/token-details");
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-5xl md:text-6xl font-extrabold text-cyan-400 drop-shadow-[0_0_30px_#00e5ff] text-center mb-6">
        Divi Labs Contract Creator
      </h1>
      <p className="text-cyan-200 text-lg text-center max-w-2xl mb-10 drop-shadow-[0_0_12px_#00e5ff80]">
        Deploy your own secure token contract with no coding required. Choose features, preview code, and launch directly to the blockchain.
      </p>

      <button
        onClick={handleStart}
        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-[0_0_20px_#00e5ff] transition animate-pulse"
      >
        Start Building
      </button>

      <button
        onClick={() => navigate("/my-contracts")}
        className="mt-4 px-6 py-2 border border-cyan-400 text-cyan-300 hover:bg-cyan-600 hover:text-black rounded-xl text-sm"
      >
        View My Contracts
      </button>
    </div>
  );
}
