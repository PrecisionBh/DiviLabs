import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../../context/WalletContext";

export default function ChainSelect() {
  const chains = [
    "Ethereum", "BNB Chain", "Polygon", "Arbitrum", "Optimism",
    "Avalanche", "Fantom", "Base", "zkSync", "Linea",
    "Scroll", "Metis", "Cronos", "Mantle", "Celo"
  ];

  const [selectedChain, setSelectedChain] = useState(null);
  const { walletAddress } = useWallet();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedChain && walletAddress) {
      navigate("/vault/type");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0c0f1a] text-white px-4 py-12 flex flex-col items-center space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-cyan-400 drop-shadow-lg mb-6">
          Select Your Blockchain
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Choose the network you want to lock tokens on:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
          {chains.map((chain, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedChain(chain)}
              className={`cursor-pointer w-36 h-36 rounded-2xl flex items-center justify-center text-sm px-2 text-center font-semibold transition shadow-lg
                ${
                  selectedChain === chain
                    ? "bg-cyan-900 border-4 border-cyan-400 text-cyan-200 scale-105"
                    : "bg-[#111827] border border-cyan-600 text-cyan-300 hover:shadow-cyan-500/30 hover:scale-105"
                }
              `}
            >
              {chain}
            </div>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedChain || !walletAddress}
          className={`mt-10 px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-lg ${
            selectedChain && walletAddress
              ? "bg-cyan-500 text-black hover:bg-cyan-400"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue to Lock Type
        </button>
      </div>
    </div>
  );
}
