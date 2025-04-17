import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../context/WalletContext";

const CONTRACT_ADDRESS = "0x27Ce0569B5f865A1C1F6fA36D66cE07ca329ce35";
const CONTRACT_ABI = [
  "function nextLockId() view returns (uint256)",
  "function locks(uint256) view returns (address token, uint256 amount, uint256 unlockTime, uint8 lockType, address creator, bool withdrawn)",
  "function claim(uint256 lockId) external"
];

export default function ClaimPage() {
  const { walletAddress, connectWallet } = useWallet();
  const [claimableLocks, setClaimableLocks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (walletAddress) fetchClaimableLocks();
  }, [walletAddress]);

  const fetchClaimableLocks = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const totalLocks = await contract.nextLockId();
      const claimables = [];

      for (let i = 0; i < totalLocks; i++) {
        const lock = await contract.locks(i);
        const isCreator = lock.creator?.toLowerCase() === walletAddress.toLowerCase();
        const isUnlocked = Number(lock.unlockTime || 0) <= Date.now() / 1000;
        const notWithdrawn = !lock.withdrawn;

        if (isCreator && isUnlocked && notWithdrawn) {
          claimables.push({ lockId: i, ...lock });
        }
      }

      setClaimableLocks(claimables);
    } catch (err) {
      console.error("Failed to fetch claimable locks:", err);
    }
    setLoading(false);
  };

  const handleClaim = async (lockId) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.claim(lockId);
      await tx.wait();

      alert(`✅ Successfully claimed Lock #${lockId}`);
      fetchClaimableLocks();
    } catch (err) {
      console.error("Claim failed:", err);
      alert("❌ Claim failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#070B17] text-white px-6 py-12">
      <h1 className="text-center text-4xl font-bold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff] mb-8">
        Claim Your Locked Tokens
      </h1>

      {!walletAddress && (
        <div className="text-center">
          <button
            onClick={connectWallet}
            className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-full shadow-lg hover:bg-cyan-600 transition"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {loading && (
        <p className="text-center text-cyan-300 animate-pulse mt-6">Loading claimable locks...</p>
      )}

      {walletAddress && !loading && claimableLocks.length === 0 && (
        <p className="text-center text-cyan-500 mt-6">No claimable locks found.</p>
      )}

      {claimableLocks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto">
          {claimableLocks.map((lock, idx) => {
            const tokenAddress = lock.token || "Unknown";
            const rawAmount = lock.amount || 0;
            const unlockTs = Number(lock.unlockTime || 0);

            let formattedAmount = "Unknown";
            try {
              if (rawAmount && rawAmount !== "0") {
                formattedAmount = ethers.formatUnits(rawAmount.toString(), 18);
              }
            } catch (err) {
              console.warn("Failed to format amount:", rawAmount, err);
            }

            const unlockTime = unlockTs > 0
              ? new Date(unlockTs * 1000).toLocaleString()
              : "Unknown";

            return (
              <div
                key={idx}
                className="bg-[#0e1016] border border-cyan-500 rounded-xl p-6 shadow-[0_0_20px_#00e5ff50]"
              >
                <p className="font-bold text-cyan-300 mb-1">Lock ID: {lock.lockId}</p>
                <p className="text-sm text-white break-all">Token Contract: {tokenAddress}</p>
                <p className="text-sm text-white">Locked Amount: {formattedAmount}</p>
                <p className="text-sm text-white">Unlock Time: {unlockTime}</p>

                <button
                  onClick={() => handleClaim(lock.lockId)}
                  className="mt-4 w-full py-2 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-600 transition"
                >
                  🔓 Claim Now
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
