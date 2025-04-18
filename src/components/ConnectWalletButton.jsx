import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function ConnectWalletButton() {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not detected. Please install it.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      setWalletAddress(address);
      localStorage.setItem("connected_wallet", address);
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      const saved = localStorage.getItem("connected_wallet");
      if (saved) {
        setWalletAddress(saved);
      } else if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      }
    };
    checkConnection();
  }, []);

  const shortAddress =
    typeof walletAddress === "string" && walletAddress.length >= 10
      ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
      : "Connect Wallet";

  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={connectWallet}
        className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm rounded-xl shadow-lg transition animate-pulse-slow"
      >
        {shortAddress}
      </button>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(6, 182, 212, 0.4); }
          50% { opacity: 0.9; box-shadow: 0 0 20px rgba(6, 182, 212, 0.8); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
