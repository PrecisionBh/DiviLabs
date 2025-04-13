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
      { "internalType": "uint8", "name": "lockType", "type": "uint8" }, // 0 = LP, 1 = team tokens
      { "internalType": "bool", "name": "mintNFT", "type": "bool" },
      { "internalType": "string", "name": "imageUrl", "type": "string" },
      { "internalType": "string", "name": "projectUrl", "type": "string" },
      { "internalType": "string", "name": "socialLink", "type": "string" },
      { "internalType": "uint256[]", "name": "vestingCheckpoints", "type": "uint256[]" }
    ],
    "name": "lockTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];


export default function PromoPage() {
  const [withNFT, setWithNFT] = useState(false);
  const [lockData, setLockData] = useState(null);
  const navigate = useNavigate();

  const totalCost = withNFT ? 1.0 : 0.25;

  useEffect(() => {
    const stored = localStorage.getItem("diviLockData");
    if (stored) setLockData(JSON.parse(stored));
  }, []);

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
      const amountInWei = ethers.parseUnits(lockData.calculatedAmount.toString(), 18);

      const tx = await contract.lockTokens(
        lockData.lpAddress,
        amountInWei,
        unlockTimestamp,
        lockData.lockName || "",
        [userAddress],
        0, // LP lock
        withNFT,
        withNFT ? "https://indigo-added-salamander-982.mypinata.cloud/ipfs/bafybeifytypsenulzzlg5wq522sldamklrv4ss4n6sut5p5r5x6aigvqgm" : "",
        lockData.websiteLink || "",
        lockData.socialLink || "",
        [],
        { value: fee }
      );      

      await tx.wait();
      navigate("/vault/result?status=success");
    } catch (err) {
      console.error("Transaction failed:", err);
      navigate("/vault/result?status=fail");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0c0f1a] text-white px-4 py-12 flex flex-col items-center space-y-12">
      <h1 className="text-4xl font-extrabold text-cyan-400 drop-shadow-lg">Promote Your Lock</h1>
      <p className="text-lg text-center text-gray-300 max-w-xl">
        Mint a glowing NFT card to showcase your lock across the Divi ecosystem. Your lock will
        appear publicly with a visual badge of authenticity.
      </p>

      <div className="bg-[#111827] border border-cyan-500 rounded-2xl px-8 py-6 w-full max-w-xl space-y-6 shadow-xl">
        <label className="flex items-center space-x-4 text-cyan-200 font-semibold">
          <input
            type="checkbox"
            checked={withNFT}
            onChange={() => setWithNFT(!withNFT)}
            className="w-5 h-5 accent-cyan-500"
          />
          <span>Mint Promotional NFT (+0.75 BNB)</span>
        </label>

        <div className="text-lg font-bold text-cyan-300">
          Estimated Total Fee: <span className="text-white">{totalCost.toFixed(2)} BNB</span>
        </div>

        <div className="text-sm text-orange-300 font-medium">
          ⚠️ Once you confirm, your tokens will be locked permanently until the unlock date.
        </div>

        <button
          onClick={handleConfirm}
          className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg transition"
        >
          Confirm & Approve Lock
        </button>
      </div>

      {/* NFT Example Preview */}
      <div className="mt-4 text-center">
        <p className="text-cyan-300 mb-4 font-semibold text-xl">Example Promotion NFT</p>
        <div className="text-sm text-gray-400 max-w-sm mx-auto mb-2">
          This NFT is minted to your wallet as proof your lock exists on-chain.
        </div>
        <div className="relative w-[330px] md:w-[360px] rounded-2xl overflow-hidden border-2 border-cyan-500 shadow-[0_0_20px_#00e5ff80] bg-black">
          <img
            src="https://indigo-added-salamander-982.mypinata.cloud/ipfs/bafybeifytypsenulzzlg5wq522sldamklrv4ss4n6sut5p5r5x6aigvqgm"
            alt="Divi Vault NFT"
            className="w-full h-[450px] object-cover opacity-95"
          />
        </div>
      </div>
    </div>
  );
}
