import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x27Ce0569B5f865A1C1F6fA36D66cE07ca329ce35";

const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "unlockTimestamp", "type": "uint256" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "address[]", "name": "unlockers", "type": "address[]" },
      { "internalType": "uint8", "name": "lockType", "type": "uint8" },
      { "internalType": "bool", "name": "mintNFT", "type": "bool" },
      { "internalType": "string", "name": "imageUrl", "type": "string" },
      { "internalType": "string", "name": "projectUrl", "type": "string" },
      { "internalType": "string", "name": "socialLink", "type": "string" },
      {
        "internalType": "struct DiviVaultLockerV2.VestingCheckpoint[]",
        "name": "checkpoints",
        "type": "tuple[]",
        "components": [
          { "internalType": "uint256", "name": "releaseTime", "type": "uint256" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "bool", "name": "claimed", "type": "bool" }
        ]
      }
    ],
    "name": "lockTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

const LP_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)"
];

export default function PromoPage() {
  const [lockData, setLockData] = useState(null);
  const navigate = useNavigate();
  const totalCost = 0.25;

  useEffect(() => {
    const stored = localStorage.getItem("diviLockData");
    if (stored) setLockData(JSON.parse(stored));
  }, []);

  const handleApprove = async () => {
    try {
      if (!window.ethereum || !lockData?.lpAddress) {
        alert("Wallet or LP token address not found.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const lp = new ethers.Contract(lockData.lpAddress, LP_ABI, signer);
      const approveAmount = ethers.MaxUint256;

      const tx = await lp.approve(CONTRACT_ADDRESS, approveAmount);
      await tx.wait();

      alert("✅ LP token approved successfully!");
    } catch (err) {
      console.error("Approval failed:", err);
      alert("❌ Approval transaction failed.");
    }
  };

  const handleConfirm = async () => {
    try {
      if (!window.ethereum || !lockData) {
        alert("Wallet or lock data not found.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const userAddress = await signer.getAddress();
      const walletBalance = await provider.getBalance(userAddress);
      const fee = ethers.parseEther(totalCost.toString());
      const buffer = ethers.parseEther("0.005");

      if (walletBalance < fee + buffer) {
        alert("⚠️ Not enough BNB to cover the fee + gas.");
        return;
      }

      const unlockTimestamp = Math.floor(Date.now() / 1000) + (parseInt(lockData.daysToLock) * 86400);
      const rawAmount = lockData.calculatedAmount?.toString() || "0";
      const amountInWei = ethers.parseUnits(rawAmount, 18);

      if (!lockData.lpAddress || amountInWei <= 0n) {
        alert("Invalid lock amount or LP token address.");
        return;
      }

      const name = lockData.lockName || "Divi Lock";
      const websiteLink = lockData.websiteLink || "https://divilabs.ai";
      const socialLink = lockData.socialLink || "https://x.com/DiviOfficial";
      const imageUrl = ""; // no NFT

      const emptyVestingStruct = [];

      const tx = await contract.lockTokens(
        lockData.lpAddress,
        amountInWei,
        unlockTimestamp,
        name,
        [userAddress],
        0,
        false, // mintNFT is false
        imageUrl,
        websiteLink,
        socialLink,
        emptyVestingStruct,
        { value: fee }
      );

      await tx.wait();
      navigate(`/vault/result?status=success&tx=${tx.hash}`);
    } catch (err) {
      console.error("Transaction failed:", err);
      navigate("/vault/result?status=fail");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0c0f1a] text-white px-4 py-12 flex flex-col items-center space-y-12">
      <h1 className="text-4xl font-extrabold text-cyan-400 drop-shadow-lg">Finalize Your Lock</h1>
      <p className="text-lg text-center text-gray-300 max-w-xl">
        Your lock is ready. Confirm to lock your LP tokens securely on-chain.
      </p>

      <div className="bg-[#111827] border border-cyan-500 rounded-2xl px-8 py-6 w-full max-w-xl space-y-6 shadow-xl">
        <div className="text-lg font-bold text-cyan-300">
          Total Fee: <span className="text-white">{totalCost.toFixed(2)} BNB</span>
        </div>

        <div className="text-sm text-orange-300 font-medium">
          ⚠️ Once you confirm, your tokens will be locked permanently until the unlock date.
        </div>

        <button
          onClick={handleApprove}
          className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg transition"
        >
          Approve LP Tokens
        </button>

        <button
          onClick={handleConfirm}
          className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg transition"
        >
          Confirm & Lock
        </button>
      </div>
    </div>
  );
}
